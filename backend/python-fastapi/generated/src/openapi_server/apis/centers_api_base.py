# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from datetime import date
from pydantic import StrictFloat, StrictInt, StrictStr
from typing import List, Optional, Union
from openapi_server.models.center import Center
from openapi_server.models.slot import Slot


class BaseCentersApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseCentersApi.subclasses = BaseCentersApi.subclasses + (cls,)
    async def centers_center_id_availability_get(
        self,
        centerId: StrictStr,
        date_from: Optional[date],
        date_to: Optional[date],
    ) -> List[Slot]:
        ...


    async def centers_get(
        self,
        lat: Optional[Union[StrictFloat, StrictInt]],
        lng: Optional[Union[StrictFloat, StrictInt]],
        radius_km: Optional[StrictInt],
        region: Optional[StrictStr],
    ) -> List[Center]:
        ...
