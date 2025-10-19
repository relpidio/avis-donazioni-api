# 🩸 AVIS Donazioni API

Backend per la gestione delle donazioni di sangue in Italia, ispirato all'app **NHS Give Blood (UK)**.  
Implementato in **FastAPI** e generato automaticamente via **OpenAPI 3.1**.

---
## 🚀 Funzionalità Principali
- Gestione prenotazioni (crea, aggiorna, cancella)
- Autenticazione donatori (`/auth/login`, `/auth/register`)
- Centri di donazione e disponibilità
- Compatibilità multi-lingua (italiano 🇮🇹, inglese 🇬🇧)

---
## 🛠️ Tecnologie
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)

---
## ⚙️ Esecuzione locale

```bash
git clone https://github.com/relpidio/avis-donazioni-api.git
cd avis-donazioni-api/backend/python-fastapi/generated
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn openapi_server.main:app --reload --app-dir src
