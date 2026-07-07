import cron from "node-cron";
import { runYearlyLookbackBatchPipeline } from "../services/yearly_lookback_service.js";

export const startCronJobs = () => {
  console.log("[CronJobs] Initializing cron job scheduler...");

  // Schedule December 1st at 00:00 AM every year
  cron.schedule("0 0 1 12 *", async () => {
    console.log("[CronJobs] Dec 1st Yearly Lookback trigger activated.");
    try {
      await runYearlyLookbackBatchPipeline();
    } catch (err) {
      console.error("[CronJobs] Error running Dec 1st Yearly Lookback batch:", err);
    }
  });

  console.log("[CronJobs] Yearly Lookback scheduled for December 1st at 00:00 AM.");
  
  // Optionally trigger once in background to verify database logs on initialization if needed
  if (process.env.TRIGGER_LOOKBACK_ON_START === "true") {
    console.log("[CronJobs] Immediate test trigger activated via env variable.");
    runYearlyLookbackBatchPipeline().catch(err => {
      console.error("[CronJobs] Immediate test trigger lookback failed:", err);
    });
  }
};
