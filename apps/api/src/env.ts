import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: rootEnvPath });
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.API_PORT ?? 4000),
  corsOrigin: process.env.API_CORS_ORIGIN ?? "http://localhost:3000",
  apiKey: process.env.API_KEY ?? "local-dev-api-key",
  contactWebhookSecret: process.env.CONTACT_WEBHOOK_SECRET ?? "local-dev-contact-secret",
  databasePath: process.env.DATABASE_PATH ?? "./data/qlidex.sqlite"
};
