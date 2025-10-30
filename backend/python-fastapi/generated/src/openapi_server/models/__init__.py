# openapi_server/models/__init__.py

from .user_model import Base, User
from .appointment import Appointment
from .appointment_create import AppointmentCreate
from .appointment_update import AppointmentUpdate
from .center import Center
from .donation_record import DonationRecord
from .donor import Donor
from .donor_update import DonorUpdate
from .login_request import LoginRequest
from .register_request import RegisterRequest
from .slot import Slot
from .test_result import TestResult
from .extra_models import *  # inclui eventuais modelos auxiliares

# 🔗 Exporte o Base principal para ser usado pelo Alembic e SQLAlchemy
__all__ = [
    "Base",
    "User",
    "Appointment",
    "AppointmentCreate",
    "AppointmentUpdate",
    "Center",
    "DonationRecord",
    "Donor",
    "DonorUpdate",
    "LoginRequest",
    "RegisterRequest",
    "Slot",
    "TestResult",
]