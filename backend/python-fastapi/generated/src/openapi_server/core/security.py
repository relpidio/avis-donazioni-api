import os
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# 🔐 Contexto padrão de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔐 Chave e algoritmo JWT (usando variáveis de ambiente)
SECRET_KEY = os.getenv("SECRET_KEY", "bf7a7eed9006177519a78713ddd6937cdd29b3e3990356ff7ef1a035d028a514")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha enviada bate com o hash armazenado."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gera um hash seguro com bcrypt."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Cria um token JWT com expiração configurável."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)