# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.tests_api_base import BaseTestsApi
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
from typing import List
from openapi_server.models.test_result import TestResult
from openapi_server.security_api import get_token_bearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/donors/{donorId}/tests",
    responses={
        200: {"model": List[TestResult], "description": "Lista risultati"},
    },
    tags=["tests"],
    summary="Elenco risultati esami del donatore (PDF/valori)",
    response_model_by_alias=True,
)
async def donors_donor_id_tests_get(
    donorId: StrictStr = Path(..., description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> List[TestResult]:
    if not BaseTestsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseTestsApi.subclasses[0]().donors_donor_id_tests_get(donorId)
