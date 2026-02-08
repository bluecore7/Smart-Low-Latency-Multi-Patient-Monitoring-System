const urlParams = new URLSearchParams(window.location.search);
const floorId = urlParams.get("floor");
const bedId = urlParams.get("bed");

// Set Titles immediately
document.getElementById("bedTitle").innerText = bedId || "Unknown Bed";
document.getElementById("floorSub").innerText = floorId
  ? floorId.toUpperCase()
  : "--";

const bedRef = db.ref(`hospital/floors/${floorId}/beds/${bedId}`);

bedRef.on("value", (snapshot) => {
  const data = snapshot.val();

  // DEBUG: If this logs "null", your Firebase path is wrong
  console.log("Bed Data:", data);

  if (!data) {
    document.getElementById("statusBadge").innerText = "NO DATA";
    return;
  }

  // Handle case where vitals might be missing
  const v = data.vitals || {};

  // 1. UPDATE VALUES (with fallbacks)
  document.getElementById("hrVal").innerText = v.heart_rate || "--";
  document.getElementById("spo2Val").innerText = v.spo2 || "--";
  // Fix temperature decimals
  const temp = v.temperature ? parseFloat(v.temperature).toFixed(1) : "--";
  document.getElementById("tempVal").innerText = temp;

  // 2. DETERMINE STATUS
  // Use the exact same logic as your dashboard
  const statusInfo = determineStatus(v.temperature, v.heart_rate, v.spo2);

  // 3. UPDATE VISUALS
  updateVisuals(statusInfo.status, v.timestamp);
});

function determineStatus(temp, hr, spo2) {
  // Safety check for undefined values
  if (!temp || !hr || !spo2) return { status: "offline" };

  if (spo2 < 90) return { status: "critical" };
  if (temp > 38.5 || hr > 120) return { status: "critical" };
  if (temp > 37.5 || hr > 100 || spo2 < 95) return { status: "warning" };

  return { status: "normal" };
}

function updateVisuals(status, timestamp) {
  const body = document.body;
  const badge = document.getElementById("statusBadge");

  // Reset classes
  body.className = "detail-page";

  // Add specific status class to Body to change the whole background theme
  body.classList.add(`theme-${status}`);

  badge.className = `badge ${status}`;
  badge.innerText = status.toUpperCase();

  // Time Ticker
  if (window.ticker) clearInterval(window.ticker);

  window.ticker = setInterval(() => {
    if (!timestamp) {
      document.getElementById("lastUpdated").innerText = "Never";
      return;
    }
    const diff = Math.floor(Date.now() / 1000 - timestamp);
    document.getElementById("lastUpdated").innerText = `${diff}s ago`;

    const conn = document.getElementById("connectionStatus");
    if (diff > 30) {
      conn.innerText = "OFFLINE";
      conn.classList.add("dead");
      conn.classList.remove("live");
    } else {
      conn.innerText = "LIVE";
      conn.classList.add("live");
      conn.classList.remove("dead");
    }
  }, 1000);
}
