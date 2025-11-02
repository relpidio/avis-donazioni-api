from typing import List
from datetime import datetime
from fastapi import HTTPException, status
from openapi_server.models.appointment import Appointment
from openapi_server.models.appointment_create import AppointmentCreate
from openapi_server.models.appointment_update import AppointmentUpdate
from openapi_server.apis.appointments_api_base import BaseAppointmentsApi

# 🧠 Banco simulado (poderemos trocar por banco real depois)
FAKE_APPOINTMENTS = []

class AppointmentsApiImpl(BaseAppointmentsApi):
    async def appointments_get(self) -> List[Appointment]:
        """
        Lista todos os agendamentos do usuário autenticado.
        """
        return FAKE_APPOINTMENTS

    async def appointments_post(self, appointment_create: AppointmentCreate) -> Appointment:
        """
        Cria novo agendamento
        """
        new_id = len(FAKE_APPOINTMENTS) + 1
        appointment = Appointment(
            id=new_id,
            center_id=appointment_create.center_id,
            center_name=appointment_create.center_name,
            date=datetime.fromisoformat(appointment_create.date),
            status="confirmado"
        )
        FAKE_APPOINTMENTS.append(appointment)
        return appointment

    async def appointments_appointment_id_put(self, appointmentId: str, appointment_update: AppointmentUpdate) -> None:
        """
        Atualiza agendamento existente
        """
        for appt in FAKE_APPOINTMENTS:
            if str(appt.id) == appointmentId:
                appt.date = datetime.fromisoformat(appointment_update.date)
                appt.status = appointment_update.status
                return
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    async def appointments_appointment_id_delete(self, appointmentId: str) -> None:
        """
        Cancela agendamento existente
        """
        global FAKE_APPOINTMENTS
        FAKE_APPOINTMENTS = [a for a in FAKE_APPOINTMENTS if str(a.id) != appointmentId]
        return {"message": f"Agendamento {appointmentId} removido com sucesso"}