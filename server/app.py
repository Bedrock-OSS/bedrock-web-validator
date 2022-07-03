from flask import Flask
from flask import request
from jsonschema import validate
from jsonschema.exceptions import ValidationError, SchemaError
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/")
def main():
    return "This is an API. Please see: https://github.com/Bedrock-OSS/bedrock-web-validator"

@app.route('/api/validate_schema', methods=['GET', 'POST'])
def validate_schema():
    if request.method != 'POST':
        return {
            'valid': False,
            'title': '500',
            'message': 'Not a valid request.'
        }

    content = request.json
    schema_name = str(content['path'])
    data = json.loads(content['data'])
    
    schema = get_schema(schema_name)

    if schema is None:
        return {
            'valid': False,
            'title': 'Schema not found.',
            'message': 'Please select a schema to continue. If this issue persists, contact the maintainers.'
        }

    try:
        validate(data, schema)
    except ValidationError as e:
        print(e)
        message =  {
            'valid': False,
            'title': 'Your json has issues...',
            'message': e.message,
            'path': '/'.join([str(x) for x in e.absolute_path]),
            'validator': e.validator,
            'validator_value': e.validator_value,
            'json_path': e.json_path
        }
        
        print(json.dumps(message, indent=2))
        return message
    except SchemaError as e:
        return {
            'valid': False,
            'title': 'Something is wrong with that schema. Its not your fault.',
            'message': str(e)
        }
    except Exception as e:
        return {
            'valid': False,
            'title': 'Something went wrong. Its not your fault.',
            'message': str(e)
        }
    else:
        return {
            'valid': True,
            'title': 'Success!',
            'message': 'Everything looks good.'
        }
    

def get_schema(schema_name):
    try:
        path = '../schemas/' + schema_name + '.json'
        print(path)
        with open(path, 'r', encoding="utf-8-sig") as f:
            return json.load(f)

            # # Workaround: https://github.com/Blockception/Minecraft-bedrock-json-schemas/issues/17
            # schema["$schema"] = "http://json-schema.org/draft-07/schema#"
            # return schema

    except FileNotFoundError:
        return None
