import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, db

# Load base64 key from env
firebase_key_base64 = os.getenv("FIREBASE_KEY_BASE64")
firebase_db_url = os.getenv("FIREBASE_DB_URL")

if not firebase_key_base64:
    raise RuntimeError("FIREBASE_KEY_BASE64 not set")

# Decode base64 → JSON
service_account_info = json.loads(
    base64.b64decode(firebase_key_base64).decode("utf-8")
)

cred = credentials.Certificate(service_account_info)

firebase_admin.initialize_app(cred, {
    "databaseURL": firebase_db_url
})

database = db.reference()
