# Avis Donazioni - Python FastAPI Backend

## Como rodar o servidor
```bash
cd backend/python-fastapi
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
uvicorn example_glue.main:app --reload --host 0.0.0.0 --port 8000

