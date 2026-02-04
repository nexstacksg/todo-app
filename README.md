# Todo App

A simple todo application built with modern stack.

## Tech Stack

- **Backend**: Hono.js + PostgreSQL
- **Frontend**: Next.js 16
- **Structure**: Monorepo

## Project Structure

```
todo-app/
├── apps/
│   ├── api/          # Hono.js backend
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types/utils
└── package.json      # Root package.json (workspaces)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Development

- Backend runs on: http://localhost:3001
- Frontend runs on: http://localhost:3000

## Database

PostgreSQL with the following schema:

```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
