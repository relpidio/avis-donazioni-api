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
