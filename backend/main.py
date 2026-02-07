from fastapi import FastAPI
from routes.sensor import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def root():
    return {"status": "Backend running"}
