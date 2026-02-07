from pydantic import BaseModel

class SensorData(BaseModel):
    device_id: str
    temperature: float
    heart_rate: int
    spo2: int
