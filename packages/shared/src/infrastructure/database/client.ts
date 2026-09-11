import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

import { PrismaClient } from "#generated/client";

const envPaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "packages", "shared", ".env"),
  resolve(process.cwd(), "apps", "api", ".env"),
  resolve(process.cwd(), "..", "..", "packages", "shared", ".env"),
];

for (const path of envPaths) {
  if (existsSync(path)) {
    loadEnv({ path });
  }
}

let prisma: PrismaClient;

export const getPrisma = () => {
  if (!prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "" });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  return prisma;
};
