import requests
import json

def test_validate(schema_name, data):
    url = 'http://127.0.0.1:5000/api/validate_schema'

    payload = {
        'schema_name': schema_name,
        'data': data
    }

    headers = {'content-type': 'application/json'}

    response = requests.post(url, data=json.dumps(payload, indent=2), headers=headers)
    print(response.text)

test_validate('user', {'name': 'John'})