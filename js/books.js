// ===== Book Data =====
const books = [
    {
        id: 'book-01',
        title: 'The Hidden Garden',
        author: 'Elena Mistry',
        category: 'mystery',
        cover: '🌿',
        fileType: 'PDF',
        fileSize: '4.2 MB',
        rating: 4.7,
        views: 1240,
        progress: 65,
        status: '🌿',
        description: 'A mysterious garden appears only at midnight...'
    },
    {
        id: 'book-02',
        title: 'Starlight Sonnets',
        author: 'Orion Vega',
        category: 'romance',
        cover: '✧',
        fileType: 'EPUB',
        fileSize: '1.8 MB',
        rating: 4.9,
        views: 840,
        progress: 100,
        status: '✦',
        description: 'Love poems written under the stars...'
    },
    {
        id: 'book-03',
        title: 'The Alchemist\'s Dream',
        author: 'Seraphina Gold',
        category: 'fantasy',
        cover: '✦',
        fileType: 'PDF',
        fileSize: '6.5 MB',
        rating: 4.8,
        views: 2100,
        progress: 30,
        status: '🌱',
        description: 'A quest for the philosopher\'s stone...'
    },
    {
        id: 'book-04',
        title: 'Botanical Wisdom',
        author: 'Dr. Fern Willow',
        category: 'knowledge',
        cover: '🌱',
        fileType: 'PDF',
        fileSize: '3.1 MB',
        rating: 4.5,
        views: 680,
        progress: 80,
        status: '🌸',
        description: 'Ancient plant medicine and healing...'
    },
    {
        id: 'book-05',
        title: 'Echoes of the Past',
        author: 'Marcus Stone',
        category: 'history',
        cover: '◈',
        fileType: 'PDF',
        fileSize: '8.0 MB',
        rating: 4.6,
        views: 920,
        progress: 20,
        status: '🌱',
        description: 'Forgotten civilizations and their secrets...'
    }
];

// ===== Render Books =====
function renderBooks(bookList) {
    const grid = document.getElementById('bookGrid');
    if (!grid) return;

    if (bookList.length === 0) {
        grid.innerHTML = `
            <div class="page-placeholder">
                <span class="placeholder-icon">✧</span>
                <p style="color: var(--text-muted);">No books found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = bookList.map(book => `
        <div class="book-card" data-id="${book.id}" onclick="openBook('${book.id}')">
            <div class="book-cover">${book.cover}</div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-meta">
                    <span>${book.fileType}</span>
                    <span>•</span>
                    <span>${book.fileSize}</span>
                    <span>•</span>
                    <span>⭐ ${book.rating}</span>
                </div>
                <div class="book-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${book.progress}%"></div>
                    </div>
                    <span class="progress-label">${book.progress}%</span>
                    <span class="book-status">${book.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Open Book Detail =====
function openBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    hapticLight();

    // Ad Modal ကိုပြမယ် (Download အတွက်)
    showAdModal(book);
}

// ===== Ad Modal =====
function showAdModal(book) {
    const modal = document.getElementById('adModal');
    if (!modal) return;

    // Modal content ကို update လုပ်မယ်
    const icon = modal.querySelector('.modal-icon');
    const title = modal.querySelector('h3');
    const desc = modal.querySelector('p');
    const watchBtn = document.getElementById('watchAdBtn');

    if (icon) icon.textContent = book.cover || '🌱';
    if (title) title.textContent = `"${book.title}"`;
    if (desc) desc.textContent = `Watch a short ad to download this book`;

    modal.classList.remove('hidden');

    // Watch Ad Button
    if (watchBtn) {
        watchBtn.onclick = function() {
            // Ad ကြည့်ပြီးကြောင်း Bot ကို အကြောင်းကြားမယ်
            notifyBotAdCompleted(book.id);
            hapticSuccess();
            // Modal ကိုပိတ်မယ်
            closeAdModal();
        };
    }
}

// ===== Close Ad Modal =====
function closeAdModal() {
    const modal = document.getElementById('adModal');
    if (modal) modal.classList.add('hidden');
}

// ===== Search =====
function searchBooks(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
        renderBooks(books);
        return;
    }
    const filtered = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
    renderBooks(filtered);
}

// ===== Category Filter =====
function filterByCategory(category) {
    if (category === 'all') {
        renderBooks(books);
        return;
    }
    const filtered = books.filter(b => b.category === category);
    renderBooks(filtered);
}

// ===== Close Modal on outside click =====
document.addEventListener('click', function(e) {
    const modal = document.getElementById('adModal');
    if (!modal) return;
    if (e.target === modal) {
        closeAdModal();
    }
});

// ===== Close Modal with Cancel Button =====
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAdModal);
    }
});}
