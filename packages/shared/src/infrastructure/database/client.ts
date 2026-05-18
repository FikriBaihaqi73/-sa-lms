import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import config from "../../config/database.js";
import { PrismaClient } from "#generated/client";

let prisma: PrismaClient;

export const getPrisma = () => {
  if (!prisma) {
    const pool = new Pool({ connectionString: config.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  return prisma;
};
