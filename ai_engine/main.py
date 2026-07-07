from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from search_service import SearchService

app = FastAPI(
    title="BookHaven AI Engine",
    description="FastAPI AI Engine for intent parsing, hybrid search retrieval, and cross-encoder reranking.",
    version="1.0.0"
)

# Enable CORS (allow connections from Express gateway)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global search service instance
search_service = None

@app.on_event("startup")
def startup_event():
    global search_service
    print("[AI Engine] Starting up and indexing books...")
    search_service = SearchService()
    print("[AI Engine] Startup complete. Ready to serve searches.")
    
    # Start the offline background SVD recommendation cron scheduler
    try:
        from jobs.recommendation_job import start_recommendation_scheduler
        print("[AI Engine] Launching background SVD recommendation cron scheduler...")
        start_recommendation_scheduler()
    except Exception as e:
        print(f"[AI Engine] Error starting recommendation scheduler: {e}")

@app.get("/health")
def health_check():
    """Simple endpoint to verify server status."""
    is_ready = search_service is not None
    return {
        "status": "healthy" if is_ready else "initializing",
        "service": "BookHaven AI Engine",
        "ready": is_ready
    }

@app.get("/api/v1/search")
def search_books(q: str = Query(..., description="The query string to search for")):
    """
    GET /api/v1/search
    Accepts a query 'q', performs intent parsing, retrieves candidate books using hybrid search (BM25 + Vector),
    merges them using RRF, reranks with a Cross-Encoder, and returns the top 20 candidate IDs.
    """
    global search_service
    if not search_service:
        raise HTTPException(
            status_code=503, 
            detail="AI Search Engine is still initializing. Please try again shortly."
        )
    
    query_str = q.strip()
    if not query_str:
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")
        
    try:
        result = search_service.perform_hybrid_search(query_str)
        return result
    except Exception as e:
        print(f"[AI Engine] Error during search: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while processing the search: {str(e)}"
        )

@app.get("/api/v1/recommend")
def recommend_books(
    userId: str = Query(..., description="The user ID to generate recommendations for"),
    pageType: str = Query("Homepage", description="The context page type (Homepage or Book Detail)"),
    itemId: str = Query(None, description="The book ID currently viewed if pageType is Book Detail")
):
    """
    GET /api/v1/recommend
    Generates 20 hybrid recommendation book IDs for a user based on preferences, content, behavior, and page context.
    """
    global search_service
    if not search_service:
        raise HTTPException(
            status_code=503, 
            detail="AI Search Engine is still initializing. Please try again shortly."
        )
    
    user_id_str = userId.strip()
    if not user_id_str:
        raise HTTPException(status_code=400, detail="User ID cannot be empty.")
        
    try:
        recommended_ids = search_service.get_hybrid_recommendations(
            user_id_str=user_id_str,
            page_type=pageType,
            item_id_str=itemId
        )
        return recommended_ids
    except Exception as e:
        print(f"[AI Engine] Error during recommendation: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while generating recommendations: {str(e)}"
        )
