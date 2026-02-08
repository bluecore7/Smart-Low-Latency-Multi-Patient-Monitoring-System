def determine_status_and_reason(temp, hr, spo2):
    # CRITICAL CONDITIONS
    if spo2 < 90:
        return "critical", "Severe hypoxia detected"

    if hr >= 140:
        return "critical", "Cardiac spike detected"

    if temp >= 39:
        return "critical", "High-grade fever"

    # WARNING CONDITIONS
    if 38 <= temp < 39:
        return "warning", "Fever detected"

    if 105 < hr < 140:
        return "warning", "Elevated heart rate"

    if 90 <= spo2 < 95:
        return "warning", "Oxygen saturation slightly low"

    # NORMAL
    return "normal", "Vitals within normal range"
