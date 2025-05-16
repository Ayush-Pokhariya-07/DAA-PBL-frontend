// Toggle between mock data and real backend
// const USE_MOCK_DATA = false;
const USE_MOCK_DATA = false;

// Theme toggle logic
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    body.classList.toggle("dark", theme === "dark");
    document
        .querySelectorAll(".result-box")
        .forEach((el) => el.classList.toggle("dark", theme === "dark"));
}

const storedTheme = localStorage.getItem("theme");
if (storedTheme) applyTheme(storedTheme);
else
    applyTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    );

themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
});

// Initialize map
const dehradunCoords = [30.3165, 78.0322];
const map = L.map("map").setView(dehradunCoords, 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors",
    maxZoom: 19,
}).addTo(map);

// Form submission handler
document.getElementById("route-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();

    let data;
    if (USE_MOCK_DATA) {
        // Mock response
        data = {
            distance_km: (Math.random() * 20 + 5).toFixed(1),
            eta_min: Math.floor(Math.random() * 30 + 10),
            path: [dehradunCoords, [30.3265, 78.045], [30.3365, 78.055]],
            accidents: [
                { lat: 30.3265, lng: 78.045, severity: "medium", radius: 80 },
                { lat: 30.3365, lng: 78.055, severity: "high", radius: 100 },
            ],
        };
    } else {
        try {
            const resp = await fetch("/api/route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source, destination }),
            });
            if (!resp.ok) throw new Error("Network response was not ok");
            data = await resp.json();
        } catch (err) {
            console.error(err);
            alert("Could not compute route. Please try again.");
            return;
        }
    }

    // Update route details
    document.getElementById("distance").textContent = `${data.distance_km} km`;
    document.getElementById("time").textContent = `${data.eta_min} mins`;
    const resultBox = document.getElementById("route-result");
    resultBox.classList.remove("hidden");
    resultBox.classList.toggle("dark", body.classList.contains("dark"));

    // Update hotspot list
    const hotspotBox = document.getElementById("hotspot-list");
    const ul = document.getElementById("hotspots");
    ul.innerHTML = "";
    data.accidents.forEach((pt) => {
        const li = document.createElement("li");
        li.textContent = `${pt.severity.toUpperCase()} severity at (${pt.lat.toFixed(
            4
        )}, ${pt.lng.toFixed(4)})`;
        ul.appendChild(li);
    });
    hotspotBox.classList.remove("hidden");
    hotspotBox.classList.toggle("dark", body.classList.contains("dark"));

    // Render on map
    updateMapWithRoute(data.path, data.accidents);
});

// Draw route and hotspots
function updateMapWithRoute(pathCoords, accidentPoints) {
    map.eachLayer((layer) => {
        if (
            layer instanceof L.Marker ||
            layer instanceof L.Polyline ||
            layer instanceof L.Circle
        ) {
            map.removeLayer(layer);
        }
    });
    // Route polyline
    L.polyline(pathCoords, { color: "blue", weight: 4 }).addTo(map);
    // Start/end markers
    L.marker(pathCoords[0]).bindPopup("Start").addTo(map).openPopup();
    L.marker(pathCoords[pathCoords.length - 1])
        .bindPopup("End")
        .addTo(map);
    // Accident circles
    accidentPoints.forEach((pt) => {
        L.circle([pt.lat, pt.lng], {
            radius: pt.radius,
            color: pt.severity === "high" ? "red" : "orange",
            fillOpacity: 0.3,
        })
            .bindPopup(`Hotspot (severity: ${pt.severity})`)
            .addTo(map);
    });
    // Fit map
    map.fitBounds(pathCoords, { padding: [50, 50] });
}
