// ===== Telegram Web App =====
const tg = window.Telegram.WebApp;

// App ကို အသင့်ဖြစ်ကြောင်း အကြောင်းကြားခြင်း
tg.ready();
tg.expand(); // Full screen

// User Data ယူခြင်း
function getTelegramUser() {
    return tg.initDataUnsafe?.user || null;
}

// Theme ကို လိုက်လုပ်ခြင်း (Dark/Light)
function applyTelegramTheme() {
    const colorScheme = tg.colorScheme || 'dark';
    if (colorScheme === 'dark') {
        document.documentElement.style.setProperty('--bg-deep', '#0A0C1F');
    } else {
        // Light mode အတွက် (optional)
        document.documentElement.style.setProperty('--bg-deep', '#F5F1E6');
        document.documentElement.style.setProperty('--text-primary', '#0A0C1F');
    }
}
applyTelegramTheme();

// Haptic Feedback
function hapticLight() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function hapticSuccess() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// Main Button ကို ထိန်းချုပ်ခြင်း
function showMainButton(text, callback) {
    tg.MainButton.setText(text);
    tg.MainButton.show();
    tg.MainButton.onClick(callback);
}

function hideMainButton() {
    tg.MainButton.hide();
}

// Back Button
function showBackButton(callback) {
    tg.BackButton.show();
    tg.BackButton.onClick(callback);
}

function hideBackButton() {
    tg.BackButton.hide();
}

// ===== Ad Complete → Bot ကို အကြောင်းကြားခြင်း =====
function notifyBotAdCompleted(bookId) {
    const user = getTelegramUser();
    if (!user) {
        console.warn('No Telegram user');
        return;
    }

    // ခင်ဗျားရဲ့ Bot API Endpoint ကို ထည့်ပါ
    const BOT_API_URL = 'https://your-bot-api.com/ad-complete';

    fetch(BOT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            username: user.username || 'anonymous',
            book_id: bookId,
            action: 'ad_watched'
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.download_url) {
            // Download Link ကို ဖွင့်မယ်
            window.location.href = data.download_url;
            hapticSuccess();
        } else {
            console.warn('No download URL received');
        }
    })
    .catch(err => {
        console.error('Error notifying bot:', err);
    });
}
