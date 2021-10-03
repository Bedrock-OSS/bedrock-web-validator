from flask import Flask
from flask import request
from jsonschema import validate
from jsonschema.exceptions import ValidationError
import json

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/validate_schema', methods=['GET', 'POST'])
def validate_schema():
    if request.method == 'GET':
        return "No"
    else:
        content = request.json
        schema_name = content['schema_name']
        data = content['data']
        
        if schema_name == 'user':
            print("User!")
            schema = get_schema()


            print(schema)


            try:
                validate(data, schema)
            except ValidationError as e:
                return {
                    'message': e.message,
                    'validator': e.validator,
                    'validator_value': e.validator_value,
                    'json_path': e.json_path
                }
            else:
                return "Valid"

        if schema_name == 'skin':
            return "Skin"

        return "Not a valid schema"

def get_schema(): 
    with open('../schemas/skinpacks/skins.json', 'r', encoding="utf-8-sig") as f:
        return json.load(f)