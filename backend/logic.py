def determine_status_and_reason(temp, hr, spo2):
    if spo2 < 90:
        return "critical", "SpO2 dangerously low"
    elif temp > 38.5:
        return "critical", "High fever"
    elif hr > 120:
        return "critical", "Abnormal heart rate"
    elif temp > 37.5 or hr > 100 or spo2 < 95:
        return "warning", "Vitals slightly abnormal"
    else:
        return "normal", "Vitals stable"
