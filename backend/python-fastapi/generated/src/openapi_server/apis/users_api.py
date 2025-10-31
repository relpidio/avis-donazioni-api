from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/users", tags=["users"])

# Lista de usuários fictícia (para exemplo)
fake_users_db = [
    {"id": 1, "name": "Rodrigo Elpídio", "email": "rodrigoelpidio@gmail.com"},
    {"id": 2, "name": "Rita Elpídio", "email": "rita@example.com"},
]

@router.get("/", summary="Lista todos os usuários")
async def list_users():
    return fake_users_db

@router.get("/{user_id}", summary="Obtém detalhes de um usuário")
async def get_user(user_id: int):
    user = next((u for u in fake_users_db if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.post("/", summary="Cria um novo usuário (mock)")
async def create_user(user: dict):
    user["id"] = len(fake_users_db) + 1
    fake_users_db.append(user)
    return {"message": "Usuário criado com sucesso!", "user": user}