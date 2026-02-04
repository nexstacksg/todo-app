#!/bin/bash
# Setup script for new todo-app server
# IMPORTANT: Set these via environment variables or secrets manager

set -e

APP_DIR="/opt/todo-app"
DB_HOST="${DB_HOST:?'DB_HOST required'}"
DB_NAME="${DB_NAME:-todo_db}"
DB_USER="${DB_USER:-todo_user}"
DB_PASS="${DB_PASS:?'DB_PASS required - do not hardcode!'}"

echo "🚀 Setting up Todo App server..."

# Create app directory
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repo
git clone https://github.com/nexstacksg/todo-app.git . 2>/dev/null || git pull

# Create .env for API (from environment variables)
cat > apps/api/.env << EOF
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}
PORT=3001
NODE_ENV=production
EOF

# Install and build
pnpm install
pnpm build

# Setup PM2
pm2 start ecosystem.config.cjs
pm2 save

echo "✅ Server setup complete!"
