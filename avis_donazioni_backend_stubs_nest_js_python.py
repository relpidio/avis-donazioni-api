# AVIS Donazioni — Backend: OpenAPI Generator + NestJS & Python stubs

"""
This canvas contains:
- Recommendations (NestJS vs alternatives)
- OpenAPI Generator commands to produce server/client stubs
- Concrete commands (Docker & CLI) for generating:
  * python-fastapi server stub
  * nodejs-express-server stub (base to adapt to NestJS)
  * typescript-nestjs client (experimental)
- Example project layouts and integration notes
- A small hand-written FastAPI "glue" skeleton (main.py) to run the generated code
- Best-practices to keep generated code separate from handwritten business logic

Language: italiano/italiano-primario (documentazione técnica em português para você).
"""

########################################
# RECOMENDAÇÕES RÁPIDAS
########################################
# 1) Framework recomendado para o backend principal
#    - NestJS (TypeScript) — ótima opção para APIs grandes, arquitetura modular e DI.
#    - Alternativa para Python: FastAPI — simples, performática e compatível com OpenAPI.
# 2) Como usar OpenAPI Generator aqui
#    - Para Python (FastAPI): use o gerador `python-fastapi` (gera server stubs).
#    - Para NestJS: não existe um gerador oficial e estável que crie um servidor NestJS completo.
#      O gerador `typescript-nestjs` é disponível como *client* (experimental). Portanto a
#      estratégia prática é: gerar um servidor Node.js Express (`nodejs-express-server`) e
#      ou gerar models/clients TypeScript (`typescript-node` / `typescript-axios` / `typescript-nestjs` client)
#      e então adaptar/integrar isso num projeto NestJS (mapeando controllers e serviços).

########################################
# OPENAPI GENERATOR - COMANDOS (exemplos)
########################################
# (A) Usando Docker (recomendado para compatibilidade)
# Certifique-se que `openapi.yaml` está no diretório corrente ($PWD)

# 1) Gerar servidor Python FastAPI (diretório: generated/python-fastapi)
# ------------------------------------------------------------------
# comando:
# docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
#   -i /local/openapi.yaml -g python-fastapi -o /local/generated/python-fastapi

# 2) Gerar servidor Node.js Express (base para adaptar ao NestJS)
# ------------------------------------------------------------------
# comando:
# docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
#   -i /local/openapi.yaml -g nodejs-express-server -o /local/generated/node-express

# 3) Gerar client TypeScript para usar dentro de NestJS (experimental client generator)
# ------------------------------------------------------------------
# comando:
# docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
#   -i /local/openapi.yaml -g typescript-nestjs -o /local/generated/ts-nest-client

# 4) Alternativa: gerar models/typescript + axios client (mais estável)
# ------------------------------------------------------------------
# docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
#   -i /local/openapi.yaml -g typescript-axios -o /local/generated/ts-axios-client

# 5) (opcional) Usar fastapi-code-generator (Python community tool)
# ------------------------------------------------------------------
# pip install fastapi-code-generator
# fastapi-codegen --input openapi.yaml --output ./generated/fastapi-codegen

########################################
# EXEMPLO DE FLUXO (recomendado)
########################################
# - Fase 1 (API-first): Mantenha o openapi.yaml como a única fonte da verdade.
# - Fase 2 (geração automática): Gere o servidor Python com `python-fastapi` para validar
#   endpoints e mocks rapidamente.
# - Fase 3 (produção): Escolha NestJS para produção ou mantenha FastAPI em Python.
# - Se escolher NestJS: gere clients/DTOs TypeScript (typescript-axios ou typescript-nestjs client)
#   e crie controllers Nest que chamam serviços com esses DTOs.

########################################
# EXEMPLO DE ESTRUTURA GERADA (Python - python-fastapi)
########################################
# generated/python-fastapi/
# ├── README.md
# ├── app/
# │   ├── api/
# │   │   ├── controllers/
# │   │   └── openapi_server/
# │   ├── models/
# │   ├── schemas/
# │   └── main.py    <-- ponto de entrada uvicorn
# ├── requirements.txt
# └── setup.py

########################################
# EXEMPLO small FASTAPI glue (main.py) - edit only in `app/` business modules
########################################
from fastapi import FastAPI

app = FastAPI(title="AVIS Donazioni - Mock Server")

# NOTE: generated code usually creates routers under `app.api.controllers` or similar.
# Here we mount generated routers. If generator uses different layout, adapt the import.
try:
    from openapi_server import router as generated_router
    app.include_router(generated_router)
except Exception:
    # fallback simple root
    @app.get("/")
    def root():
        return {"status": "generated stubs not mounted"}

# Run: uvicorn app.main:app --reload

########################################
# ADAPTAÇÕES AO NESTJS (estratégia prática)
########################################
# - Opção A (mais simples): gerar nodejs-express-server e reusar os controllers como referência
#   para implementar controllers NestJS manualmente.
# - Opção B (tipagem): gerar typescript models/clients (typescript-axios), copiá-los para
#   libs/shared (ou usar como package npm) e usá-los em DTOs/Services Nest.
# - Opção C (experimental): generate typescript-nestjs client to get module typings; still
#   you'll write controllers and providers in Nest to implement business logic.

########################################
# BOAS PRÁTICAS SOBRE CÓDIGO GERADO
########################################
# - Nunca editar diretamente arquivos gerados que serão re-gerados; mantenha um `custom/` or `impl/`
#   folder where you implement business logic and call generated models/interfaces.
# - Versione o openapi.yaml no repo e marque releases; generate code via CI when schema changes.
# - Adicione testes de contrato (e2e) que validem o comportamento do servidor contra o spec.

########################################
# EXEMPLOS DE COMANDOS LOCAIS (sem Docker)
########################################
# 1) Instalar openapi-generator-cli via npm:
# npm install @openapitools/openapi-generator-cli -g
# 2) Gerar python-fastapi:
# openapi-generator-cli generate -i openapi.yaml -g python-fastapi -o generated/python-fastapi

########################################
# O QUE EU COLOQUEI/GEREI AQUI NO CANVAS
########################################
# - Guia passo-a-passo para gerar stubs com OpenAPI Generator
# - Comandos Docker/CLI para python-fastapi, nodejs-express-server, typescript-nestjs (client)
# - Exemplo de main.py de integração com FastAPI
# - Estrutura de pastas sugerida e melhores práticas para integração com NestJS

########################################
# PRÓXIMOS PASSOS (posso executar já na conversa):
# - (A) Gerar automaticamente os stubs Python aqui no canvas (incluir o código gerado mínimo)
# - (B) Gerar um scaffold inicial de projeto NestJS (manual) com controllers vazios e DTOs
# - (C) Gerar uma collection Postman/Insomnia a partir do OpenAPI
# - (D) Incluir scripts CI (GitHub Actions) para gerar stubs automaticos em cada PR

# Se quiser que eu gere o código stub Python agora (A), responda: "Gere stubs Python".
# Se quiser que eu gere o scaffold NestJS (B), responda: "Gere NestJS scaffold".
# Se quiser ambos, responda: "Gere ambos".

# Fim do canvas
