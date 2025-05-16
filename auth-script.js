// Auto Theme Toggle Functionality for Authentication Pages
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark");
    } else {
        body.classList.remove("dark");
    }
}

let storedTheme = localStorage.getItem("theme");
if (storedTheme) {
    applyTheme(storedTheme);
} else {
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
}

themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
});

// Form submission can be integrated with your backend later;
// for now, we can prevent default submission and log form data for testing.
document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    // Example: Call your login API here
    alert("Login form submitted!");
});

document.getElementById("signup-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    // Example: Call your signup API here
    alert("Signup form submitted!");
});
