# coding: utf-8

from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2AuthorizationCodeBearer, SecurityScopes
from jose import jwt, JWTError
from openapi_server.models.extra_models import TokenModel

# 🔐 Use a mesma chave e algoritmo definidos em core/security.py
SECRET_KEY = "bf7a7eed9006177519a78713ddd6937cdd29b3e3990356ff7ef1a035d028a514"
ALGORITHM = "HS256"

bearer_auth = HTTPBearer()


def get_token_bearerAuth(credentials: HTTPAuthorizationCredentials = Depends(bearer_auth)) -> TokenModel:
    """
    Decodifica e valida o token Bearer JWT.
    Retorna um TokenModel com o campo 'sub' (email) e 'role'.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        role: Optional[str] = payload.get("role", "user")

        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: sem 'sub' no payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # ✅ Retorna o modelo de token padronizado
        return TokenModel(sub=sub, role=role)

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido ou expirado: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Mantém o OAuth2 configurado (para futura compatibilidade)
oauth2_code = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://auth.avis.it/authorize",
    tokenUrl="https://auth.avis.it/token",
    refreshUrl="",
    scopes={
        "openid": "OpenID Connect scope",
        "profile": "Accesso profilo base",
    },
)


def get_token_oauth2(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_code)
) -> TokenModel:
    """Valida token via OAuth2 (não usado por enquanto)."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        role: Optional[str] = payload.get("role", "user")
        return TokenModel(sub=sub, role=role)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido ou expirado: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def validate_scope_oauth2(
    required_scopes: SecurityScopes, token_scopes: List[str]
) -> bool:
    """
    Verifica se o token contém os escopos necessários.
    (Atualmente sem uso)
    """
    return all(scope in token_scopes for scope in required_scopes.scopes)