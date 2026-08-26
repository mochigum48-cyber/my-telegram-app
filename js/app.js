// ===== Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = {
        home: document.getElementById('page-home'),
        explore: document.getElementById('page-explore'),
        library: document.getElementById('page-library'),
        profile: document.getElementById('page-profile')
    };

    // Navigation Click
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.dataset.page;

            // Nav active state
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');

            // Page switching
            Object.keys(pages).forEach(key => {
                if (pages[key]) {
                    pages[key].classList.remove('active');
                }
            });

            const targetPage = pages[pageId];
            if (targetPage) {
                targetPage.classList.add('active');
                hapticLight();
            }
        });
    });

    // ===== Search =====
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchBooks(this.value);
        });
    }

    // ===== Category Chips =====
    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const cat = this.dataset.cat;
            filterByCategory(cat);
            hapticLight();
        });
    });

    // ===== Render Initial Books =====
    renderBooks(books);

    // ===== Telegram Back Button =====
    // Home page မှာ Back Button ကို hide လုပ်မယ်
    if (document.getElementById('page-home').classList.contains('active')) {
        hideBackButton();
    }

    // Page switching အတွက် Back Button ကို ထိန်းချုပ်မယ်
    const navObserver = new MutationObserver(() => {
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id === 'page-home') {
            hideBackButton();
        } else if (activePage) {
            showBackButton(() => {
                // Home ကိုပြန်သွားမယ်
                document.querySelector('.nav-item[data-page="home"]').click();
                hideBackButton();
            });
        }
    });

    // Page ပြောင်းလဲမှုကို စောင့်ကြည့်မယ်
    document.querySelectorAll('.page').forEach(page => {
        navObserver.observe(page, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
});

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('App error:', e.message);
});

// ===== Network Status =====
window.addEventListener('offline', function() {
    alert('No internet connection. Please check your network.');
});
