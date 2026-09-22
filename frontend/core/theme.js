
/* =========================================================
   BISOVIA — GLOBAL THEME SYSTEM
   File: frontend/core/theme.js
   ========================================================= */

(function () {
  "use strict";

  const BISOVIA_THEME_KEY = "bisovia_theme";

  const SUPPORTED_THEMES = ["light", "dark", "system"];
  const DEFAULT_THEME = "system";

  function getSavedTheme() {
    const savedTheme =
      localStorage.getItem(BISOVIA_THEME_KEY);

    if (SUPPORTED_THEMES.includes(savedTheme)) {
      return savedTheme;
    }

    return DEFAULT_THEME;
  }

  function getSystemTheme() {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    return mediaQuery.matches ? "dark" : "light";
  }

  function getEffectiveTheme(theme) {
    if (theme === "system") {
      return getSystemTheme();
    }

    return theme;
  }

  function updateThemeSelectors(theme) {
    document
      .querySelectorAll(
        "[data-theme-selector], #themeSelector, #theme-select"
      )
      .forEach(function (selector) {
        selector.value = theme;
      });
  }

  function updateThemeToggle(theme) {
    const effectiveTheme =
      getEffectiveTheme(theme);

    document
      .querySelectorAll(
        "[data-theme-toggle], #themeToggle"
      )
      .forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          effectiveTheme === "dark"
            ? "true"
            : "false"
        );

        button.setAttribute(
          "aria-label",
          effectiveTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        );

        const icon =
          button.querySelector(
            "[data-theme-icon]"
          );

        if (icon) {
          icon.textContent =
            effectiveTheme === "dark"
              ? "☀️"
              : "🌙";
        }
      });
  }

  function applyTheme(theme) {
    if (!SUPPORTED_THEMES.includes(theme)) {
      theme = DEFAULT_THEME;
    }

    const effectiveTheme =
      getEffectiveTheme(theme);

    document.documentElement.setAttribute(
      "data-theme",
      effectiveTheme
    );

    document.documentElement.classList.remove(
      "light",
      "dark"
    );

    document.documentElement.classList.add(
      effectiveTheme
    );

    document.documentElement.setAttribute(
      "data-theme-preference",
      theme
    );

    localStorage.setItem(
      BISOVIA_THEME_KEY,
      theme
    );

    updateThemeSelectors(theme);
    updateThemeToggle(theme);

    document.dispatchEvent(
      new CustomEvent(
        "bisovia:themeChanged",
        {
          detail: {
            theme: theme,
            effectiveTheme: effectiveTheme
          }
        }
      )
    );

    return effectiveTheme;
  }

  function setTheme(theme) {
    return applyTheme(theme);
  }

  function toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute(
        "data-theme"
      ) || getEffectiveTheme(getSavedTheme());

    const newTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    applyTheme(newTheme);

    return newTheme;
  }

  function initializeThemeSelectors() {
    document
      .querySelectorAll(
        "[data-theme-selector], #themeSelector, #theme-select"
      )
      .forEach(function (selector) {
        selector.addEventListener(
          "change",
          function () {
            setTheme(selector.value);
          }
        );
      });
  }

  function initializeThemeToggles() {
    document
      .querySelectorAll(
        "[data-theme-toggle], #themeToggle"
      )
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            toggleTheme();
          }
        );
      });
  }

  function initializeSystemThemeListener() {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    function handleSystemThemeChange() {
      const savedTheme =
        getSavedTheme();

      if (savedTheme !== "system") {
        return;
      }

      applyTheme("system");
    }

    if (
      typeof mediaQuery.addEventListener ===
