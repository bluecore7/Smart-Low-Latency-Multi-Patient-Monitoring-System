import time
from backend.firebase import database

def create_alert(bed_id, floor, status, reason):
    alert_ref = database.child(
        f"hospital/alerts/active_alerts/{bed_id}"
    )

    # Prevent duplicate alerts
    if alert_ref.get():
        return

    alert_ref.set({
        "bed_id": bed_id,
        "floor": floor,
        "status": status,
        "reason": reason,
        "timestamp": int(time.time())
    })


def clear_alert(bed_id):
    alert_ref = database.child(
        f"hospital/alerts/active_alerts/{bed_id}"
    )

    if alert_ref.get():
        alert_ref.delete()
