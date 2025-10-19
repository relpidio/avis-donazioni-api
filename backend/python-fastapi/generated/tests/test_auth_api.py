# coding: utf-8

from fastapi.testclient import TestClient


from typing import Any  # noqa: F401
from openapi_server.models.auth_login_post200_response import AuthLoginPost200Response  # noqa: F401
from openapi_server.models.donor import Donor  # noqa: F401
from openapi_server.models.login_request import LoginRequest  # noqa: F401
from openapi_server.models.register_request import RegisterRequest  # noqa: F401


def test_auth_register_post(client: TestClient):
    """Test case for auth_register_post

    Registra un nuovo donatore
    """
    register_request = {"password":"password","codice_fiscale":"codice_fiscale","phone":"phone","dob":"2000-01-23","last_name":"last_name","blood_group":"A+","gdpr_consent":1,"first_name":"first_name","email":"email"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/register",
    #    headers=headers,
    #    json=register_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_login_post(client: TestClient):
    """Test case for auth_login_post

    Login (email + password) / SSO
    """
    login_request = {"password":"password","email":"email"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/login",
    #    headers=headers,
    #    json=login_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

