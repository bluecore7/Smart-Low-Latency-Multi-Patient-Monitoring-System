import time
from backend.firebase import database
from typing import Dict, Any

INACTIVE_TIMEOUT = 20  # seconds

def check_inactive_devices():
    while True:
        floors_ref = database.child("hospital/floors").get()
        current_time = int(time.time())

        if not isinstance(floors_ref, dict):
            time.sleep(5)
            continue

        for floor_id, floor_data in floors_ref.items():
            beds = floor_data.get("beds", {})

            if not isinstance(beds, dict):
                continue

            for bed_id, bed_data in beds.items():
                vitals = bed_data.get("vitals")
                if not vitals:
                    continue

                last_update = vitals.get("timestamp")
                if not last_update:
                    continue

                if current_time - last_update > INACTIVE_TIMEOUT:
                    database.child(
                        f"hospital/floors/{floor_id}/beds/{bed_id}"
                    ).update({
                        "active": False,
                        "status": "offline"
                    })

        time.sleep(5)
