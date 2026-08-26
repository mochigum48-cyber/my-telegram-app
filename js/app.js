function showMessage(message) {
  if (window.tg?.showAlert) {
    window.tg.showAlert(message);
    return;
  }

  const toast =
    document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function goHome(button) {
  setActiveNav(button);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  closeProfile();
}

function goExplore(button) {
  setActiveNav(button);

  const search =
    document.getElementById("searchInput");

  search.focus();

  search.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  closeProfile();
}

function goLibrary(button) {
  setActiveNav(button);

  showMessage(
    "My Library ကို နောက်ပိုင်း API နှင့်ချိတ်ပါမယ်"
  );
}

function goProfile(button) {
  setActiveNav(button);
  openProfile();
}

function setActiveNav(button) {
  document
    .querySelectorAll(".nav-button")
    .forEach(item => {
      item.classList.remove("active");
    });

  button.classList.add("active");
}

function setupSearch() {
  const input =
    document.getElementById("searchInput");

  input.addEventListener("input", () => {
    applyFilters();
    updateClearButton();
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      applyFilters();
    }
  });
}

function setupKeyboardEvents() {
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeBookModal();
      closeProfile();
    }
  });
}

function initializeApp() {
  loadTheme();
  initializeTelegram();
  initializeBooks();
  renderProfile();
  setupSearch();
  setupKeyboardEvents();

  document.getElementById("bookCount").textContent =
    books.length;

  document.getElementById("featuredCount").textContent =
    books.filter(book => book.featured).length;
}

document.addEventListener(
  "DOMContentLoaded",
  initializeApp
);
