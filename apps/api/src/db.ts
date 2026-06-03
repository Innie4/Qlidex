import Database, { type Database as SqliteDatabase } from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type DatabaseHandle = {
  createContactSubmission(submission: ContactSubmission): void;
  listContactSubmissions(): ContactSubmission[];
  close(): void;
};

type MigrationRow = {
  name: string;
};

function resolveDatabasePath(databasePath: string) {
  if (databasePath === ":memory:") {
    return databasePath;
  }

  const resolvedPath = path.resolve(process.cwd(), databasePath);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  return resolvedPath;
}

function runMigrations(database: SqliteDatabase) {
  const migrationsDir = path.resolve(process.cwd(), "migrations");

  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = new Set(
    database.prepare("SELECT name FROM schema_migrations").all().map((row) => (row as MigrationRow).name)
  );

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    if (applied.has(file)) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    const applyMigration = database.transaction(() => {
      database.exec(sql);
      database.prepare("INSERT INTO schema_migrations (name) VALUES (?)").run(file);
    });

    applyMigration();
  }
}

export function createDatabase(databasePath: string): DatabaseHandle {
  const database = new Database(resolveDatabasePath(databasePath));
  database.exec("PRAGMA foreign_keys = ON");
  runMigrations(database);

  return {
    createContactSubmission(submission) {
      database
        .prepare(
          `
          INSERT INTO contact_submissions (id, name, email, created_at)
          VALUES (?, ?, ?, ?)
        `
        )
        .run(submission.id, submission.name, submission.email, submission.createdAt);
    },
    listContactSubmissions() {
      return database
        .prepare(
          `
          SELECT id, name, email, created_at AS createdAt
          FROM contact_submissions
          ORDER BY created_at DESC
        `
        )
        .all() as ContactSubmission[];
    },
    close() {
      database.close();
    }
  };
}
