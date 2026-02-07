import firebase_admin
from firebase_admin import credentials, db
import os

cred = credentials.Certificate("firebase_key.json")

firebase_admin.initialize_app(cred, {
    "databaseURL": os.getenv("FIREBASE_DB_URL")
})

database = db.reference()
