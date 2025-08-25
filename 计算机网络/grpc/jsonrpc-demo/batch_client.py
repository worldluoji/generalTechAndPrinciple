import requests
import json

url = "http://localhost:8988/jsonrpc"
headers = {'content-type': 'application/json'}

# 构建一个包含多个请求的数组
payload = [
    {"jsonrpc": "2.0", "method": "echo", "params": ["First"], "id": 1},
    {"jsonrpc": "2.0", "method": "add", "params": [1, 2], "id": 2},
    {"jsonrpc": "2.0", "method": "does_not_exist", "params": [], "id": 3}
]

response = requests.post(
    url, data=json.dumps(payload), headers=headers
).json()
print(f"Batch response: {json.dumps(response, indent=2)}")