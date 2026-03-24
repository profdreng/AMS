import requests
import json

url = "http://192.168.0.71:8001/tools/5"

print(f"[GET] {url}")

try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
