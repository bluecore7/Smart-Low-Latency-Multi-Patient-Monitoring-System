const floorsDiv = document.getElementById("floors");
const STALE_TIMEOUT = 30; // seconds

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

      if (bed.active && bed.vitals) {
        const age = Date.now() / 1000 - (bed.vitals.timestamp || 0);

        if (age < STALE_TIMEOUT) {
          status = bed.status || "normal";
        }
      }

      const bedEl = document.createElement("div");
      bedEl.className = `bed ${status}`;
      bedEl.innerHTML = `
        <div>${bedId}</div>
        <small>${status.toUpperCase()}</small>
      `;

      bedEl.onclick = () => {
        window.location.href = `bed.html?floor=${floorId}&bed=${bedId}`;
      };

      bedsEl.appendChild(bedEl);
    });

    floorEl.appendChild(bedsEl);
    floorsDiv.appendChild(floorEl);
  });
});
