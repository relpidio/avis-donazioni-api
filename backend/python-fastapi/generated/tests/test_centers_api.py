# coding: utf-8

from fastapi.testclient import TestClient


from datetime import date  # noqa: F401
from pydantic import StrictFloat, StrictInt, StrictStr  # noqa: F401
from typing import List, Optional, Union  # noqa: F401
from openapi_server.models.center import Center  # noqa: F401
from openapi_server.models.slot import Slot  # noqa: F401


def test_centers_get(client: TestClient):
    """Test case for centers_get

    Lista centri (filtro per regione/coordinate/tipo)
    """
    params = [("lat", 3.4),     ("lng", 3.4),     ("radius_km", 50),     ("region", 'region_example')]
    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/centers",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_centers_center_id_availability_get(client: TestClient):
    """Test case for centers_center_id_availability_get

    Disponibilità (slots) per centro
    """
    params = [("date_from", '2013-10-20'),     ("date_to", '2013-10-20')]
    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/centers/{centerId}/availability".format(centerId='center_id_example'),
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

