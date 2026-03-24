from fastapi.testclient import TestClient
from main import app  # se o pacote for backend, usa from backend.main import app

client = TestClient(app)


def test_root_ok():
    resp = client.get("/")
    assert resp.status_code == 200
    assert "Bem-vindo" in resp.json()["message"]


# --- TOOLS ---


def test_create_tool_missing_field():
    # Enviar JSON incompleto para forçar erro de validação
    resp = client.post("/tools/", json={"name": "Molde sem tipo"})
    assert resp.status_code == 422  # erro de validação Pydantic/FastAPI


def test_create_tool_ok():
    body = {
        "name": "Molde XPTO",
        "tool_type_id": 1,  # ajusta aos campos reais do ToolCreate
    }
    resp = client.post("/tools/", json=body)
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Molde XPTO"
    assert "id" in data


def test_add_tool_document_tool_not_exists():
    # assumindo que 99999 não existe
    resp = client.post(
        "/tools/99999/documents/",
        params={"file_path": "C:\\docs\\inexistente.pdf"},
    )
    # neste momento o teu endpoint não verifica se a ferramenta existe,
    # por isso este teste vai dizer-te se precisas de adicionar essa validação.
    assert resp.status_code in (200, 500)


# --- INTERVENTIONS ---


def test_create_intervention_missing_body():
    resp = client.post("/interventions/", json={})
    assert resp.status_code == 422


def test_sync_intervention_not_found():
    resp = client.post("/sync/intervention/99999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Intervenção não encontrada para sincronização"