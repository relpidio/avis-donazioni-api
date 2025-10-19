# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.auth_api_base import BaseAuthApi
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
from typing import Any
from openapi_server.models.auth_login_post200_response import AuthLoginPost200Response
from openapi_server.models.donor import Donor
from openapi_server.models.login_request import LoginRequest
from openapi_server.models.register_request import RegisterRequest


router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/auth/login",
    responses={
        200: {"model": AuthLoginPost200Response, "description": "Token di accesso"},
    },
    tags=["auth"],
    summary="Login (email + password) / SSO",
    response_model_by_alias=True,
)
async def auth_login_post(
    login_request: LoginRequest = Body(None, description=""),
) -> AuthLoginPost200Response:
    if not BaseAuthApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthApi.subclasses[0]().auth_login_post(login_request)


@router.post(
    "/auth/register",
    responses={
        201: {"model": Donor, "description": "Donatore creato"},
        400: {"description": "Bad request"},
    },
    tags=["auth"],
    summary="Registra un nuovo donatore",
    response_model_by_alias=True,
)
async def auth_register_post(
    register_request: RegisterRequest = Body(None, description=""),
) -> Donor:
    if not BaseAuthApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthApi.subclasses[0]().auth_register_post(register_request)
