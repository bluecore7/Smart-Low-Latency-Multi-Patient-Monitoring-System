import firebase_admin
from firebase_admin import credentials, db
import os

# Get absolute path of the backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build absolute path to firebase_key.json
FIREBASE_KEY_PATH = os.path.join(BASE_DIR, "firebase_key.json")

# Safety check (very useful for debugging)
if not os.path.exists(FIREBASE_KEY_PATH):
    raise FileNotFoundError(f"firebase_key.json not found at {FIREBASE_KEY_PATH}")

cred = credentials.Certificate(FIREBASE_KEY_PATH)

firebase_admin.initialize_app(cred, {
    "databaseURL": os.getenv("FIREBASE_DB_URL")
})

database = db.reference()
