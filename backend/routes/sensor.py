from fastapi import APIRouter
from backend.models import SensorData
from backend.firebase import database
from backend.logic import determine_status_and_reason
from backend.alerts import create_alert, clear_alert
import time

router = APIRouter()

@router.post("/sensor-data")
def receive_data(data: SensorData):

    status, reason = determine_status_and_reason(
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

    if status == "critical":
        create_alert(data.device_id, floor, status, reason)
    else:
        clear_alert(data.device_id)

    return {
        "message": "Data received successfully",
        "status": status,
        "reason": reason
    }
