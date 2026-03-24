import requests

url = "http://192.168.0.71:8001/tools/"

print(f"[GET] {url}")

try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total de ferramentas: {len(data)}")
    for tool in data:
        print(f"  ID {tool['id']}: {tool['code']}")
except Exception as e:
    print(f"Error: {e}")
