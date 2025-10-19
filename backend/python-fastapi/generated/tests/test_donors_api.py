# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import StrictStr  # noqa: F401
from typing import Any  # noqa: F401
from openapi_server.models.donor import Donor  # noqa: F401
from openapi_server.models.donor_update import DonorUpdate  # noqa: F401


def test_donors_donor_id_get(client: TestClient):
    """Test case for donors_donor_id_get

    Recupera profilo donatore
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/donors/{donorId}".format(donorId='donor_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_donors_donor_id_put(client: TestClient):
    """Test case for donors_donor_id_put

    Aggiorna dati donatore
    """
    donor_update = {"phone":"phone","gdpr_consent":1,"email":"email"}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/donors/{donorId}".format(donorId='donor_id_example'),
    #    headers=headers,
    #    json=donor_update,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

