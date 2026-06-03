import { createDatabase } from "./db.js";
import { env } from "./env.js";

const database = createDatabase(env.databasePath);
database.close();

console.log("Database migrations applied.");
