# 🏋️ IronPulse Gym Management System
## Docker Setup & Render Deployment Guide

---

## 📁 Final Project Structure

```
gym-management/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── member.py
│   │   │   ├── trainer.py
│   │   │   ├── plan.py
│   │   │   ├── subscription.py
│   │   │   ├── attendance.py
│   │   │   └── payment.py
│   │   ├── schemas/
│   │   │   └── (user, member, trainer, plan, subscription, attendance, payment)
│   │   ├── api/routes/
│   │   │   └── (auth, members, trainers, plans, subscriptions, attendance, payments, dashboard)
│   │   ├── services/
│   │   │   └── (auth, member, trainer, plan, subscription, attendance, payment, dashboard)
│   │   ├── db/
│   │   │   └── session.py
│   │   └── utils/
│   │       └── error_handlers.py
│   ├── alembic/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── seed.py
├── frontend/
│   ├── templates/
│   │   ├── index.html       ← Landing page
│   │   └── dashboard.html   ← Dashboard
│   └── static/
│       ├── css/
│       │   ├── main.css
│       │   └── dashboard.css
│       └── js/
│           ├── auth.js
│           └── dashboard.js
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## 🐳 DOCKER SETUP (Local Development)

### Step 1 — Prerequisites
```bash
# Ensure Docker & Docker Compose are installed
docker --version        # Docker 24+
docker compose version  # Compose v2+
```

### Step 2 — Clone / copy the project
```bash
cd gym-management
```

### Step 3 — Create your .env file
```bash
cp .env.example .env
# Edit .env — at minimum change SECRET_KEY to a long random string
```

### Step 4 — Build and run
```bash
docker compose up --build
```
This will:
1. Pull `postgres:15-alpine`
2. Build the FastAPI image
3. Run `alembic upgrade head` (creates all tables automatically)
4. Start the server on port 8000

### Step 5 — Open in browser
| URL | Purpose |
|-----|---------|
| http://localhost:8000 | Landing page |
| http://localhost:8000/dashboard.html | Dashboard (needs login) |
| http://localhost:8000/docs | Swagger UI |
| http://localhost:8000/redoc | ReDoc |

### Step 6 — Seed demo data (optional)
```bash
# In a new terminal while containers are running:
docker compose exec backend python seed.py
```
Demo credentials after seeding:
| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@ironpulse.com      | admin123   |
| Trainer | trainer@ironpulse.com    | trainer123 |
| Member  | alice@example.com        | member123  |

### Useful Docker commands
```bash
# Stop all containers
docker compose down

# Stop and remove volumes (WIPES database)
docker compose down -v

# View logs
docker compose logs -f backend
docker compose logs -f db

# Run migrations manually
docker compose exec backend alembic upgrade head

# Open a psql shell
docker compose exec db psql -U postgres -d gymdb

# Start pgAdmin (database GUI)
docker compose --profile tools up
# Then open http://localhost:5050  (admin@gym.local / admin)
```

---

## 🚀 RENDER DEPLOYMENT

Render offers a fully managed PostgreSQL and web service that works perfectly with this stack.

### Step 1 — Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit — IronPulse Gym Management"
git remote add origin https://github.com/YOUR_USERNAME/gym-management.git
git push -u origin main
```

### Step 2 — Create PostgreSQL on Render

1. Go to https://dashboard.render.com
2. Click **New** → **PostgreSQL**
3. Fill in:
   - **Name**: `ironpulse-db`
   - **Database**: `gymdb`
   - **User**: `gymuser`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or Starter for production)
4. Click **Create Database**
5. After creation, copy the **Internal Database URL** — looks like:
   ```
   postgresql://gymuser:PASSWORD@dpg-XXXXX-a.oregon-postgres.render.com/gymdb
   ```

### Step 3 — Create Web Service on Render

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ironpulse-backend`
   - **Region**: Same as your DB
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     alembic upgrade head && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120
     ```
   - **Plan**: Free (or Starter)

### Step 4 — Set Environment Variables on Render

In your Web Service → **Environment** tab, add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Render Internal DB URL but with `+asyncpg` driver: `postgresql+asyncpg://gymuser:PASSWORD@dpg-XXXXX.oregon-postgres.render.com/gymdb` |
| `SYNC_DATABASE_URL` | Your Render Internal DB URL as-is (no `+asyncpg`): `postgresql://gymuser:PASSWORD@...` |
| `SECRET_KEY` | Generate with: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
| `FRONTEND_URL` | `https://ironpulse-backend.onrender.com` (your service URL) |
| `DEBUG` | `false` |
| `GOOGLE_CLIENT_ID` | *(optional)* Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | *(optional)* Your Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | `https://ironpulse-backend.onrender.com/api/auth/google/callback` |

> ⚠️ **Important**: The `DATABASE_URL` must use `postgresql+asyncpg://` for SQLAlchemy async support.
> The `SYNC_DATABASE_URL` must use plain `postgresql://` for Alembic.

### Step 5 — Deploy

Click **Create Web Service**. Render will:
1. Install Python dependencies
2. Run `alembic upgrade head` (auto-creates all tables)
3. Start the gunicorn server

First deploy takes ~3-5 minutes. Watch the build logs for any errors.

### Step 6 — Seed production data (optional)

Using the Render Shell (your service → **Shell** tab):
```bash
python seed.py
```

### Step 7 — Test your deployment

```
https://ironpulse-backend.onrender.com/           → Landing page
https://ironpulse-backend.onrender.com/docs       → Swagger API docs
https://ironpulse-backend.onrender.com/health     → Health check
```

---

## 🔑 Google OAuth Setup (Optional)

### Create OAuth credentials

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **OAuth consent screen**
   - User Type: External
   - Fill app name, support email
   - Add scope: `email`, `profile`, `openid`
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Authorized redirect URIs:
     - Local: `http://localhost:8000/api/auth/google/callback`
     - Production: `https://YOUR-SERVICE.onrender.com/api/auth/google/callback`
5. Copy **Client ID** and **Client Secret** into your `.env` / Render env vars

---

## 🔧 Production Checklist

- [ ] Change `SECRET_KEY` to a cryptographically secure random string (min 32 chars)
- [ ] Set `DEBUG=false`
- [ ] Use a paid Render PostgreSQL plan for data persistence (Free tier sleeps)
- [ ] Add proper `GOOGLE_CLIENT_ID` / `SECRET` if using Google login
- [ ] Set `FRONTEND_URL` to your actual Render URL
- [ ] Consider adding rate limiting (e.g., `slowapi`) before going live
- [ ] Rotate JWT `SECRET_KEY` regularly in production

---

## 🧪 API Testing via Swagger

Visit `/docs` for interactive API testing:

1. Click **Authorize** button (top right in Swagger)
2. Use `POST /api/auth/login` to get a token
3. Paste the `access_token` value into the Authorize dialog
4. All subsequent requests will include the JWT header automatically

---

## 📊 Database Migrations

When you change a model, create and apply a new migration:

```bash
# Inside backend/ directory or docker exec
alembic revision --autogenerate -m "describe your change"
alembic upgrade head

# Roll back one step
alembic downgrade -1

# View migration history
alembic history
```
