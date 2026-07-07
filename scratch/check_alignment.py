import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

def check():
    mongo_uri = os.getenv("MONGO_URI")
    client = MongoClient(mongo_uri)
    db = client["bookstore_db"]
    books_col = db["books"]
    
    metadata_path = "../ai_engine/cache/metadata.json"
    if not os.path.exists(metadata_path):
        print("Metadata cache not found.")
        return

    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)
        
    print("Local cache count:", len(metadata))
    db_count = books_col.count_documents({})
    print("DB count:", db_count)

    # Fetch all db books (title + author)
    db_books = list(books_col.find({}, {"title": 1, "author": 1}))
    db_map = {}
    for b in db_books:
        key = (b.get("title", "").strip().lower(), b.get("author", "").strip().lower())
        db_map[key] = str(b["_id"])

    matched = 0
    mismatched = []
    for meta in metadata[:100]:
        key = (meta.get("title", "").strip().lower(), meta.get("author", "").strip().lower())
        if key in db_map:
            matched += 1
        else:
            mismatched.append(meta)

    print("Matching rate in first 100:", matched)
    if mismatched:
        print("Sample mismatched from cache:", mismatched[0])
    
check()
