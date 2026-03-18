# Dockerfile  (place this at gym-management/ root)
# Stage 1 — Build React with Vite
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
# Build outputs to /frontend/dist
RUN npm run build

# Stage 2 — FastAPI backend
FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built React app into backend/static_react
COPY --from=frontend-build /frontend/dist ./static_react

EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120"]
