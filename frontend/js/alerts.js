const modal = document.getElementById("alertModal");
const alertText = document.getElementById("alertText");
const alarm = document.getElementById("alarmSound");

let alertTimeout = null;

db.ref("hospital/alerts/active_alerts").on("value", (snap) => {
  const alerts = snap.val();

  if (!alerts) {
    hideAlert();
    return;
  }

  const firstKey = Object.keys(alerts)[0];
  const alert = alerts[firstKey];

  alertText.innerText = `${alert.bed_id} (${alert.floor}): ${alert.reason}`;
  modal.classList.remove("hidden");

  alarm.play().catch(() => {});

  clearTimeout(alertTimeout);
  alertTimeout = setTimeout(hideAlert, 30000);
});

function hideAlert() {
  modal.classList.add("hidden");
  alarm.pause();
  alarm.currentTime = 0;
}

function closeAlert() {
  hideAlert();
}
