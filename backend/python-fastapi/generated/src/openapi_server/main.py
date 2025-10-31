from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openapi_server.routers import auth_router

app = FastAPI(title="AVIS Backend", version="1.0.0")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import traceback
from openapi_server.routers import auth_router

# Importa todos os módulos de rotas existentes - New
from openapi_server.apis import (
    centers_api,
    appointments_api,
    donors_api,
    users_api,
    auth_api_old,
)

# 🧩 Configura logs detalhados
logging.basicConfig(level=logging.DEBUG)

app = FastAPI(title="AVIS Backend", version="1.0.0")

# 🌍 Libera CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Inclui rotas
app.include_router(auth_router.router)

# ✅ Inclui todas as rotas - New
app.include_router(auth_api_old.router)
app.include_router(users_api.router)
app.include_router(centers_api.router)
app.include_router(appointments_api.router)
app.include_router(donors_api.router)

@app.get("/")
def root():
    return {"message": "AVIS API online ✅"}

# 🧠 Captura erros não tratados e exibe stack trace no terminal
@app.middleware("http")
async def log_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        traceback.print_exc()
        raise e