import os
import numpy as np
import json
from pymongo import MongoClient, UpdateOne
from bson.objectid import ObjectId
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

def sync_embeddings():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("MONGO_URI not found in environment variables.")
        return

    cache_dir = os.path.join(os.path.dirname(__file__), "cache")
    embeddings_path = os.path.join(cache_dir, "embeddings.npy")
    metadata_path = os.path.join(cache_dir, "metadata.json")

    if not os.path.exists(embeddings_path) or not os.path.exists(metadata_path):
        print("Cache files do not exist. Please start the AI engine first to generate them.")
        return

    print("Loading cached embeddings and metadata...")
    embeddings = np.load(embeddings_path)
    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    if len(embeddings) != len(metadata):
        print(f"Mismatch: {len(embeddings)} embeddings vs {len(metadata)} metadata items.")
        return

    print(f"Connecting to MongoDB...")
    client = MongoClient(mongo_uri)
    db = client["bookstore_db"]
    books_col = db["books"]

    print("Preparing bulk update operations...")
    operations = []
    for i, meta in enumerate(metadata):
        book_id = meta["id"]
        vector = embeddings[i].tolist()
        
        operations.append(
            UpdateOne(
                {"_id": ObjectId(book_id)},
                {
                    "$set": {
                        "embedding_vector": vector,
                        "mlops_metadata": {
                            "embedding_status": "completed",
                            "embedding_updatedAt": datetime.utcnow()
                        }
                    }
                }
            )
        )

    print(f"Executing bulk update for {len(operations)} books in MongoDB...")
    result = books_col.bulk_write(operations)
    print(f"Update complete! Match count: {result.matched_count}, Modified count: {result.modified_count}")

if __name__ == "__main__":
    sync_embeddings()
