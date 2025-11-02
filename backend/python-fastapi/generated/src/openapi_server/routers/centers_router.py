from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/centers", tags=["centers"])

# 🩸 Modelo de slot de doação
class Slot(BaseModel):
    id: int
    center_id: int
    start_time: datetime
    end_time: datetime
    available: bool = True

# 🏥 Centros simulados (mock)
fake_centers = {
    1: "AVIS Comunale Asti",
    2: "AVIS Provinciale Torino",
    3: "AVIS Comunale Ivrea",
    4: "AVIS Comunale Alba",
}

# 📅 Gera horários automaticamente
def generate_slots(center_id: int) -> List[Slot]:
    start_hour = 8
    end_hour = 16
    slot_duration = 30  # minutos
    today = datetime.now().replace(hour=start_hour, minute=0, second=0, microsecond=0)

    slots = []
    slot_id = 1
    current_time = today

    while current_time.hour < end_hour:
        slots.append(
            Slot(
                id=slot_id,
                center_id=center_id,
                start_time=current_time,
                end_time=current_time + timedelta(minutes=slot_duration),
                available=True,
            )
        )
        slot_id += 1
        current_time += timedelta(minutes=slot_duration)

    return slots


@router.get("/{center_id}/availability", response_model=List[Slot])
async def get_center_availability(center_id: int):
    """
    Retorna horários disponíveis gerados dinamicamente para o centro selecionado
    """
    if center_id not in fake_centers:
        raise HTTPException(status_code=404, detail="Center not found")

    return generate_slots(center_id)


@router.get("/", response_model=List[str])
async def list_centers():
    """
    Retorna a lista de centros disponíveis
    """
    return [name for _, name in fake_centers.items()]