const floorsDiv = document.getElementById("floors");
const STALE_TIMEOUT = 30;

// Your logic integrated into the frontend display
function getStatusUI(vitals) {
  const { temperature: temp, heart_rate: hr, spo2 } = vitals;

  if (spo2 < 90) return { status: "critical", reason: "SpO2 Low" };
  if (temp > 38.5) return { status: "critical", reason: "High Fever" };
  if (hr > 120) return { status: "critical", reason: "High HR" };
  if (temp > 37.5 || hr > 100 || spo2 < 95)
    return { status: "warning", reason: "Check Vitals" };

  return { status: "normal", reason: "Stable" };
}

db.ref("hospital/floors").on("value", (snapshot) => {
  floorsDiv.innerHTML = "";
  const floors = snapshot.val();
  if (!floors) return;

  Object.entries(floors).forEach(([floorId, floor]) => {
    const floorSection = document.createElement("section");
    floorSection.className = "floor-container";
    floorSection.innerHTML = `<h3>${floorId.toUpperCase()}</h3>`;

    const grid = document.createElement("div");
    grid.className = "bed-grid";

    Object.entries(floor.beds || {}).forEach(([bedId, bed]) => {
      let ui = { status: "offline", reason: "Disconnected" };
      let vitalDisplay = "--";

      if (bed.vitals && bed.vitals.timestamp) {
        const age = Date.now() / 1000 - bed.vitals.timestamp;
        if (age < STALE_TIMEOUT) {
          ui = getStatusUI(bed.vitals);
          vitalDisplay = `${bed.vitals.heart_rate} BPM | ${bed.vitals.spo2}%`;
        }
      }

      const bedCard = document.createElement("div");
      bedCard.className = `bed-card ${ui.status}`;
      bedCard.innerHTML = `
                <div class="bed-header">
                    <span class="bed-name">${bedId}</span>
                    <span class="status-dot"></span>
                </div>
                <div class="vital-summary">${vitalDisplay}</div>
                <div class="reason-tag">${ui.reason}</div>
            `;

      bedCard.onclick = () =>
        (window.location.href = `bed.html?floor=${floorId}&bed=${bedId}`);
      grid.appendChild(bedCard);
    });

    floorSection.appendChild(grid);
    floorsDiv.appendChild(floorSection);
  });
});
