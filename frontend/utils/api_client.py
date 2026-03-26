import streamlit as st
import httpx
import os
from typing import Optional, List, Dict, Any

# Esta variável define o URL base para as chamadas à API do Backend.
# No Docker, o backend é acessível através do nome do serviço 'backend' na porta 8000.
# O valor por defeito é configurado no docker-compose.yml.
BACKEND_URL = os.getenv("BACKEND_API_URL", "http://192.168.0.71:8001").rstrip("/")

class APIClient:
    """
    Classe utilitária para centralizar todas as comunicações entre o 
    Frontend (Streamlit) e o Backend (FastAPI).
    """
    
    @staticmethod
    def get(endpoint: str, params: Optional[Dict[str, Any]] = None):
        """
        Realiza um pedido HTTP GET ao backend.
        Ideal para carregar listas de ferramentas, intervenções ou projetos.
        """
        try:
            # Constrói o URL completo e executa o pedido com um timeout de 10 segundos
            response = httpx.get(f"{BACKEND_URL}/{endpoint.lstrip('/')}", params=params, timeout=10.0)
            
            # Lança uma exceção se o servidor responder com um erro (ex: 404, 500)
            response.raise_for_status()
            
            # Retorna os dados em formato JSON (dicionário Python)
            return response.json()
        except Exception as e:
            # Em caso de erro, mostra uma mensagem visual no Streamlit para ajudar no diagnóstico
            st.error(f"Erro ao ligar ao backend ({endpoint}): {e}")
            return None

    @staticmethod
    def post(endpoint: str, data: Dict[str, Any]):
        """
        Realiza um pedido HTTP POST ao backend.
        Utilizado para criar novos registos (Ferramentas, Intervenções) ou 
        despoletar ações de sincronização com o OpenProject/SageX3.
        """
        try:
            # Envia os dados no corpo do pedido em formato JSON
            response = httpx.post(f"{BACKEND_URL}/{endpoint.lstrip('/')}", json=data, timeout=10.0)
            
            # Valida se o pedido foi bem sucedido
            response.raise_for_status()
            
            return response.json()
        except Exception as e:
            # Erros de validação do Pydantic ou da base de dados serão capturados aqui
            st.error(f"Erro ao enviar dados para o backend ({endpoint}): {e}")
            return None

# Instância única ready-to-use em todas as páginas do Streamlit
api_client = APIClient()
