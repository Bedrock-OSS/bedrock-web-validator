from flask import Flask
from flask import request
from jsonschema import validate
from jsonschema.exceptions import ValidationError
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/validate_schema', methods=['GET', 'POST'])
def validate_schema():
    if request.method == 'POST':
        content = request.json
        schema_name = str(content['schema_name'])
        data = json.loads(content['data'])
        
        schema = get_schema(schema_name)

        if schema is None:
            return {
                'valid': False,
                'message': 'Schema not found.'
            }

        try:
            validate(data, schema)
        except ValidationError as e:
            print(e)
            message =  {
                'valid': False,
                'message': str(e),
                'path': '/'.join([str(x) for x in e.absolute_path]),
                'validator': e.validator,
                'validator_value': e.validator_value,
                'json_path': e.json_path
            }
            
            print(json.dumps(message, indent=2))
            return message
        else:
            return {
                'valid': True
            }
    else:
        return "Not a valid request"

def load_schema(path):
    with open(path, 'r', encoding="utf-8-sig") as f:
        return json.load(f)

def get_schema(schema_name):
    try:
        return load_schema(schema_path = 'schemas/' + schema_name + '.json')
    except FileNotFoundError:
        return None
