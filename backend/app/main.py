# backend/app/main.py
# Application entry point — serves React SPA + all API routes

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.api.routes import auth, members, trainers, plans, subscriptions, attendance, payments, dashboard
from app.utils.error_handlers import (
    validation_exception_handler,
    integrity_error_handler,
    generic_exception_handler,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="IronPulse Gym Management System API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Error handlers ────────────────────────────────────────────────────────
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ── API routes ────────────────────────────────────────────────────────────
PREFIX = "/api"
app.include_router(auth.router,          prefix=PREFIX)
app.include_router(members.router,       prefix=PREFIX)
app.include_router(trainers.router,      prefix=PREFIX)
app.include_router(plans.router,         prefix=PREFIX)
app.include_router(subscriptions.router, prefix=PREFIX)
app.include_router(attendance.router,    prefix=PREFIX)
app.include_router(payments.router,      prefix=PREFIX)
app.include_router(dashboard.router,     prefix=PREFIX)

# ── React SPA static files ────────────────────────────────────────────────
# In Docker: static_react/ is copied from the Vite build output (frontend/dist)
# In local dev: run `npm run dev` in frontend/ and proxy hits localhost:8000
REACT_BUILD = os.path.join(os.path.dirname(__file__), "..", "static_react")

if os.path.exists(REACT_BUILD):
    # Serve JS/CSS/assets
    app.mount("/assets", StaticFiles(directory=os.path.join(REACT_BUILD, "assets")), name="assets")

    # Serve index.html for ALL non-API routes (React Router handles them client-side)
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_react(full_path: str):
        index = os.path.join(REACT_BUILD, "index.html")
        return FileResponse(index)

    @app.get("/", include_in_schema=False)
    async def serve_root():
        return FileResponse(os.path.join(REACT_BUILD, "index.html"))
else:
    @app.get("/", include_in_schema=False)
    async def dev_notice():
        return {"message": "React not built yet. Run: cd frontend && npm run build"}


# ── Health check ──────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "app": settings.APP_NAME}
