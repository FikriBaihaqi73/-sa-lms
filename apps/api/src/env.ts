import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, "..");
const distAppRoot = resolve(currentDir, "..", "..");
const repoRoot = resolve(currentDir, "..", "..");
const distRepoRoot = resolve(currentDir, "..", "..", "..");

const envPaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "apps", "api", ".env"),
  resolve(process.cwd(), "packages", "shared", ".env"),
  resolve(process.cwd(), "..", "..", "packages", "shared", ".env"),
  resolve(appRoot, ".env"),
  resolve(distAppRoot, ".env"),
  resolve(repoRoot, "packages", "shared", ".env"),
  resolve(distRepoRoot, "packages", "shared", ".env"),
];

for (const path of envPaths) {
  if (existsSync(path)) {
    config({ path });
  }
}
