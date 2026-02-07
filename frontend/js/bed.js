const params = new URLSearchParams(window.location.search);
const floor = params.get("floor");
const bed = params.get("bed");

document.getElementById("title").innerText = `${floor} - ${bed}`;

db.ref(`hospital/floors/${floor}/beds/${bed}`).on("value", (snap) => {
  const data = snap.val();
  if (!data || !data.vitals) return;

  document.getElementById("details").innerHTML = `
    <p>Status: ${data.status}</p>
    <p>Temperature: ${data.vitals.temperature}</p>
    <p>Heart Rate: ${data.vitals.heart_rate}</p>
    <p>SpO₂: ${data.vitals.spo2}</p>
    <p>Last Update: ${new Date(data.vitals.timestamp * 1000)}</p>
  `;
});
