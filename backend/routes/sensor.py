from fastapi import APIRouter
from backend.models import SensorData
from backend.firebase import database
from backend.logic import determine_status
import time

router = APIRouter()

@router.post("/sensor-data")
def receive_data(data: SensorData):

    status = determine_status(
        data.temperature,
        data.heart_rate,
        data.spo2
    )

    floor = "floor1" if data.device_id.startswith("F1") else "floor2"

    bed_ref = database.child(
        f"hospital/floors/{floor}/beds/{data.device_id}"
    )

    bed_ref.update({
        "active": True,
        "status": status,
        "vitals": {
            "temperature": data.temperature,
            "heart_rate": data.heart_rate,
            "spo2": data.spo2,
            "timestamp": int(time.time())
        }
    })

    return {
        "message": "Data received successfully",
        "status": status
    }
