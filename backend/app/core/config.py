from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:5173"
    environment: str = "local"

    # Supabase Auth: usado para verificar los JWT que emite Supabase para el
    # staff interno (Administrador/Operador).
    # - supabase_url: URL del proyecto (Project Settings → API), para resolver
    #   las claves públicas (JWKS) de proyectos con firma asimétrica (ES256/RS256).
    # - supabase_jwt_secret: Project Settings → API → JWT Settings → JWT Secret,
    #   solo necesario para proyectos que todavía firman con el secreto legacy (HS256).
    supabase_url: str
    supabase_jwt_secret: str

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
