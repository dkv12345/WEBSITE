import logging
from apscheduler.schedulers.background import BackgroundScheduler
from services.recommendation_service import RecommendationService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_svd_job():
    logger.info("[Job] Triggering offline SVD recommendation pipeline...")
    try:
        service = RecommendationService()
        service.run_offline_svd_pipeline()
        logger.info("[Job] Offline SVD recommendation pipeline completed successfully.")
    except Exception as e:
        logger.error(f"[Job] Error during SVD recommendation job: {e}", exc_info=True)

def start_recommendation_scheduler():
    try:
        scheduler = BackgroundScheduler()
        # Schedule cron job to run daily at 02:00 AM
        scheduler.add_job(run_svd_job, 'cron', hour=2, minute=0)
        scheduler.start()
        logger.info("[Scheduler] Background SVD Recommendation job scheduled successfully at 02:00 AM daily.")
        
        # Trigger an immediate run in the background to build recommendations cache initially
        scheduler.add_job(run_svd_job)
    except Exception as err:
        logger.error(f"[Scheduler] Failed to initialize APScheduler background job: {err}", exc_info=True)
