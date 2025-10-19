# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.centers_api_base import BaseCentersApi
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
from datetime import date
from pydantic import StrictFloat, StrictInt, StrictStr
from typing import List, Optional, Union
from openapi_server.models.center import Center
from openapi_server.models.slot import Slot


router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/centers/{centerId}/availability",
    responses={
        200: {"model": List[Slot], "description": "Slots disponibili"},
    },
    tags=["centers"],
    summary="Disponibilità (slots) per centro",
    response_model_by_alias=True,
)
async def centers_center_id_availability_get(
    centerId: StrictStr = Path(..., description=""),
    date_from: Optional[date] = Query(None, description="", alias="date_from"),
    date_to: Optional[date] = Query(None, description="", alias="date_to"),
) -> List[Slot]:
    if not BaseCentersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseCentersApi.subclasses[0]().centers_center_id_availability_get(centerId, date_from, date_to)


@router.get(
    "/centers",
    responses={
        200: {"model": List[Center], "description": "Lista centri"},
    },
    tags=["centers"],
    summary="Lista centri (filtro per regione/coordinate/tipo)",
    response_model_by_alias=True,
)
async def centers_get(
    lat: Optional[Union[StrictFloat, StrictInt]] = Query(None, description="", alias="lat"),
    lng: Optional[Union[StrictFloat, StrictInt]] = Query(None, description="", alias="lng"),
    radius_km: Optional[StrictInt] = Query(50, description="", alias="radius_km"),
    region: Optional[StrictStr] = Query(None, description="", alias="region"),
) -> List[Center]:
    if not BaseCentersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseCentersApi.subclasses[0]().centers_get(lat, lng, radius_km, region)
