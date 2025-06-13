const API_URL = "https://quick-notes-backend-one.vercel.app/api";
let token = "";
let currentEditingNoteId = null;

// Link event listeners
document
  .getElementById("register-link")
  ?.addEventListener("click", showRegisterForm);
document.getElementById("login-link")?.addEventListener("click", showLoginForm);
document
  .getElementById("forgot-password-link")
  ?.addEventListener("click", showForgotPassword);
document
  .getElementById("back-to-login")
  ?.addEventListener("click", showLoginForm);

function toggleSections(show) {
  document.getElementById("login-section").classList.toggle("d-none", show);
  document.getElementById("register-section").classList.add("d-none");
  document.getElementById("forgot-section").classList.add("d-none");
  document.getElementById("notes-section").classList.toggle("d-none", !show);
}

function showLoginForm(e) {
  if (e) e.preventDefault();
  document.getElementById("login-section").classList.remove("d-none");
  document.getElementById("register-section").classList.add("d-none");
  document.getElementById("forgot-section").classList.add("d-none");
}

function showRegisterForm(e) {
  if (e) e.preventDefault();
  document.getElementById("register-section").classList.remove("d-none");
  document.getElementById("login-section").classList.add("d-none");
  document.getElementById("forgot-section").classList.add("d-none");
}

function showForgotPassword(e) {
  if (e) e.preventDefault();
  document.getElementById("forgot-section").classList.remove("d-none");
  document.getElementById("login-section").classList.add("d-none");
  document.getElementById("register-section").classList.add("d-none");
}

document.addEventListener("DOMContentLoaded", async function () {
  // Get references to the container
  const formsContainer = document.getElementById("forms-container");

  // Start the injection process
  injectForms(formsContainer);
});



function logout() {
  token = "";
  currentEditingNoteId = null;
  toggleSections(false);
  Swal.fire("Logged out", "", "info");
}

