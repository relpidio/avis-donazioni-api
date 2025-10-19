# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from typing import Any
from openapi_server.models.notifications_subscribe_post_request import NotificationsSubscribePostRequest
from openapi_server.security_api import get_token_bearerAuth

class BaseNotificationsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseNotificationsApi.subclasses = BaseNotificationsApi.subclasses + (cls,)
    async def notifications_subscribe_post(
        self,
        notifications_subscribe_post_request: NotificationsSubscribePostRequest,
    ) -> None:
        ...
