#!/bin/bash
# Setup script for new todo-app server
# Run this on the target server (LXC container)

set -e

APP_DIR="/opt/todo-app"
DB_HOST="${DB_HOST:-15.235.196.21}"
DB_NAME="${DB_NAME:-todo_db}"
DB_USER="${DB_USER:-todo_user}"
DB_PASS="${DB_PASS:-changeme}"

echo "🚀 Setting up Todo App server..."

# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 20 if not present
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install pnpm
npm install -g pnpm

# Install PM2
pnpm add -g pm2

# Create app directory
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repo
git clone https://github.com/nexstacksg/todo-app.git . || (cd $APP_DIR && git pull)

# Create .env for API
cat > apps/api/.env << EOF
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}
PORT=3001
NODE_ENV=production
EOF

# Create .env for web
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=https://todo-api.singaporetestlab.com
EOF

# Install dependencies
pnpm install

# Build
pnpm build

# Setup PM2
pm2 start ecosystem.config.cjs 2>/dev/null || echo "Will setup PM2 after first deploy"
pm2 startup
pm2 save

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Create database: psql -h $DB_HOST -U postgres -c 'CREATE DATABASE $DB_NAME;'"
echo "2. Run migrations: cd apps/api && pnpm run migrate"
echo "3. Configure Nginx Proxy Manager for todo.singaporetestlab.com"
echo "4. Add Cloudflare DNS record"
