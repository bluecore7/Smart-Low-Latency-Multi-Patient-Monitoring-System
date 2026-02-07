const floorsDiv = document.getElementById("floors");
const STALE_TIMEOUT = 30; // 30 seconds

db.ref("hospital/floors").on("value", (snapshot) => {
  floorsDiv.innerHTML = "";
  const floors = snapshot.val();
  if (!floors) return;

  Object.entries(floors).forEach(([floorId, floor]) => {
    const floorEl = document.createElement("div");
    floorEl.className = "floor";
    floorEl.innerHTML = `<h2>${floorId.toUpperCase()}</h2>`;

    const bedsEl = document.createElement("div");
    bedsEl.className = "beds";

    Object.entries(floor.beds || {}).forEach(([bedId, bed]) => {
      let status = "offline";

      // Check if the timestamp exists and is fresh
      if (bed.vitals && bed.vitals.timestamp) {
        const now = Math.floor(Date.now() / 1000);
        const age = now - bed.vitals.timestamp;

        if (age < STALE_TIMEOUT) {
          status = bed.status || "normal";
        }
      }

      const bedEl = document.createElement("div");
      bedEl.className = `bed ${status}`;
      bedEl.innerHTML = `
                <div style="font-weight:bold; font-size: 1.1rem;">${bedId}</div>
                <div style="font-size: 0.7rem; margin-top:5px;">${status.toUpperCase()}</div>
            `;

      // Improved click handler
      bedEl.addEventListener("click", () => {
        window.location.href = `bed.html?floor=${floorId}&bed=${bedId}`;
      });

      bedsEl.appendChild(bedEl);
    });

    floorEl.appendChild(bedsEl);
    floorsDiv.appendChild(floorEl);
  });
});
