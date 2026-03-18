# backend/app/utils/error_handlers.py
# Global exception handlers — return consistent JSON error responses

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"field": e["loc"][-1], "message": e["msg"]} for e in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": errors},
    )


async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=409,
        content={"detail": "Data conflict — duplicate entry or constraint violation"},
    )


async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
