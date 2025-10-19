# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import StrictStr
from typing import Any, List
from openapi_server.models.appointment import Appointment
from openapi_server.models.appointment_create import AppointmentCreate
from openapi_server.models.appointment_update import AppointmentUpdate
from openapi_server.security_api import get_token_bearerAuth

class BaseAppointmentsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseAppointmentsApi.subclasses = BaseAppointmentsApi.subclasses + (cls,)
    async def appointments_appointment_id_delete(
        self,
        appointmentId: StrictStr,
    ) -> None:
        ...


    async def appointments_appointment_id_put(
        self,
        appointmentId: StrictStr,
        appointment_update: AppointmentUpdate,
    ) -> None:
        ...


    async def appointments_get(
        self,
    ) -> List[Appointment]:
        ...


    async def appointments_post(
        self,
        appointment_create: AppointmentCreate,
    ) -> Appointment:
        ...
