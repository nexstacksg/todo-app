# Todo App Deployment Guide

## Infrastructure

| Component | Value |
|-----------|-------|
| Server | LXC 126 (todo-app) @ 192.168.0.126 |
| Database | PostgreSQL @ 15.235.196.21:5432 |
| Web URL | https://todo.singaporetestlab.com |
| API URL | https://todo-api.singaporetestlab.com |

## CI/CD Setup

### Prerequisites

1. **SSH Key**: Generate a deploy key and add it to the server
2. **GitHub Secrets**: Configure these in repo settings:
   - `SERVER_HOST`: Server IP (via jump host or Tailscale)
   - `SSH_PRIVATE_KEY`: Private key for SSH access

### Automatic Deployment

Push to `main` branch triggers automatic deployment via GitHub Actions.

### Manual Deployment

```bash
# SSH to server
ssh root@192.168.0.126

# Navigate to app
cd /opt/todo-app

# Pull and deploy
git pull origin main
pnpm install
pnpm build
pm2 restart all
```

## Initial Server Setup

1. **Create the LXC container** from `node-pm2-template`:
   ```
   Proxmox → Create CT → Clone from template 107
   ```

2. **Run setup script**:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/nexstacksg/todo-app/main/scripts/setup-server.sh | bash
   ```

3. **Create database** on PostgreSQL server:
   ```bash
   psql -h 15.235.196.21 -U postgres -f scripts/create-db.sql
   ```

4. **Configure Nginx Proxy Manager**:
   - `todo.singaporetestlab.com` → `192.168.0.126:3000`
   - `todo-api.singaporetestlab.com` → `192.168.0.126:3001`
   - Enable SSL with wildcard cert

5. **Add Cloudflare DNS**:
   ```bash
   # Both point to Nginx Proxy Manager
   todo.singaporetestlab.com → 15.235.196.18 (proxied)
   todo-api.singaporetestlab.com → 15.235.196.18 (proxied)
   ```

## Environment Variables

### API (`apps/api/.env`)
```
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@15.235.196.21:5432/todo_db
PORT=3001
NODE_ENV=production
```

### Web (`apps/web/.env.local`)
```
NEXT_PUBLIC_API_URL=https://todo-api.singaporetestlab.com
```

## Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs todo-api
pm2 logs todo-web

# Monitor resources
pm2 monit
```

## Troubleshooting

- **API not responding**: Check `pm2 logs todo-api`
- **DB connection issues**: Verify DATABASE_URL and network connectivity
- **502 errors**: Ensure PM2 processes are running and ports match Nginx config
