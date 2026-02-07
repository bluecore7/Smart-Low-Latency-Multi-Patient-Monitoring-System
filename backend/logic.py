def determine_status(temp, hr, spo2):
    if temp > 38.5 or hr > 120 or spo2 < 90:
        return "critical"
    elif temp > 37.5 or hr > 100 or spo2 < 95:
        return "warning"
    else:
        return "normal"
