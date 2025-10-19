# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from typing import Any
from openapi_server.models.auth_login_post200_response import AuthLoginPost200Response
from openapi_server.models.donor import Donor
from openapi_server.models.login_request import LoginRequest
from openapi_server.models.register_request import RegisterRequest


class BaseAuthApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseAuthApi.subclasses = BaseAuthApi.subclasses + (cls,)
    async def auth_login_post(
        self,
        login_request: LoginRequest,
    ) -> AuthLoginPost200Response:
        ...


    async def auth_register_post(
        self,
        register_request: RegisterRequest,
    ) -> Donor:
        ...
