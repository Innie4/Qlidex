import request from "supertest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { closeAppDatabase, createApp } from "../src/app.js";
import { env } from "../src/env.js";

const tempDirs: string[] = [];

function createTestApp() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "qlidex-api-"));
  tempDirs.push(tempDir);

  const app = createApp({
    databasePath: path.join(tempDir, "test.sqlite")
  });

  return app;
}

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe("Qlidex API", () => {
  it("returns health status", async () => {
    const app = createTestApp();
    const response = await request(app).get("/health");
    closeAppDatabase(app);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      service: "qlidex-api"
    });
  });

  it("accepts valid contact submissions", async () => {
    const app = createTestApp();
    const response = await request(app).post("/api/contact").send({
      name: "Ada",
      email: "ADA@example.com"
    });
    closeAppDatabase(app);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.submission).toMatchObject({
      name: "Ada",
      email: "ada@example.com"
    });
  });

  it("rejects invalid contact submissions", async () => {
    const app = createTestApp();
    const response = await request(app).post("/api/contact").send({
      name: "Ada",
      email: "not-an-email"
    });
    closeAppDatabase(app);

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  it("protects stored submissions with the API key", async () => {
    const app = createTestApp();
    await request(app).post("/api/contact").send({
      name: "Ada",
      email: "ada@example.com"
    });

    const unauthorized = await request(app).get("/api/contact");
    expect(unauthorized.status).toBe(401);

    const authorized = await request(app).get("/api/contact").set("x-api-key", env.apiKey);
    closeAppDatabase(app);

    expect(authorized.status).toBe(200);
    expect(authorized.body.submissions).toHaveLength(1);
  });
});
