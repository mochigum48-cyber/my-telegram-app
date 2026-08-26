let selectedCategory = "all";
let sortAscending = false;
let savedBooks = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadSavedBooks() {
  try {
    savedBooks = JSON.parse(
      localStorage.getItem("readers_odyssey_saved") || "[]"
    );
  } catch (error) {
    savedBooks = [];
  }
}

function saveSavedBooks() {
  localStorage.setItem(
    "readers_odyssey_saved",
    JSON.stringify(savedBooks)
  );
}

function getBookState(book) {
  if (book.progress >= 90) {
    return "CONSTELLATION";
  }

  if (book.progress >= 60) {
    return "BLOOMING";
  }

  if (book.progress >= 25) {
    return "SPROUTING";
  }

  return "SEED";
}

function createBookCard(book) {
  const saved = savedBooks.includes(book.id);
  const state = getBookState(book);

  return `
    <article class="book-card">
      <div class="book-cover">
        <img
          src="${escapeHtml(book.cover)}"
          alt="${escapeHtml(book.title)}"
          loading="lazy"
          onerror="this.src='assets/covers/seed-01.svg'"
        >
      </div>

      <button
        class="save-button"
        type="button"
        onclick="toggleSave('${book.id}')"
        aria-label="Save ${escapeHtml(book.title)}"
      >
        ${saved ? "♥" : "♡"}
      </button>

      <div class="book-info">
        <p class="book-state">${state}</p>

        <h3>
          ${escapeHtml(book.title)}
        </h3>

        <div class="book-author">
          ${escapeHtml(book.author)}
        </div>

        <div class="book-meta">
          <span class="book-pill">
            ${escapeHtml(book.category)}
          </span>

          <span class="book-pill">
            ${escapeHtml(book.format)}
          </span>

          <span class="book-pill">
            ★ ${escapeHtml(book.rating)}
          </span>
        </div>

        <div class="book-progress">
          <span style="width: ${book.progress}%"></span>
        </div>

        <div class="book-actions">
          <button
            class="secondary-button"
            type="button"
            onclick="previewBook('${book.id}')"
          >
            Preview
          </button>

          <button
            class="download-button"
            type="button"
            onclick="downloadBook('${book.id}')"
          >
            Read
          </button>
        </div>
      </div>

      ${
        book.featured
          ? '<span class="book-badge">FEATURED</span>'
          : ""
      }
    </article>
  `;
}

function renderBookSections(list) {
  const featuredElement =
    document.getElementById("featuredBooks");

  const popularElement =
    document.getElementById("popularBooks");

  const recentElement =
    document.getElementById("recentBooks");

  const emptyElement =
    document.getElementById("emptyState");

  const featured = list.filter(book => book.featured);
  const popular = list.filter(book => book.popular);
  const recent = list.filter(book => book.recent);

  featuredElement.innerHTML = featured
    .map(createBookCard)
    .join("");

  popularElement.innerHTML = popular
    .map(createBookCard)
    .join("");

  recentElement.innerHTML = recent
    .map(createBookCard)
    .join("");

  emptyElement.hidden = list.length !== 0;
}

function getFilteredBooks() {
  const input =
    document.getElementById("searchInput");

  const query = input.value.trim().toLowerCase();

  let result = books.filter(book => {
    const searchableText = [
      book.title,
      book.titleEn,
      book.author,
      book.category
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      !query || searchableText.includes(query);

    const matchesCategory =
      selectedCategory === "all" ||
      book.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  if (sortAscending) {
    result.sort((first, second) =>
      first.title.localeCompare(second.title)
    );
  }

  return result;
}

function applyFilters() {
  const result = getFilteredBooks();

  renderBookSections(result);

  const resultText =
    document.getElementById("resultText");

  if (resultText) {
    resultText.textContent =
      `${result.length} stories found`;
  }
}

function selectCategory(category, button) {
  selectedCategory = category;

  document
    .querySelectorAll(".category-chip")
    .forEach(item => {
      item.classList.remove("active");
    });

  button.classList.add("active");

  applyFilters();
}

function resetCategoryButtons() {
  document
    .querySelectorAll(".category-chip")
    .forEach(item => {
      item.classList.remove("active");
    });

  document
    .querySelector('[data-category="all"]')
    ?.classList.add("active");
}

function sortBooks() {
  sortAscending = !sortAscending;
  applyFilters();

  showMessage(
    sortAscending
      ? "Stories sorted from A to Z"
      : "Original order restored"
  );
}

function toggleSave(bookId) {
  if (savedBooks.includes(bookId)) {
    savedBooks = savedBooks.filter(id => id !== bookId);
    showMessage("Removed from your garden");
  } else {
    savedBooks.push(bookId);
    showMessage("Added to your garden");
  }

  saveSavedBooks();
  updateSavedCount();
  applyFilters();
}

function updateSavedCount() {
  const savedCount =
    document.getElementById("savedCount");

  if (savedCount) {
    savedCount.textContent = savedBooks.length;
  }
}

function previewBook(bookId) {
  const book = books.find(item => item.id === bookId);

  if (!book) {
    return;
  }

  const state = getBookState(book);

  document.getElementById("modalBody").innerHTML = `
    <div class="modal-book">
      <div class="modal-cover">
        <img
          src="${escapeHtml(book.cover)}"
          alt="${escapeHtml(book.title)}"
          onerror="this.src='assets/covers/seed-01.svg'"
        >
      </div>

      <div class="modal-info">
        <p class="book-state">${state}</p>

        <h2>
          ${escapeHtml(book.title)}
        </h2>

        <p>
          by ${escapeHtml(book.author)}
        </p>

        <p>
          ${escapeHtml(book.category)}
          · ${escapeHtml(book.format)}
        </p>

        <p>
          ${escapeHtml(book.pages)} pages
          · ${escapeHtml(book.size)}
        </p>

        <p>
          ★ ${escapeHtml(book.rating)}
        </p>
      </div>
    </div>

    <p class="modal-description">
      ${escapeHtml(book.description)}
    </p>

    <div class="modal-actions">
      <button
        class="secondary-button"
        type="button"
        onclick="toggleSave('${book.id}'); closeBookModal();"
      >
        ${savedBooks.includes(book.id)
          ? "♥ Saved"
          : "♡ Save"}
      </button>

      <button
        class="download-button"
        type="button"
        onclick="downloadBook('${book.id}')"
      >
        Read story
      </button>
    </div>
  `;

  document.getElementById("bookModal").hidden = false;

  if (window.tg?.BackButton) {
    window.tg.BackButton.show();
    window.tg.BackButton.onClick(closeBookModal);
  }
}

function closeBookModal() {
  document.getElementById("bookModal").hidden = true;

  if (window.tg?.BackButton) {
    window.tg.BackButton.hide();
  }
}

function downloadBook(bookId) {
  const book = books.find(item => item.id === bookId);

  if (!book) {
    return;
  }

  /*
    အခုအဆင့်မှာ Fake message ပဲပြပါမယ်။

    နောက်ပိုင်း API ချိတ်တဲ့အခါ ဒီ function ကို—

    fetch("https://your-api-domain.com/api/books/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `tma ${window.tg?.initData || ""}`
      },
      body: JSON.stringify({
        book_id: bookId
      })
    })

    ပုံစံနဲ့ ပြောင်းနိုင်ပါတယ်။
  */

  showMessage(
    `${book.title}
` +
    "နောက်ပိုင်း Telegram Bot နှင့်ချိတ်ပြီး ဖတ်ရှုနိုင်ပါမယ်"
  );
}

function clearSearch() {
  const input =
    document.getElementById("searchInput");

  input.value = "";
  selectedCategory = "all";
  sortAscending = false;

  resetCategoryButtons();
  applyFilters();
  updateClearButton();
}

function updateClearButton() {
  const input =
    document.getElementById("searchInput");

  const clearButton =
    document.getElementById("clearSearch");

  clearButton.classList.toggle(
    "visible",
    input.value.length > 0
  );
}

function initializeBooks() {
  loadSavedBooks();
  updateSavedCount();
  renderBookSections(books);
}