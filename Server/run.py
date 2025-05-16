import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import logging
import bcrypt
import json
from app import create_app
from dotenv import load_dotenv
import os

# Set up logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv()  # Load environment variables from .env

deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY")

app = create_app()
## TODO: CREATE REAL SECRET KEY
CORS(app)

@app.errorhandler(403)
def forbidden(e):
    logging.error(f"403 error: {e}")
    return jsonify({"message": "Forbidden: You don't have permission to access this resource"}), 403

if __name__ == '__main__':
    app.run(debug=True)
