# Smart Low-Latency Multi-Patient Monitoring System

A real-time, scalable hospital patient monitoring system designed to track vital signs (Heart Rate, SpO₂, Temperature) across multiple beds and floors with **low latency**, **intelligent alerts**, and a **live dashboard** for doctors and nurses.

This project is built with an **IoT + Cloud + Web** architecture and supports both **real sensor data** and **high-fidelity simulation mode** for testing and demonstrations.

---

## 🔹 Phase – 1: Patient Node ↔ Doctor Node Communication

### Overview
Phase 1 focuses on establishing communication between:
- **Patient-side node** (sensor acquisition unit)
- **Doctor-side node** (monitoring/receiver unit)

The patient node is responsible for collecting physiological data from sensors and transmitting it wirelessly, while the doctor node receives and processes this data for monitoring and alerting.

### Key Objectives
- Establish low-latency wireless communication
- Collect vital parameters from the patient side
- Transmit data reliably to the monitoring side
- Validate end-to-end data flow before cloud integration

### Components Used
- Microcontroller (ESP32 / ESP8266)
- MAX30102 (Heart Rate & SpO₂)
- Temperature sensor (internal / external)
- Wireless communication (Wi-Fi / ESP-NOW)
- Power regulation and basic alert indicators

### Circuit Diagram
![Phase 1 Circuit](https://github.com/bluecore7/Smart-Low-Latency-Multi-Patient-Monitoring-System/blob/main/assets/phase_1_circuit.jpeg)

---

## 🔹 Phase – 2: Cloud-Based Monitoring & Web Dashboard

Phase 2 extends the system into a **full hospital-scale solution** with cloud storage, backend processing, and a live web interface.

---

### 🏗️ System Architecture

ESP32 Nodes (Patients / Beds)
↓
FastAPI Backend (Render)
↓
Firebase Realtime Database
↓
Web Dashboard (Firebase Hosting)


---

### 🌐 Backend (FastAPI + Render)
- Receives real-time data from ESP32 nodes
- Classifies patient condition using medical logic
- Updates Firebase Realtime Database
- Manages alerts and bed activity status

**Deployment:** Render  
**Endpoint Example:**
POST /sensor-data


---

### 🧠 Medical Status Logic
The backend intelligently classifies patient condition into:
- **Normal**
- **Warning**
- **Critical**

Based on:
- Heart Rate
- SpO₂
- Temperature

This logic prevents false alarms and reflects real clinical behavior (e.g., fever ≠ immediate critical).

---

### 🖥️ Web Dashboard (Firebase Hosting)

The dashboard provides:
- Floor-wise and bed-wise visualization
- Real-time status updates
- Color-coded patient condition:
  - 🟢 Normal
  - 🟡 Warning
  - 🔴 Critical
  - ⚫ Offline / Empty bed
- Alert popups and sound notifications
- Dedicated bed detail view

#### Live Demo Screens
![System Architecture](https://github.com/bluecore7/Smart-Low-Latency-Multi-Patient-Monitoring-System/blob/main/assets/phase_2.jpeg)
![Live Dashboard](https://github.com/bluecore7/Smart-Low-Latency-Multi-Patient-Monitoring-System/blob/main/assets/live.jpeg)

---

## 🧪 Simulation Mode (ECG-Like Behavior)

To handle unreliable or unavailable sensors, the system includes a **realistic simulation engine** running on ESP32:

- No blocking delays (`millis()` based)
- Continuous micro-fluctuations (ECG-like)
- Slow physiological drift
- Multiple patient scenarios:
  - Normal
  - Fever
  - Cardiac spike
  - Low oxygen saturation
- Independent timing per bed

This allows full system testing without hardware dependency and mimics real ICU monitor behavior.

---

## 🛏️ Hospital Model Implemented

### Floor 1
- 6 beds
- 3 occupied, 3 empty

### Floor 2
- 4 general beds (empty)
- 1 ICU bed (occupied)

Only occupied beds actively stream data.

---

## 🔐 Key Features

- Low-latency data transmission
- Scalable multi-bed architecture
- Intelligent alert classification
- Cloud-hosted backend & database
- Real-time web dashboard
- Sensor + simulation dual mode
- Designed for hospital & ICU use cases

---

## 🚀 Future Enhancements

- ECG waveform visualization
- Role-based access (Doctor / Nurse)
- Mobile-friendly nurse view
- Trend analysis & prediction
- Sensor auto-calibration
- Power optimization for wearable nodes

---

## 📌 Tech Stack

- **Hardware:** ESP32, MAX30102
- **Backend:** FastAPI (Python)
- **Database:** Firebase Realtime Database
- **Hosting:** Render, Firebase Hosting
- **Frontend:** HTML, CSS, JavaScript
- **Communication:** Wi-Fi (802.11 b/g/n)
