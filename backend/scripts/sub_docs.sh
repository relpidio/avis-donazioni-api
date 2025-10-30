#!/bin/zsh
echo "📘 GERANDO DOCUMENTAÇÃO SWAGGER..."
cd "$(dirname "$0")/.."
FASTAPI_DIR="$PWD/python-fastapi"
DOCS_DIR="$FASTAPI_DIR/generated/docs"

source "$FASTAPI_DIR/.venv/bin/activate"
mkdir -p "$DOCS_DIR"

python3 - <<'EOF'
import httpx, json, os
url = "http://127.0.0.1:8000/openapi.json"
docs_path = os.path.abspath("python-fastapi/generated/docs")

try:
    with httpx.Client(timeout=5) as client:
        r = client.get(url)
        if r.status_code == 200:
            html = f"""<!DOCTYPE html>
<html><head><title>AVIS API Docs</title>
<link rel='stylesheet' href='https://unpkg.com/swagger-ui-dist/swagger-ui.css'/></head>
<body><div id='swagger-ui'></div>
<script src='https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js'></script>
<script>SwaggerUIBundle({{ spec: {json.dumps(r.json())}, dom_id: '#swagger-ui' }});</script>
</body></html>"""
            with open(os.path.join(docs_path, "index.html"), "w") as f:
                f.write(html)
            print(f"✅ Documentação salva em {docs_path}/index.html")
        else:
            print(f"⚠️ Falha ao gerar docs: {r.status_code}")
except Exception as e:
    print(f"⚠️ Erro ao gerar documentação: {e}")
EOF
