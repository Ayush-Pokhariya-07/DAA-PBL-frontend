// Auto Theme Toggle Functionality
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");

// Function to apply the chosen theme
function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark");
    } else {
        body.classList.remove("dark");
    }
}

// Retrieve saved theme from localStorage
let storedTheme = localStorage.getItem("theme");
if (storedTheme) {
    applyTheme(storedTheme);
} else {
    // Use system preference if no theme saved
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
}

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
});

// Navigation button functionality
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "login.html";
});

document.getElementById("get-started").addEventListener("click", () => {
    window.location.href = "app.html"; // or the appropriate URL
});
