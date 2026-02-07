from dotenv import load_dotenv
import os

# Load environment variables FIRST
load_dotenv()

from fastapi import FastAPI
from backend.routes.sensor import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def root():
    return {"status": "Backend running"}
