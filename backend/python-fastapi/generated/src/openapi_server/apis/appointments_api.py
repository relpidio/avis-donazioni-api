# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.appointments_api_base import BaseAppointmentsApi
import openapi_server.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from openapi_server.models.extra_models import TokenModel  # noqa: F401
from pydantic import StrictStr
from typing import Any, List
from openapi_server.models.appointment import Appointment
from openapi_server.models.appointment_create import AppointmentCreate
from openapi_server.models.appointment_update import AppointmentUpdate
from openapi_server.security_api import get_token_bearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.delete(
    "/appointments/{appointmentId}",
    responses={
        204: {"description": "Prenotazione cancellata"},
    },
    tags=["appointments"],
    summary="Annulla prenotazione",
    response_model_by_alias=True,
)
async def appointments_appointment_id_delete(
    appointmentId: StrictStr = Path(..., description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> None:
    if not BaseAppointmentsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAppointmentsApi.subclasses[0]().appointments_appointment_id_delete(appointmentId)


@router.put(
    "/appointments/{appointmentId}",
    responses={
        200: {"description": "Prenotazione aggiornata"},
    },
    tags=["appointments"],
    summary="Reagenda prenotazione",
    response_model_by_alias=True,
)
async def appointments_appointment_id_put(
    appointmentId: StrictStr = Path(..., description=""),
    appointment_update: AppointmentUpdate = Body(None, description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> None:
    if not BaseAppointmentsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAppointmentsApi.subclasses[0]().appointments_appointment_id_put(appointmentId, appointment_update)


@router.get(
    "/appointments",
    responses={
        200: {"model": List[Appointment], "description": "Lista appuntamenti"},
    },
    tags=["appointments"],
    summary="Lista appuntamenti del donatore",
    response_model_by_alias=True,
)
async def appointments_get(
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> List[Appointment]:
    if not BaseAppointmentsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAppointmentsApi.subclasses[0]().appointments_get()


@router.post(
    "/appointments",
    responses={
        201: {"model": Appointment, "description": "Prenotazione creata"},
    },
    tags=["appointments"],
    summary="Crea prenotazione",
    response_model_by_alias=True,
)
async def appointments_post(
    appointment_create: AppointmentCreate = Body(None, description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> Appointment:
    if not BaseAppointmentsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAppointmentsApi.subclasses[0]().appointments_post(appointment_create)
