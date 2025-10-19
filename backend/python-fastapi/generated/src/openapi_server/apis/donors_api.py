# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.donors_api_base import BaseDonorsApi
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
from typing import Any
from openapi_server.models.donor import Donor
from openapi_server.models.donor_update import DonorUpdate
from openapi_server.security_api import get_token_bearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/donors/{donorId}",
    responses={
        200: {"model": Donor, "description": "Profilo donatore"},
    },
    tags=["donors"],
    summary="Recupera profilo donatore",
    response_model_by_alias=True,
)
async def donors_donor_id_get(
    donorId: StrictStr = Path(..., description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> Donor:
    if not BaseDonorsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDonorsApi.subclasses[0]().donors_donor_id_get(donorId)


@router.put(
    "/donors/{donorId}",
    responses={
        200: {"description": "Donatore aggiornato"},
    },
    tags=["donors"],
    summary="Aggiorna dati donatore",
    response_model_by_alias=True,
)
async def donors_donor_id_put(
    donorId: StrictStr = Path(..., description=""),
    donor_update: DonorUpdate = Body(None, description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> None:
    if not BaseDonorsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDonorsApi.subclasses[0]().donors_donor_id_put(donorId, donor_update)
