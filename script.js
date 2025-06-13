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

document.addEventListener("DOMContentLoaded", handleForm);

function toggleSections(show) {
  document.getElementById("login-section").classList.toggle("d-none", show);
  document.getElementById("register-section").classList.add("d-none");
  document.getElementById("forgot-section").classList.add("d-none");
  document.getElementById("notes-section").classList.toggle("d-none", !show);
}

function logout() {
  token = "";
  currentEditingNoteId = null;
  toggleSections(false);
  Swal.fire("Logged out", "", "info");
}
