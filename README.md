# Qlidex

Qlidex is set up as an npm-workspaces monorepo.

## Structure

- `apps/web` - Next.js frontend for the Qlidex Agency website.
- `apps/api` - Express API with SQLite persistence and migrations.
- `packages/*` - Reserved for shared UI, config, database clients, or utilities.

## Commands

Run from the repository root:

```bash
npm install
npm run migrate
npm run dev
npm run dev:api
npm run typecheck
npm run test
npm run build
```

The web app runs at `http://localhost:3000` by default.
The API runs at `http://localhost:4000` by default.

Copy `.env.example` to `.env` for local configuration. The real `.env` file is ignored by git.
