//theme toggle
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");

// to apply the chosen theme
function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark");
    } else {
        body.classList.remove("dark");
    }
}

// apply the theme saved in the local storage
let storedTheme = localStorage.getItem("theme");
if (storedTheme) {
    applyTheme(storedTheme);
}
// use default theme of the system
else {
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
}

// theme toggle button functionality
themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
});

// navigation button
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "login.html";
});
document.getElementById("signup-btn").addEventListener("click", () => {
    window.location.href = "signup.html";
});

document.getElementById("get-started").addEventListener("click", () => {
    window.location.href = "app.html";
});
