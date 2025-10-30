#!/bin/zsh
# ===============================================================
#  Script: create_full_db_infra.sh
#  Função: Criar estrutura completa de banco + autenticação (FastAPI + PostgreSQL)
# ===============================================================

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$BASE_DIR/src/openapi_server"
CORE_DIR="$SRC_DIR/core"
MODELS_DIR="$SRC_DIR/models"
CRUD_DIR="$SRC_DIR/crud"

echo "🚀 Criando estrutura completa de banco e autenticação..."

# ---------------------------------------------------------------
# 1️⃣ Criar diretórios
# ---------------------------------------------------------------
mkdir -p "$CORE_DIR" "$MODELS_DIR" "$CRUD_DIR"

# ---------------------------------------------------------------
# 2️⃣ Criar arquivo database.py
# ---------------------------------------------------------------
cat > "$CORE_DIR/database.py" <<'EOF'
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# URL do banco PostgreSQL (ajuste conforme docker-compose)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://avis_user:avis_password@localhost:5432/avis_db"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
EOF

echo "✅ Criado: $CORE_DIR/database.py"

# ---------------------------------------------------------------
# 3️⃣ Criar arquivo user_model.py
# ---------------------------------------------------------------
cat > "$MODELS_DIR/user_model.py" <<'EOF'
from sqlalchemy import Column, Integer, String, DateTime, func, UniqueConstraint
from openapi_server.core.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
EOF

echo "✅ Criado: $MODELS_DIR/user_model.py"

# ---------------------------------------------------------------
# 4️⃣ Criar arquivo init_db.py
# ---------------------------------------------------------------
cat > "$CORE_DIR/init_db.py" <<'EOF'
from openapi_server.core.database import Base, engine
from openapi_server.models.user_model import User

def init_db():
    print("🗄️  Criando tabelas no banco PostgreSQL...")
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados inicializado com sucesso!")

if __name__ == "__main__":
    init_db()
EOF

echo "✅ Criado: $CORE_DIR/init_db.py"

# ---------------------------------------------------------------
# 5️⃣ Criar arquivo security.py
# ---------------------------------------------------------------
cat > "$CORE_DIR/security.py" <<'EOF'
from passlib.context import CryptContext

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Gera hash seguro para uma senha em texto simples."""
    return _pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha informada corresponde ao hash armazenado."""
    return _pwd_context.verify(plain_password, hashed_password)
EOF

echo "✅ Criado: $CORE_DIR/security.py"

# ---------------------------------------------------------------
# 6️⃣ Criar arquivo crud/user_crud.py
# ---------------------------------------------------------------
cat > "$CRUD_DIR/user_crud.py" <<'EOF'
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from openapi_server.models.user_model import User

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Busca um usuário pelo e-mail."""
    stmt = select(User).where(User.email == email)
    return db.scalars(stmt).first()

def create_user(db: Session, name: str, email: str, hashed_password: str) -> User:
    """Cria um novo usuário no banco."""
    user = User(name=name, email=email, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
EOF

echo "✅ Criado: $CRUD_DIR/user_crud.py"

# ---------------------------------------------------------------
# 7️⃣ Executar init_db para criar tabelas
# ---------------------------------------------------------------
echo "🧩 Executando inicialização do banco de dados..."
python3 "$CORE_DIR/init_db.py" || echo "⚠️  Erro ao criar tabelas, verifique o banco."
echo "✅ Infraestrutura de banco e autenticação criada!"

