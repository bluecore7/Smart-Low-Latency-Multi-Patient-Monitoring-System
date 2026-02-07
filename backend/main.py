from dotenv import load_dotenv
import os
import threading
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

from fastapi import FastAPI
from routes.sensor import router
from monitor import check_inactive_devices

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hospital-patient-monitor-c3f05.web.app",
        "https://hospital-patient-monitor-c3f05.firebaseapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
