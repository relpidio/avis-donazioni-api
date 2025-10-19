# coding: utf-8

from fastapi.testclient import TestClient


from typing import Any  # noqa: F401
from openapi_server.models.notifications_subscribe_post_request import NotificationsSubscribePostRequest  # noqa: F401


def test_notifications_subscribe_post(client: TestClient):
    """Test case for notifications_subscribe_post

    Registra token per notifiche push
    """
    notifications_subscribe_post_request = openapi_server.NotificationsSubscribePostRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/notifications/subscribe",
    #    headers=headers,
    #    json=notifications_subscribe_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

