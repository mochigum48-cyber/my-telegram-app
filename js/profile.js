const defaultProfile = {
  name: "Reader",
  username: "@reader",
  avatar: "◌",
  readCount: 12
};

function getProfile() {
  if (
    window.tg &&
    window.tg.initDataUnsafe &&
    window.tg.initDataUnsafe.user
  ) {
    const user = window.tg.initDataUnsafe.user;

    const fullName = [
      user.first_name,
      user.last_name
    ]
      .filter(Boolean)
      .join(" ");

    return {
      name: fullName || "Reader",
      username: user.username
        ? `@${user.username}`
        : "@reader",
      avatar: "◌",
      photo: user.photo_url || "",
      readCount: 12
    };
  }

  return defaultProfile;
}

function renderProfile() {
  const profile = getProfile();

  const nameElement =
    document.getElementById("profileName");

  const usernameElement =
    document.getElementById("profileUsername");

  const avatarElement =
    document.getElementById("profileAvatar");

  const readCountElement =
    document.getElementById("readCount");

  nameElement.textContent = profile.name;
  usernameElement.textContent = profile.username;
  readCountElement.textContent = profile.readCount;

  if (profile.photo) {
    avatarElement.style.backgroundImage =
      `url("${profile.photo}")`;

    avatarElement.style.backgroundSize = "cover";
    avatarElement.style.backgroundPosition = "center";
    avatarElement.textContent = "";
  } else {
    avatarElement.textContent = profile.avatar;
  }

  updateSavedCount();
}

function openProfile() {
  const panel =
    document.getElementById("profilePanel");

  panel.hidden = false;

  renderProfile();

  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeProfile() {
  document.getElementById("profilePanel").hidden = true;
}

function toggleTheme() {
  const isLight =
    document.body.classList.toggle("light");

  const themeText =
    document.getElementById("themeText");

  themeText.textContent = isLight ? "OFF" : "ON";

  localStorage.setItem(
    "readers_odyssey_theme",
    isLight ? "light" : "dark"
  );

  showMessage(
    isLight
      ? "Day garden enabled"
      : "Night garden enabled"
  );
}

function loadTheme() {
  const theme =
    localStorage.getItem("readers_odyssey_theme");

  if (theme === "light") {
    document.body.classList.add("light");

    const themeText =
      document.getElementById("themeText");

    if (themeText) {
      themeText.textContent = "OFF";
    }
  }
}