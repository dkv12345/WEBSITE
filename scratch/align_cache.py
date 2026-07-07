import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

def align():
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
        
    print(f"Local cache count: {len(metadata)}")
    db_books = list(books_col.find({}, {"_id": 1, "title": 1, "author": 1}))
    print(f"DB books count: {len(db_books)}")

    # Create a mapping of (title, author) -> list of _ids
    db_map = {}
    for b in db_books:
        title = b.get("title", "").strip().lower()
        author = b.get("author", "").strip().lower()
        key = (title, author)
        if key not in db_map:
            db_map[key] = []
        db_map[key].append(str(b["_id"]))

    # Match each item in metadata to a unique id in db_map
    new_metadata = []
    matched = 0
    not_found = 0
    
    # We will consume IDs from db_map to handle duplicates correctly
    db_map_consumed = {k: 0 for k in db_map}

    for meta in metadata:
        title = meta.get("title", "").strip().lower()
        author = meta.get("author", "").strip().lower()
        key = (title, author)
        
        if key in db_map:
            idx = db_map_consumed[key]
            if idx < len(db_map[key]):
                meta_id = db_map[key][idx]
                db_map_consumed[key] += 1
                meta["id"] = meta_id
                matched += 1
            else:
                # Duplicates ran out of database IDs, reuse the last one or log
                meta_id = db_map[key][-1]
                meta["id"] = meta_id
                matched += 1
        else:
            not_found += 1

        new_metadata.append(meta)

    print(f"Matched: {matched}, Not found: {not_found}")
    
    if not_found > 0:
        print("WARNING: Some books were not found in the DB. Not overwriting cache.")
        return

    # Backup the old metadata.json
    backup_path = metadata_path + ".bak"
    os.rename(metadata_path, backup_path)
    print(f"Backed up old metadata to {backup_path}")

    # Write new metadata.json
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(new_metadata, f, ensure_ascii=False, indent=2)
    print("Successfully wrote updated metadata.json aligned with current database!")

if __name__ == "__main__":
    align()
