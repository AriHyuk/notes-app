async function handleForm(e) {
  // Get references to the container
  const formsContainer = document.getElementById("forms-container");
  // Start the injection process
  injectForms(formsContainer);
}

// Handle form submissions
async function handleLogin(e) {
  e.preventDefault();
  // This function already exists in your code

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.status === "success") {
      token = data.data.token;
      Swal.fire("Login successful!", "", "success");
      toggleSections(true);
      fetchNotes();
    } else {
      Swal.fire("Login failed", data.message || "Invalid credentials", "error");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
  // The existing login form handler will be attached after forms are injected
}

async function handleRegister(e) {
  e.preventDefault();
  // This function already exists in your code

  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (data.status === "success") {
      Swal.fire("Registration successful!", "", "success");
      showLoginForm();
    } else {
      Swal.fire("Failed", data.message || "Registration failed", "error");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
  // The existing register form handler will be attached after forms are injected
}

async function handleForgot(e) {
  e.preventDefault();
  // This function already exists in your code
  const username = document.getElementById("forgot-username").value;
  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (data.status === "success") {
      Swal.fire("Check your email for reset instructions.", "", "info");
      showLoginForm();
    } else {
      Swal.fire("Error", data.message || "Failed to send email", "error");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
  // The existing forgot password form handler will be attached after forms are injected
}

// Load all form templates and inject them
async function injectForms(formsContainer) {
  try {
    const loginForm = await loadFormTemplate("form/login.html");
    const registerForm = await loadFormTemplate("form/register.html");
    const forgotPasswordForm = await loadFormTemplate("form/forgot.html");

    formsContainer.innerHTML = loginForm + registerForm + forgotPasswordForm;

    // Reconnect event listeners after forms are loaded
    document
      .getElementById("register-link")
      ?.addEventListener("click", showRegisterForm);
    document
      .getElementById("login-link")
      ?.addEventListener("click", showLoginForm);
    document
      .getElementById("forgot-password-link")
      ?.addEventListener("click", showForgotPassword);
    document
      .getElementById("back-to-login")
      ?.addEventListener("click", showLoginForm);

    // Setup form submit handlers
    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin);
    document
      .getElementById("register-form")
      ?.addEventListener("submit", handleRegister);
    document
      .getElementById("forgot-form")
      ?.addEventListener("submit", handleForgot);

    // Check if user is already logged in
    if (localStorage.getItem("authToken")) {
      token = localStorage.getItem("authToken");
      toggleSections(true);
      fetchNotes();
    } else {
      // Show login form by default
      showLoginForm();
    }
  } catch (error) {
    console.error("Error injecting forms:", error);
    formsContainer.innerHTML = `<div class="alert alert-danger">
         Failed to load authentication forms. Please refresh the page.
       </div>`;
  }
}

// Load HTML form templates
async function loadFormTemplate(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(`Failed to load ${path}: Status ${response.status}`);
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`Error loading form template ${path}:`, error);
    return "";
  }
}
