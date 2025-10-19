# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import StrictStr  # noqa: F401
from typing import List  # noqa: F401
from openapi_server.models.test_result import TestResult  # noqa: F401


def test_donors_donor_id_tests_get(client: TestClient):
    """Test case for donors_donor_id_tests_get

    Elenco risultati esami del donatore (PDF/valori)
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/donors/{donorId}/tests".format(donorId='donor_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

