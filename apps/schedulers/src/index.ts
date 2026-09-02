import "dotenv/config";
import { CronJob } from "cron";
import { getPrisma } from "@repo/shared/infrastructure/database/client";

console.log("Schedulers starting...");

if (process.env.SCHEDULER_ENABLED !== "true") {
  console.log(
    "[Scheduler] Scheduler is disabled. Set SCHEDULER_ENABLED=true to enable it.",
  );
  setInterval(() => undefined, 2_147_483_647);
} else {
  const prisma = getPrisma();

  const job = new CronJob("* * * * *", async () => {
    try {
      const userCount = await prisma.users.count();
      console.log(`[Job] Total users in DB: ${userCount}`);
    } catch (err) {
      console.error("[Job] Error executing cron task:", err);
    }
  });

  job.start();
}
