const floorsDiv = document.getElementById("floors");

db.ref("hospital/floors").on("value", (snapshot) => {
  floorsDiv.innerHTML = "";
  const floors = snapshot.val();
  if (!floors) return;

  Object.keys(floors).forEach((floorId) => {
    const floor = floors[floorId];
    const floorEl = document.createElement("div");
    floorEl.className = "floor";
    floorEl.innerHTML = `<h2>${floorId.toUpperCase()}</h2>`;

    const bedsEl = document.createElement("div");
    bedsEl.className = "beds";

    Object.keys(floor.beds || {}).forEach((bedId) => {
      const bed = floor.beds[bedId];
      const bedEl = document.createElement("div");
      bedEl.className = `bed ${bed.status || "offline"}`;
      bedEl.innerText = bedId;
      bedEl.onclick = () => {
        window.location.href = `bed.html?floor=${floorId}&bed=${bedId}`;
      };
      bedsEl.appendChild(bedEl);
    });

    floorEl.appendChild(bedsEl);
    floorsDiv.appendChild(floorEl);
  });
});
