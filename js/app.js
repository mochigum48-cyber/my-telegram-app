// ===== Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = {
        home: document.getElementById('page-home'),
        explore: document.getElementById('page-explore'),
        library: document.getElementById('page-library'),
        profile: document.getElementById('page-profile')
    };

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.dataset.page;

            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');

            Object.keys(pages).forEach(key => {
                if (pages[key]) {
                    pages[key].classList.remove('active');
                }
            });

            const targetPage = pages[pageId];
            if (targetPage) {
                targetPage.classList.add('active');
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                }
            }
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (window.searchBooks) {
                window.searchBooks(this.value);
            }
        });
    }

    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const cat = this.dataset.cat;
            if (window.filterByCategory) {
                window.filterByCategory(cat);
            }
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        });
    });

    // Initial render
    if (window.renderBooks) {
        window.renderBooks(window.books || []);
    }
});
