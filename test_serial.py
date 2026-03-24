import requests
import json

# Testar se o problema é na serialização
url = "http://192.168.0.71:8001/tools/"

print("[GET /tools/]")
resp = requests.get(url)
print(f"Status: {resp.status_code}, Items: {len(resp.json())}")

# Agora testar um ID específico
for tool_id in [4, 5, 13]:
    url = f"http://192.168.0.71:8001/tools/{tool_id}"
    print(f"\n[GET {url}]")
    resp = requests.get(url)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"OK: {resp.json()['code']}")
    else:
        print(f"Error: {resp.json()}")
