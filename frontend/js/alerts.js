// Create the container dynamically if it doesn't exist
let toastContainer = document.getElementById("toast-container");
if (!toastContainer) {
  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  document.body.appendChild(toastContainer);
}

const alarmSound = document.getElementById("alarmSound");
let activeAlerts = new Set();

db.ref("hospital/alerts/active_alerts").on("value", (snap) => {
  const alerts = snap.val();

  // clear current list logic handled visually
  const currentKeys = alerts ? Object.keys(alerts) : [];

  // 1. Remove stale alerts from screen
  activeAlerts.forEach((key) => {
    if (!currentKeys.includes(key)) {
      removeToast(key);
      activeAlerts.delete(key);
    }
  });

  if (!alerts) {
    stopAlarm();
    return;
  }

  // 2. Add new alerts
  let hasCritical = false;
  Object.entries(alerts).forEach(([key, alert]) => {
    hasCritical = true;
    if (!activeAlerts.has(key)) {
      createToast(key, alert);
      activeAlerts.add(key);
    }
  });

  if (hasCritical) playAlarm();
});

function createToast(key, alert) {
  const toast = document.createElement("div");
  toast.className = "toast-alert slide-in";
  toast.id = `toast-${key}`;

  toast.innerHTML = `
        <div class="toast-icon">🚨</div>
        <div class="toast-content">
            <div class="toast-title">${alert.bed_id}</div>
            <div class="toast-msg">${alert.reason}</div>
        </div>
        <button onclick="ackAlert('${key}')" class="toast-close">×</button>
    `;

  toastContainer.appendChild(toast);
}

function removeToast(key) {
  const el = document.getElementById(`toast-${key}`);
  if (el) el.remove();
}

window.ackAlert = function (key) {
  db.ref(`hospital/alerts/active_alerts/${key}`).remove();
  removeToast(key);
};

function playAlarm() {
  alarmSound.play().catch((e) => console.log("Click to enable audio"));
}

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}
