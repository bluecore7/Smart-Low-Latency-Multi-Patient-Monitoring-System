// --- CONFIGURATION ---
const CRITICAL_THRESHOLDS = {
  spo2_min: 90, // Below 90% is Critical
  hr_max: 120, // Above 120 BPM is Critical
  temp_max: 38.5, // Above 38.5°C is Critical
};

// --- SETUP UI ---
let toastContainer = document.getElementById("toast-container");
if (!toastContainer) {
  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  document.body.appendChild(toastContainer);
}

const alarmSound = document.getElementById("alarmSound");
const activeAlerts = new Map(); // Tracks currently alerting beds

// --- MAIN WATCHDOG LOOP ---
// We listen to the entire hospital data stream
db.ref("hospital/floors").on("value", (snapshot) => {
  const floors = snapshot.val();
  if (!floors) return;

  const currentCriticalBeds = new Set();
  let anyCritical = false;

  Object.entries(floors).forEach(([floorId, floorData]) => {
    if (!floorData.beds) return;

    Object.entries(floorData.beds).forEach(([bedId, bedData]) => {
      const v = bedData.vitals;
      if (!v) return;

      // CHECK VITALS (The Logic Fix)
      const issues = [];
      if (v.spo2 < CRITICAL_THRESHOLDS.spo2_min)
        issues.push(`Hypoxia (${v.spo2}%)`);
      if (v.heart_rate > CRITICAL_THRESHOLDS.hr_max)
        issues.push(`High HR (${v.heart_rate})`);
      if (v.temperature > CRITICAL_THRESHOLDS.temp_max)
        issues.push(`High Fever (${v.temperature.toFixed(1)}°C)`);

      if (issues.length > 0) {
        anyCritical = true;
        const uniqueKey = `${bedId}`;
        currentCriticalBeds.add(uniqueKey);

        // If this is a NEW alert or the reasons changed, update the UI
        const reasonText = issues.join(" + ");
        if (
          !activeAlerts.has(uniqueKey) ||
          activeAlerts.get(uniqueKey) !== reasonText
        ) {
          activeAlerts.set(uniqueKey, reasonText);
          showToast(bedId, floorId, reasonText);
        }
      }
    });
  });

  // Cleanup: Remove alerts for beds that are now normal
  for (const [key] of activeAlerts) {
    if (!currentCriticalBeds.has(key)) {
      removeToast(key);
      activeAlerts.delete(key);
    }
  }

  // Sound Management
  manageAudio(anyCritical);
});

// --- TOAST UI ---
function showToast(bedId, floorId, reason) {
  // Prevent duplicate toasts for the same bed
  removeToast(bedId);

  const toast = document.createElement("div");
  toast.className = "toast-alert slide-in";
  toast.id = `toast-${bedId}`;

  // Different icon based on issue
  let icon = "🚨";
  if (reason.includes("Fever")) icon = "🌡️";
  if (reason.includes("Hypoxia")) icon = "🌬️";
  if (reason.includes("HR")) icon = "💓";

  toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${bedId} <span style="font-size:0.7em; opacity:0.7">(${floorId})</span></div>
            <div class="toast-msg">${reason}</div>
        </div>
        <button onclick="ackAlert('${bedId}')" class="toast-close">×</button>
    `;

  toastContainer.appendChild(toast);
}

function removeToast(bedId) {
  const el = document.getElementById(`toast-${bedId}`);
  if (el) {
    el.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => el.remove(), 300);
  }
}

// Manually acknowledge an alert (temporary silence)
window.ackAlert = function (bedId) {
  removeToast(bedId);
  // We don't delete from activeAlerts map immediately,
  // effectively "snoozing" it until the reason changes.
  // To permanently silence, we rely on the watchdog loop finding it 'Normal' later.
};

// --- SMART AUDIO ---
let isPlaying = false;

function manageAudio(shouldPlay) {
  if (shouldPlay && !isPlaying) {
    alarmSound.loop = true; // Ensure it loops
    alarmSound
      .play()
      .then(() => {
        isPlaying = true;
      })
      .catch((e) => console.warn("Audio blocked - user interaction needed"));
  } else if (!shouldPlay && isPlaying) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    isPlaying = false;
  }
}
