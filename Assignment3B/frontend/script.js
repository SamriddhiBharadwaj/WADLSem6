const BASE_URL = "http://localhost:5000/api";

// Helper function to show status messages
function showStatus(msg, isError = false) {
    const status = document.getElementById("status");
    if (!status) return;
    
    status.innerText = msg;
    status.className = `status-msg ${isError ? 'status-error' : 'status-success'}`;
    status.style.display = "block";
    
    setTimeout(() => {
        status.style.display = "none";
    }, 5000);
}

// REGISTER
async function register() {
    const btn = document.getElementById("regBtn");
    const originalText = btn.innerText;
    
    try {
        const genderEl = document.querySelector('input[name="gender"]:checked');
        const user = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            hobbies: document.getElementById("hobbies").value,
            gender: genderEl ? genderEl.value : ""
        };

        // Basic Validation
        if (!user.email || !user.password || !user.name) {
            showStatus("Please fill in all required fields (Name, Email, Password)", true);
            return;
        }

        btn.innerText = "Processing...";
        btn.disabled = true;

        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (res.ok) {
            showStatus("Registration successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            showStatus(data.error || "Registration failed", true);
        }
    } catch (err) {
        showStatus("Connection error. Is the server running?", true);
        console.error(err);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// LOGIN
async function login() {
    const btn = document.getElementById("loginBtn");
    const originalText = btn.innerText;
    
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showStatus("Please enter both email and password", true);
            return;
        }

        btn.innerText = "Authenticating...";
        btn.disabled = true;

        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.user) {
            localStorage.setItem("userId", data.user._id);
            showStatus("Authentication successful!");
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);
        } else {
            showStatus(data.message || "Invalid credentials", true);
        }
    } catch (err) {
        showStatus("Connection error. Is the server running?", true);
        console.error(err);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// LOAD PROFILE
async function loadProfile() {
    const id = localStorage.getItem("userId");

    if (!id) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/user/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        
        const user = await res.json();
        if (!user) throw new Error("User data is empty");

        document.getElementById("name").innerText = user.name || "N/A";
        document.getElementById("phone").innerText = user.phone || "N/A";
        document.getElementById("email").innerText = user.email || "N/A";
        document.getElementById("address").innerText = user.address || "N/A";
        document.getElementById("city").innerText = user.city || "N/A";
        document.getElementById("hobbies").innerText = user.hobbies || "N/A";
        document.getElementById("gender").innerText = user.gender || "N/A";
    } catch (err) {
        showStatus("Error loading profile data", true);
        console.error(err);
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("userId");
    window.location.href = "index.html";
}

// Initialization Logic
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("profile.html")) {
        loadProfile();
    }
});