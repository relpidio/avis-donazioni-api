from fastapi import (
    APIRouter, Depends, HTTPException, status, Form, Request
)
from sqlalchemy.orm import Session
from datetime import timedelta
from openapi_server.core.database import get_db
from openapi_server.core.security import verify_password, create_access_token
from openapi_server.models.user_model import User

router = APIRouter(prefix="/auth", tags=["Auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24h


@router.post("/login")
async def login(
    request: Request,
    db: Session = Depends(get_db),
    email: str = Form(None),
    password: str = Form(None),
):
    """
    Permite login via FormData (app Expo) ou JSON.
    """
    # 🔹 Tenta extrair JSON se os campos vierem vazios
    if not email or not password:
        try:
            data = await request.json()
            email = data.get("email")
            password = data.get("password")
        except Exception:
            raise HTTPException(
                status_code=422,
                detail="Formato de requisição inválido — envie JSON ou FormData."
            )

    # 🔹 Validação básica
    if not email or not password:
        raise HTTPException(
            status_code=422,
            detail="Campos obrigatórios: email e password."
        )

    # 🔹 Consulta o usuário
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado."
        )

    # 🔹 Verifica senha
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Senha incorreta."
        )

    # 🔹 Cria token JWT
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email, "role": getattr(user, "role", "user")},
        expires_delta=expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "role": getattr(user, "role", "user"),
        },
    }