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
