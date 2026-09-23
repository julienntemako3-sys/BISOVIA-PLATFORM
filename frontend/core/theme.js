/* =========================================================
   BISOVIA — THEME CORE
   Dark / Light mode
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "bisoviaTheme";

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage errors.
    }
  }

  function applyTheme(theme) {
    const normalizedTheme =
      theme === "dark" ? "dark" : "light";

    document.body.classList.toggle(
      "dark-mode",
      normalizedTheme === "dark"
    );

    document.documentElement.setAttribute(
      "data-theme",
      normalizedTheme
    );

    document.documentElement.classList.toggle(
      "dark",
      normalizedTheme === "dark"
    );

    document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
      icon.textContent =
        normalizedTheme === "dark" ? "☀️" : "🌙";
    });

    document.querySelectorAll("[data-theme-label]").forEach((label) => {
      label.textContent =
        normalizedTheme === "dark"
          ? "Light mode"
          : "Dark mode";
    });
  }

  function toggleTheme() {
    const isDark =
      document.body.classList.contains("dark-mode");

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  function initTheme() {
    const savedTheme = getSavedTheme();

    if (savedTheme) {
      applyTheme(savedTheme);
      return;
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(prefersDark ? "dark" : "light");
  }

  function initThemeControls() {
    const controls = document.querySelectorAll(
      "#themeToggle, .theme-toggle, [data-theme-toggle]"
    );

    controls.forEach((control) => {
      control.addEventListener("click", function (event) {
        event.preventDefault();
        toggleTheme();
      });
    });
  }

  window.BISOVIA = window.BISOVIA || {};

  window.BISOVIA.theme = {
    init: initTheme,
    toggle: toggleTheme,
    apply: applyTheme
  };

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initThemeControls();
  });

})();
