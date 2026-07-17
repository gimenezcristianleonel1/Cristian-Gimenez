import time
from datetime import datetime, timedelta, timezone

import httpx
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

_jwks_cache: list[dict] | None = None
_jwks_cache_at: float = 0.0
_JWKS_CACHE_SECONDS = 3600


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    payload = {"sub": subject, "role": role, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None


def _fetch_supabase_jwks() -> list[dict]:
    global _jwks_cache, _jwks_cache_at
    now = time.monotonic()
    if _jwks_cache is None or now - _jwks_cache_at > _JWKS_CACHE_SECONDS:
        url = f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
        response = httpx.get(url, timeout=5.0)
        response.raise_for_status()
        _jwks_cache = response.json().get("keys", [])
        _jwks_cache_at = now
    return _jwks_cache


def decode_supabase_token(token: str) -> dict | None:
    """Verifica un JWT emitido por Supabase Auth (sesión de staff).

    Supabase firma los tokens de sesión con una clave asimétrica propia del
    proyecto (ES256/RS256), publicada en su endpoint JWKS. Los proyectos
    viejos que todavía usan el "Legacy JWT Secret" firman con HS256 y un
    secreto compartido. Soportamos los dos casos según el "alg" del token.
    """
    try:
        header = jwt.get_unverified_header(token)
    except JWTError:
        return None

    algorithm = header.get("alg")

    try:
        if algorithm == "HS256":
            return jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )

        jwks = _fetch_supabase_jwks()
        key = next((k for k in jwks if k.get("kid") == header.get("kid")), None)
        if key is None:
            return None
        return jwt.decode(token, key, algorithms=[algorithm], options={"verify_aud": False})
    except (JWTError, httpx.HTTPError):
        return None
