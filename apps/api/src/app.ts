import cors from "cors";
import express, { type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { createDatabase, type ContactSubmission, type DatabaseHandle } from "./db.js";
import { env } from "./env.js";

function normalizeValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function createApp(options: { databasePath?: string } = {}) {
  const database = createDatabase(options.databasePath ?? env.databasePath);
  const app = express();

  app.locals.database = database;

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_request: Request, response: Response) => {
    response.json({
      ok: true,
      service: "qlidex-api",
      environment: env.nodeEnv
    });
  });

  app.post("/api/contact", (request: Request, response: Response) => {
    const name = normalizeValue(request.body?.name);
    const email = normalizeValue(request.body?.email).toLowerCase();

    if (!name || !email || !isEmail(email)) {
      response.status(400).json({
        ok: false,
        message: "A valid name and email are required."
      });
      return;
    }

    const submission: ContactSubmission = {
      id: randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    database.createContactSubmission(submission);

    response.status(201).json({
      ok: true,
      submission
    });
  });

  app.get("/api/contact", (request: Request, response: Response) => {
    if (request.header("x-api-key") !== env.apiKey) {
      response.status(401).json({
        ok: false,
        message: "Unauthorized"
      });
      return;
    }

    response.json({
      ok: true,
      submissions: database.listContactSubmissions()
    });
  });

  return app;
}

export function closeAppDatabase(app: ReturnType<typeof createApp>) {
  const database = app.locals.database as DatabaseHandle | undefined;
  database?.close();
}
