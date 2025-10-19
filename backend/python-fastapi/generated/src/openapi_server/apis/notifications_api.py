# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.notifications_api_base import BaseNotificationsApi
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
from openapi_server.models.notifications_subscribe_post_request import NotificationsSubscribePostRequest
from openapi_server.security_api import get_token_bearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/notifications/subscribe",
    responses={
        201: {"description": "Token registrato"},
    },
    tags=["notifications"],
    summary="Registra token per notifiche push",
    response_model_by_alias=True,
)
async def notifications_subscribe_post(
    notifications_subscribe_post_request: NotificationsSubscribePostRequest = Body(None, description=""),
    token_bearerAuth: TokenModel = Security(
        get_token_bearerAuth
    ),
) -> None:
    if not BaseNotificationsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseNotificationsApi.subclasses[0]().notifications_subscribe_post(notifications_subscribe_post_request)
