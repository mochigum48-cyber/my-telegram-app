// ===== User Profile =====

const STORAGE_KEY = 'readers_odyssey_user';

// ===== Default User Data =====
function getDefaultUser() {
    const tgUser = window.getTelegramUser ? window.getTelegramUser() : null;
    return {
        id: tgUser?.id || 'guest_' + Date.now(),
        username: tgUser?.username || 'Guest',
        firstName: tgUser?.first_name || 'Reader',
        lastName: tgUser?.last_name || '',
        downloads: [],
        favorites: [],
        stats: {
            totalDownloads: 0,
            totalFavorites: 0,
            readingStreak: 0,
            booksCompleted: 0,
            totalPagesRead: 0,
            constellationsUnlocked: 0
        },
        joinedDate: new Date().toISOString()
    };
}

// ===== Load/Save =====
function loadUserData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load user data:', e);
    }
    return getDefaultUser();
}

function saveUserData(user) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
        console.warn('Failed to save user data:', e);
    }
}

let currentUser = loadUserData();

// ===== Add Download =====
function addDownload(bookId) {
    const book = window.books?.find(b => b.id === bookId);
    if (!book) return false;

    if (currentUser.downloads.some(d => d.id === bookId)) {
        return false;
    }

    const stage = window.getGrowthStage ? window.getGrowthStage(0) : { status: '🌱' };

    currentUser.downloads.push({
        id: bookId,
        title: book.title,
        author: book.author,
        cover: book.cover,
        fileType: book.fileType,
        downloadedAt: new Date().toISOString(),
        progress: 0,
        status: stage.status || '🌱'
    });

    currentUser.stats.totalDownloads += 1;
    saveUserData(currentUser);
    renderProfile();
    return true;
}

// ===== Toggle Favorite =====
function toggleFavorite(bookId) {
    const index = currentUser.favorites.indexOf(bookId);
    if (index > -1) {
        currentUser.favorites.splice(index, 1);
        currentUser.stats.totalFavorites -= 1;
    } else {
        currentUser.favorites.push(bookId);
        currentUser.stats.totalFavorites += 1;
    }
    saveUserData(currentUser);
    renderProfile();
    return index === -1;
}

// ===== Check Favorite =====
function isFavorite(bookId) {
    return currentUser.favorites.includes(bookId);
}

// ===== Update Progress =====
function updateProgress(bookId, progress) {
    const download = currentUser.downloads.find(d => d.id === bookId);
    if (download) {
        download.progress = Math.min(100, Math.max(0, progress));
        
        // Update status based on progress
        const stage = window.getGrowthStage ? window.getGrowthStage(progress) : { status: '🌱' };
        download.status = stage.status || '🌱';
        
        if (download.progress >= 100) {
            currentUser.stats.booksCompleted += 1;
            currentUser.stats.constellationsUnlocked += 1;
        }
        saveUserData(currentUser);
        renderProfile();
    }
}

// ===== Get Status Icon =====
function getStatusIcon(progress) {
    if (progress >= 100) return '✦';
    if (progress >= 71) return '🌸';
    if (progress >= 31) return '🌿';
    if (progress > 0) return '🌱';
    return '🌰';
}

// ===== Render Profile =====
function renderProfile() {
    const profilePage = document.getElementById('page-profile');
    if (!profilePage) return;

    const user = currentUser;
    const tgUser = window.getTelegramUser ? window.getTelegramUser() : null;

    const stage = window.getGrowthStage ? window.getGrowthStage(
        user.stats.booksCompleted > 0 ? Math.min(100, (user.stats.booksCompleted / 10) * 100) : 0
    ) : { status: '🌱', label: 'Seed' };

    profilePage.innerHTML = `
        <div class="profile-container">
            <!-- Header with Glowing Avatar -->
            <div class="profile-header">
                <div class="profile-avatar ${stage.glow || ''}">
                    <span class="avatar-icon">${tgUser?.photo_url ? '🖼️' : '☽'}</span>
                    <span class="avatar-status">${stage.status || '🌱'}</span>
                </div>
                <div class="profile-name">
                    <h2>${user.firstName} ${user.lastName}</h2>
                    <span class="profile-username">@${user.username || 'reader'}</span>
                    <span class="profile-stage">✦ ${stage.label || 'Seed'} Reader</span>
                </div>
            </div>

            <!-- Stats with Constellation Theme -->
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-number">${user.stats.totalDownloads}</span>
                    <span class="stat-label">📥 Downloads</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${user.stats.totalFavorites}</span>
                    <span class="stat-label">⭐ Favorites</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${user.stats.booksCompleted}</span>
                    <span class="stat-label">🌸 Bloomed</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${user.stats.constellationsUnlocked || 0}</span>
                    <span class="stat-label">✦ Constellations</span>
                </div>
            </div>

            <!-- Constellation Progress -->
            <div class="constellation-progress">
                <div class="constellation-label">
                    <span>✦ Constellation Journey</span>
                    <span>${Math.min(100, Math.round((user.stats.booksCompleted / 10) * 100))}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill constellation" style="width: ${Math.min(100, (user.stats.booksCompleted / 10) * 100)}%"></div>
                </div>
            </div>

            <!-- Downloads Section -->
            <div class="profile-section">
                <h3 class="section-title">📥 My Library</h3>
                ${user.downloads.length === 0 ? `
                    <div class="empty-state">
                        <span class="empty-icon">🌱</span>
                        <p>No seeds planted yet. Start reading!</p>
                    </div>
                ` : `
                    <div class="download-list">
                        ${user.downloads.map(d => {
                            const stage = window.getGrowthStage ? window.getGrowthStage(d.progress || 0) : { status: '🌱', cssClass: 'seed' };
                            return `
                                <div class="download-item" onclick="window.openBook && window.openBook('${d.id}')">
                                    <span class="download-cover">${d.cover || '📖'}</span>
                                    <div class="download-info">
                                        <div class="download-title">${d.title}</div>
                                        <div class="download-author">${d.author}</div>
                                        <div class="download-meta">
                                            <span>${d.fileType || 'PDF'}</span>
                                            <span>•</span>
                                            <span>${new Date(d.downloadedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div class="book-progress">
                                            <div class="progress-bar">
                                                <div class="progress-fill ${stage.cssClass || ''}" style="width: ${d.progress || 0}%"></div>
                                            </div>
                                            <span class="progress-label ${stage.cssClass || ''}">${d.progress || 0}%</span>
                                            <span class="book-status">${d.status || '🌱'}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>

            <!-- Favorites Section -->
            <div class="profile-section">
                <h3 class="section-title">⭐ Favorites</h3>
                ${user.favorites.length === 0 ? `
                    <div class="empty-state">
                        <span class="empty-icon">✧</span>
                        <p>No stars collected yet. Save your beloved books!</p>
                    </div>
                ` : `
                    <div class="favorite-grid">
                        ${user.favorites.map(id => {
                            const book = window.books?.find(b => b.id === id);
                            return book ? `
                                <div class="favorite-card" onclick="window.openBook && window.openBook('${book.id}')">
                                    <span class="fav-cover">${book.cover || '📖'}</span>
                                    <div class="fav-title">${book.title}</div>
                                    <div class="fav-author">${book.author}</div>
                                </div>
                            ` : '';
                        }).join('')}
                    </div>
                `}
            </div>

            <!-- Footer -->
            <div class="profile-footer">
                <span class="footer-text">✦ Reader's Odyssey</span>
                <span class="footer-version">v1.0</span>
            </div>
        </div>
    `;
}

// ===== Toast =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }, 100);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
    renderProfile();

    const profileNav = document.querySelector('.nav-item[data-page="profile"]');
    if (profileNav) {
        profileNav.addEventListener('click', function() {
            setTimeout(renderProfile, 100);
        });
    }
});

// ===== Exports =====
window.addDownload = addDownload;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.updateProgress = updateProgress;
window.renderProfile = renderProfile;
window.showToast = showToast;
window.currentUser = currentUser;
