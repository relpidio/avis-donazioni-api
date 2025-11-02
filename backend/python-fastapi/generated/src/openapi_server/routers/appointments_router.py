from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from datetime import datetime
from openapi_server.dependencies import get_current_user  # ✅ autenticação via JWT

router = APIRouter(prefix="/appointments", tags=["appointments"])

# 🧠 Banco de dados fake em memória (simulação temporária)
FAKE_APPOINTMENTS: List["Appointment"] = []


# 📘 Modelo de agendamento
class Appointment(BaseModel):
    id: int
    donor_email: str
    center_id: int
    center_name: str
    start_time: datetime
    end_time: datetime
    status: str = "confirmed"


# 🧩 Modelo de criação (dados que vêm do app)
class AppointmentCreate(BaseModel):
    center_id: int
    center_name: str
    start_time: datetime
    end_time: datetime


# 🔹 Lista todos os agendamentos do usuário autenticado
@router.get("/", response_model=List[Appointment])
async def list_appointments(current_user: dict = Depends(get_current_user)):
    # ✅ Usa 'sub' (campo padrão do JWT) ou 'email' caso exista
    user_email = current_user.get("sub") or current_user.get("email")
    if not user_email:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    return [a for a in FAKE_APPOINTMENTS if a.donor_email == user_email]


# 🔹 Cria um novo agendamento
@router.post("/", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: dict = Depends(get_current_user)
):
    user_email = current_user.get("sub") or current_user.get("email")
    if not user_email:
        raise HTTPException(status_code=403, detail="Usuário não autenticado")

    new_appointment = Appointment(
        id=len(FAKE_APPOINTMENTS) + 1,
        donor_email=user_email,
        center_id=appointment_data.center_id,
        center_name=appointment_data.center_name,
        start_time=appointment_data.start_time,
        end_time=appointment_data.end_time,
        status="confirmed",
    )

    FAKE_APPOINTMENTS.append(new_appointment)
    return new_appointment


# 🔹 Cancela um agendamento existente
@router.delete("/{appointment_id}")
async def delete_appointment(
    appointment_id: int,
    current_user: dict = Depends(get_current_user),
):
    global FAKE_APPOINTMENTS
    user_email = current_user.get("sub") or current_user.get("email")
    if not user_email:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")

    found = any(
        a.id == appointment_id and a.donor_email == user_email for a in FAKE_APPOINTMENTS
    )
    if not found:
        raise HTTPException(
            status_code=404, detail=f"Agendamento #{appointment_id} não encontrado."
        )

    FAKE_APPOINTMENTS = [
        a for a in FAKE_APPOINTMENTS
        if not (a.id == appointment_id and a.donor_email == user_email)
    ]

    return {"message": f"Agendamento #{appointment_id} cancelado com sucesso."}