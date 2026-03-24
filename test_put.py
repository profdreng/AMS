import requests
import json

url = "http://192.168.0.71:8001/tools/5"
payload = {
    "code": "MZI000015000400",
    "serial_number": "MZI0000150004",
    "description": "Molde corpo 1500E + punho Ragni 260 [TESTE]",
    "tool_type_id": 1,  # Usar o tipo correto (1, não 2)
    "manufacture_date": "2026-03-13",
    "active": True
}

print(f"[PUT] {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.put(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
