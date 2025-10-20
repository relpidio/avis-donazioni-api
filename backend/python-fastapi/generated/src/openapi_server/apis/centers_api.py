from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Center(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    city: str
    province: str
    latitude: float
    longitude: float

CENTERS = [
    Center(
        id=1,
        name="AVIS Comunale Asti",
        address="Via del Donatore 10, Asti",
        phone="+39 0141 123456",
        city="Asti",
        province="AT",
        latitude=44.9005,
        longitude=8.2064,
    ),
    Center(
        id=2,
        name="AVIS Provinciale Torino",
        address="Corso Galileo Ferraris 65, Torino",
        phone="+39 011 987654",
        city="Torino",
        province="TO",
        latitude=45.0628,
        longitude=7.6786,
    ),
    Center(
        id=3,
        name="AVIS Comunale Ivrea",
        address="Piazza Ottinetti 8, Ivrea",
        phone="+39 0125 665544",
        city="Ivrea",
        province="TO",
        latitude=45.4664,
        longitude=7.8763,
    ),
    Center(
        id=4,
        name="AVIS Comunale Alba",
        address="Via Vittorio Emanuele 20, Alba",
        phone="+39 0173 332211",
        city="Alba",
        province="CN",
        latitude=44.7005,
        longitude=8.0326,
    ),
]

@router.get("/centers", response_model=List[Center])
async def get_centers():
    """Retorna a lista de centros AVIS no Piemonte."""
    return CENTERS