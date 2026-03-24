import requests

url = "http://192.168.0.71:8001/tools/5"
payload = {
    "code": "MZI000015000400",
    "serial_number": "MZI0000150004",
    "description": "Molde corpo 1500E [TESTE SUCESSO]",
    "tool_type_id": 1,
    "manufacture_date": "2026-03-13",
    "active": True
}

print(f"[PUT] {url}")
print(f"Payload: {payload}")

response = requests.put(url, json=payload)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
