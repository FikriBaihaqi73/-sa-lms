import "dotenv/config";
import { Worker } from "bullmq";
import { getPrisma } from "@repo/shared/infrastructure/database/client";

console.log("Workers starting...");

if (process.env.REDIS_ENABLED !== "true") {
  console.log(
    "[Worker] Redis worker is disabled. Set REDIS_ENABLED=true to enable it.",
  );
  setInterval(() => undefined, 2_147_483_647);
} else {
  const prisma = getPrisma();

  const worker = new Worker(
    "main-queue",
    async (job) => {
      console.log(`[Worker] Processing job ${job.id}...`);

      // Example DB interaction
      const user = await prisma.users.findFirst();
      console.log(`[Worker] Found user: ${user?.username}`);
    },
    {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
      },
    },
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed!`);
  });

  worker.on("error", (err) => {
    console.error(`[Worker] Connection error: ${err.message}`);
  });
}
