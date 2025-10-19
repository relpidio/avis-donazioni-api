# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import StrictStr
from typing import Any
from openapi_server.models.donor import Donor
from openapi_server.models.donor_update import DonorUpdate
from openapi_server.security_api import get_token_bearerAuth

class BaseDonorsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseDonorsApi.subclasses = BaseDonorsApi.subclasses + (cls,)
    async def donors_donor_id_get(
        self,
        donorId: StrictStr,
    ) -> Donor:
        ...


    async def donors_donor_id_put(
        self,
        donorId: StrictStr,
        donor_update: DonorUpdate,
    ) -> None:
        ...
