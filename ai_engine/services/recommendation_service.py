import os
import math
from datetime import datetime, timedelta
import numpy as np
from pymongo import MongoClient, UpdateOne
from bson import ObjectId
from models.recommender import FunkSVD

class RecommendationService:
    def __init__(self):
        self.mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = os.getenv("DB_NAME", "test")
        self.decay_lambda = 0.05 # decays to half roughly every 14 days
        
        # Interaction type weights
        self.weights = {
            "view": 1.0,
            "cart": 3.0,
            "purchase": 5.0
        }

    def run_offline_svd_pipeline(self):
        """Runs the complete time-aware SVD batch pipeline."""
        print("[RecommendationService] Starting offline SVD pipeline job...")
        client = MongoClient(self.mongo_uri)
        db = client[self.db_name]
        
        users_col = db["users"]
        books_col = db["books"]
        interactions_col = db["interactions"]
        cache_col = db["recommendation_cache"]

        # Ensure TTL index on calculatedAt field (expires after 7 days)
        cache_col.create_index("calculatedAt", expireAfterSeconds=7 * 24 * 3600)

        # 1. Ingest Data
        users = list(users_col.find({}, {"_id": 1}))
        books = list(books_col.find({}, {"_id": 1, "genres": 1}))
        interactions = list(interactions_col.find({}))

        if not users or not books or not interactions:
            print("[RecommendationService] Insufficient data to train SVD models. Aborting.")
            return

        # Map IDs to continuous index
        user_to_idx = {user["_id"]: idx for idx, user in enumerate(users)}
        idx_to_user = {idx: user["_id"] for idx, user in enumerate(users)}
        
        book_to_idx = {book["_id"]: idx for idx, book in enumerate(books)}
        idx_to_book = {idx: book["_id"] for idx, book in enumerate(books)}
        
        book_genres = {book["_id"]: [g.lower() for g in book.get("genres", [])] for book in books}

        # 2. Time-Decay Calculations & Weighted interactions compilation
        processed_interactions = []
        user_purchased = {user["_id"]: set() for user in users}
        user_interacted_genres = {user["_id"]: {} for user in users}

        now = datetime.utcnow()

        for interaction in interactions:
            u_id = interaction.get("userId")
            b_id = interaction.get("bookId")
            
            if u_id not in user_to_idx or b_id not in book_to_idx:
                continue

            u_idx = user_to_idx[u_id]
            b_idx = book_to_idx[b_id]

            # Ingest raw weight
            action = interaction.get("type", "view")
            w_raw = self.weights.get(action, 1.0)

            # Decay factor calculation
            created_at = interaction.get("createdAt")
            if not created_at:
                created_at = now
            elif isinstance(created_at, str):
                try:
                    created_at = datetime.fromisoformat(created_at.replace("Z", ""))
                except Exception:
                    created_at = now

            delta_days = (now - created_at).total_seconds() / (24 * 3600)
            w_decayed = w_raw * math.exp(-self.decay_lambda * max(0.0, delta_days))

            processed_interactions.append((u_idx, b_idx, w_decayed))

            # Store purchases to filter out later
            if action == "purchase":
                user_purchased[u_id].add(b_id)

            # Compile user preferences based on genre count weights
            genres = book_genres.get(b_id, [])
            for g in genres:
                user_interacted_genres[u_id][g] = user_interacted_genres[u_id].get(g, 0.0) + w_decayed

        if not processed_interactions:
            print("[RecommendationService] No interactions gathered. Aborting.")
            return

        # Normalize user genre counts to preference vectors
        user_genre_profiles = {}
        for u_id, genres_dict in user_interacted_genres.items():
            total = sum(genres_dict.values())
            if total > 0:
                user_genre_profiles[u_id] = {g: count / total for g, count in genres_dict.items()}
            else:
                user_genre_profiles[u_id] = {}

        # 3. Train Funk SVD
        print(f"[RecommendationService] Training SVD on {len(processed_interactions)} interactions for {len(users)} users...")
        svd = FunkSVD(n_factors=12, learning_rate=0.015, regularization=0.02, epochs=15)
        svd.fit(len(users), len(books), processed_interactions)

        # 4. Generate & Rerank recommendations
        bulk_operations = []

        for u_idx, u_id in idx_to_user.items():
            purchased_books = user_purchased.get(u_id, set())
            genre_profile = user_genre_profiles.get(u_id, {})

            # Predict ratings for all items
            user_predictions = []
            for b_idx, b_id in idx_to_book.items():
                if b_id in purchased_books:
                    continue  # Filter out purchased books
                
                # Get collaborative score
                svd_score = svd.predict(u_idx, b_idx)
                
                # Compute content overlap score (Jaccard similarity style or weighted dot)
                genres = book_genres.get(b_id, [])
                content_score = sum(genre_profile.get(g, 0.0) for g in genres)
                
                # Hybrid fusion score
                hybrid_score = 0.7 * svd_score + 0.3 * content_score
                user_predictions.append((b_id, hybrid_score))

            # Retrieve top 100 predictions by hybrid score
            user_predictions.sort(key=lambda x: x[1], reverse=True)
            top_100 = user_predictions[:100]

            # Re-rank / Slice top 50 books
            top_50_ids = [b_id for b_id, _ in top_100[:50]]

            # Write upsert mapping
            bulk_operations.append(
                UpdateOne(
                    {"userId": u_id},
                    {
                        "$set": {
                            "bookIds": top_50_ids,
                            "calculatedAt": now
                        }
                    },
                    upsert=True
                )
            )

        # 5. Bulk write to cache
        if bulk_operations:
            print(f"[RecommendationService] Performing bulk write of {len(bulk_operations)} recommendations...")
            result = cache_col.bulk_write(bulk_operations)
            print(f"[RecommendationService] Pipeline complete. Upserted: {result.upserted_count}, Modified: {result.modified_count}")
        else:
            print("[RecommendationService] No recommendations updated.")
