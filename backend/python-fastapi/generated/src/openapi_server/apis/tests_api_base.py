# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import StrictStr
from typing import List
from openapi_server.models.test_result import TestResult
from openapi_server.security_api import get_token_bearerAuth

class BaseTestsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseTestsApi.subclasses = BaseTestsApi.subclasses + (cls,)
    async def donors_donor_id_tests_get(
        self,
        donorId: StrictStr,
    ) -> List[TestResult]:
        ...
