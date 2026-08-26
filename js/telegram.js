window.tg = window.Telegram?.WebApp || null;

function applyTelegramTheme() {
  if (!window.tg) {
    return;
  }

  const theme =
    window.tg.themeParams || {};

  const root =
    document.documentElement;

  const themeMap = {
    bg_color: "--bg",
    secondary_bg_color: "--surface",
    text_color: "--text",
    hint_color: "--muted",
    link_color: "--blue",
    button_color: "--gold"
  };

  Object.entries(themeMap).forEach(
    ([telegramKey, cssVariable]) => {
      if (theme[telegramKey]) {
        root.style.setProperty(
          cssVariable,
          theme[telegramKey]
        );
      }
    }
  );

  if (window.tg.colorScheme === "light") {
    document.body.classList.add("light");
  }

  if (window.tg.colorScheme === "dark") {
    document.body.classList.remove("light");
  }

  window.tg.setHeaderColor?.(
    theme.header_bg_color ||
    theme.bg_color ||
    "#0A0C1F"
  );

  window.tg.setBackgroundColor?.(
    theme.bg_color ||
    "#0A0C1F"
  );
}

function initializeTelegram() {
  if (!window.tg) {
    return;
  }

  window.tg.ready();
  window.tg.expand();

  applyTelegramTheme();

  window.tg.onEvent(
    "themeChanged",
    applyTelegramTheme
  );
}