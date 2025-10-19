# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import StrictStr  # noqa: F401
from typing import Any, List  # noqa: F401
from openapi_server.models.appointment import Appointment  # noqa: F401
from openapi_server.models.appointment_create import AppointmentCreate  # noqa: F401
from openapi_server.models.appointment_update import AppointmentUpdate  # noqa: F401


def test_appointments_get(client: TestClient):
    """Test case for appointments_get

    Lista appuntamenti del donatore
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/appointments",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_appointments_post(client: TestClient):
    """Test case for appointments_post

    Crea prenotazione
    """
    appointment_create = {"notes":"notes","center_id":"center_id","slot_id":"slot_id","donor_id":"donor_id"}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/appointments",
    #    headers=headers,
    #    json=appointment_create,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_appointments_appointment_id_put(client: TestClient):
    """Test case for appointments_appointment_id_put

    Reagenda prenotazione
    """
    appointment_update = {"slot_id":"slot_id"}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/appointments/{appointmentId}".format(appointmentId='appointment_id_example'),
    #    headers=headers,
    #    json=appointment_update,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_appointments_appointment_id_delete(client: TestClient):
    """Test case for appointments_appointment_id_delete

    Annulla prenotazione
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/appointments/{appointmentId}".format(appointmentId='appointment_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

