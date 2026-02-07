from dotenv import load_dotenv
import os
import threading

load_dotenv()

from fastapi import FastAPI
from routes.sensor import router
from backend.monitor import check_inactive_devices

app = FastAPI()
app.include_router(router)

@app.on_event("startup")
def start_monitor():
    thread = threading.Thread(
        target=check_inactive_devices,
        daemon=True
    )
    thread.start()

@app.get("/")
def root():
    return {"status": "Backend running"}
