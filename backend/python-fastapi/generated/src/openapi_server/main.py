from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import traceback
from jose import jwt, JWTError
import os

# Routers
from openapi_server.routers import auth_router, centers_router, appointments_router
from openapi_server.apis import (
    centers_api,
    donors_api,
    users_api,
    auth_api_old,
)

# 🧩 Configura log global
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("avis_backend")

# 🔐 Configurações JWT (igual ao dependencies.py)
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# 🚀 Cria app FastAPI
app = FastAPI(title="AVIS Backend", version="1.0.0")

# 🌍 Libera CORS total (necessário para o app mobile Expo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Inclui routers principais
app.include_router(auth_router.router)
app.include_router(auth_api_old.router)
app.include_router(users_api.router)
app.include_router(centers_api.router)
app.include_router(donors_api.router)
app.include_router(appointments_router.router)
app.include_router(centers_router.router)


@app.get("/")
def root():
    return {"message": "AVIS API online ✅"}


# 🧠 Middleware para logar erros não tratados
@app.middleware("http")
async def log_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        traceback.print_exc()
        logger.error(f"❌ Erro interno: {str(e)}")
        raise e


# 🧩 Middleware adicional: loga o usuário autenticado via token JWT
@app.middleware("http")
async def log_jwt_user(request: Request, call_next):
    auth_header = request.headers.get("authorization")

    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            sub = payload.get("sub")
            role = payload.get("role", "user")
            logger.info(f"🔑 JWT: usuário '{sub}' com papel '{role}' acessando {request.url.path}")
        except JWTError as e:
            logger.warning(f"⚠️ Token inválido: {str(e)}")

    return await call_next(request)