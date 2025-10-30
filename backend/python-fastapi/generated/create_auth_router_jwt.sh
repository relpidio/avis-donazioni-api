#!/bin/zsh
# ===============================================================
# Script: create_auth_router_jwt.sh
# Função: Criar router de autenticação completo (register/login/me)
#         com proteção JWT integrada para FastAPI + PostgreSQL
# ===============================================================

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$BASE_DIR/src/openapi_server"
ROUTERS_DIR="$SRC_DIR/routers"
CORE_DIR="$SRC_DIR/core"

echo "🚀 Criando router de autenticação com suporte JWT..."

mkdir -p "$ROUTERS_DIR"

# ---------------------------------------------------------------
# 1️⃣ Criar arquivo JWT utilitário
# ---------------------------------------------------------------
cat > "$CORE_DIR/jwt_handler.py" <<'EOF'
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Configuração padrão do JWT
SECRET_KEY = os.getenv("JWT_SECRET", "avis_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Cria token JWT válido por tempo definido."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Decodifica e valida um token JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
EOF

echo "✅ Criado: $CORE_DIR/jwt_handler.py"

# ---------------------------------------------------------------
# 2️⃣ Criar arquivo auth_router.py com endpoints completos
# ---------------------------------------------------------------
cat > "$ROUTERS_DIR/auth_router.py" <<'EOF'
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, EmailStr
from datetime import timedelta

from openapi_server.core.database import SessionLocal
from openapi_server.core.security import hash_password, verify_password
from openapi_server.core.jwt_handler import create_access_token, verify_token
from openapi_server.crud.user_crud import get_user_by_email

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ----------------------------
# Pydantic Schemas
# ----------------------------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

# ----------------------------
# Dependência de sessão
# ----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Endpoint: Registro
# ----------------------------
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    from openapi_server.crud.user_crud import create_user

    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Usuário já registrado com este e-mail.")

    hashed = hash_password(payload.password)
    try:
        user = create_user(db, payload.name, payload.email, hashed)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro ao registrar usuário.")

    return user

# ----------------------------
# Endpoint: Login
# ----------------------------
@router.post("/login", response_model=TokenResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    access_token_expires = timedelta(minutes=60)
    token = create_access_token({"sub": str(user.id)}, expires_delta=access_token_expires)

    return {"access_token": token, "token_type": "bearer"}

# ----------------------------
# Função auxiliar: pegar usuário atual
# ----------------------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")
    user_id = int(payload["sub"])
    user = db.query(type("User", (), {"id": user_id})).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user

# ----------------------------
# Endpoint: /auth/me
# ----------------------------
@router.get("/me", response_model=UserResponse)
def read_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")
    user_id = int(payload["sub"])
    from openapi_server.models.user_model import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user
EOF

echo "✅ Criado: $ROUTERS_DIR/auth_router.py"

# ---------------------------------------------------------------
# 3️⃣ Garantir que o router está importado em main.py
# ---------------------------------------------------------------
MAIN_FILE="$SRC_DIR/main.py"

if grep -q "auth_router" "$MAIN_FILE"; then
  echo "✅ Router já importado em main.py"
else
  echo "🔧 Adicionando importação do auth_router no main.py..."
  sed -i '' '1s;^;from openapi_server.routers import auth_router\n;' "$MAIN_FILE"
  echo "\napp.include_router(auth_router.router)" >> "$MAIN_FILE"
  echo "✅ auth_router adicionado ao main.py"
fi

echo "🎯 Router JWT completo criado com sucesso!"

