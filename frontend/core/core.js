/* =========================================================
   BISOVIA CORE
   Global integration layer
   ========================================================= */

(function () {
  "use strict";

  const BISOVIA = {
    name: "BISOVIA",
    version: "1.0.0",
    initialized: false,

    config: {
      languages: ["en", "fr", "rn", "sw"],
      defaultLanguage: "en",
      themeKey: "bisovia-theme",
      languageKey: "bisovia-language"
    },

    state: {
      language: "en",
      theme: "light",
      piReady: false,
      user: null
    }
  };

  /* =========================================================
     STORAGE
     ========================================================= */

  function loadState() {
    const savedLanguage =
      localStorage.getItem(BISOVIA.config.languageKey);

    const savedTheme =
      localStorage.getItem(BISOVIA.config.themeKey);

    if (
      savedLanguage &&
      BISOVIA.config.languages.includes(savedLanguage)
    ) {
      BISOVIA.state.language = savedLanguage;
    }

    if (savedTheme === "dark" || savedTheme === "light") {
      BISOVIA.state.theme = savedTheme;
    }
  }

  /* =========================================================
     THEME
     ========================================================= */

  function applyTheme(theme) {
    if (theme !== "dark" && theme !== "light") {
      theme = "light";
    }

    BISOVIA.state.theme = theme;

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.classList.toggle(
      "dark-mode",
      theme === "dark"
    );

    document.body.classList.toggle(
      "light-mode",
      theme === "light"
    );

    localStorage.setItem(
      BISOVIA.config.themeKey,
      theme
    );

    updateThemeButtons();
  }

  function toggleTheme() {
    const nextTheme =
      BISOVIA.state.theme === "dark"
        ? "light"
        : "dark";

    applyTheme(nextTheme);
  }

  function updateThemeButtons() {
    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach((button) => {
        button.setAttribute(
          "aria-label",
          BISOVIA.state.theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        );
      });
  }

  /* =========================================================
     LANGUAGE
     ========================================================= */

  function setLanguage(language) {
    if (!BISOVIA.config.languages.includes(language)) {
      console.warn(
        "BISOVIA: unsupported language:",
        language
      );
      return;
    }

    BISOVIA.state.language = language;

    localStorage.setItem(
      BISOVIA.config.languageKey,
      language
    );

    document.documentElement.setAttribute(
      "lang",
      language
    );

    document.dispatchEvent(
      new CustomEvent("bisovia:languageChanged", {
        detail: {
          language: language
        }
      })
    );

    updateLanguageButtons();

    /*
     * If the project's translation system exists,
     * allow it to handle the page translation.
     */
    if (
      typeof window.BISOVIA_TRANSLATE === "function"
    ) {
      window.BISOVIA_TRANSLATE(language);
    }
  }

  function updateLanguageButtons() {
    document
      .querySelectorAll("[data-language]")
      .forEach((element) => {
        const language =
          element.getAttribute("data-language");

        element.classList.toggle(
          "active",
          language === BISOVIA.state.language
        );

        element.setAttribute(
          "aria-current",
          language === BISOVIA.state.language
            ? "true"
            : "false"
        );
      });
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function setupNavigation() {
    document
      .querySelectorAll("[data-nav]")
      .forEach((element) => {
        element.addEventListener("click", function () {
          const target =
            element.getAttribute("data-nav");

          if (target) {
            window.location.href = target;
          }
        });
      });
  }

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function setupMobileMenu() {
    const toggle =
      document.querySelector("[data-mobile-menu]");

    const menu =
      document.querySelector("[data-mobile-nav]");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", function () {
      const opened =
        menu.classList.toggle("open");

      toggle.setAttribute(
        "aria-expanded",
        opened ? "true" : "false"
      );
    });

    menu
      .querySelectorAll("a")
      .forEach((link) => {
        link.addEventListener("click", function () {
          menu.classList.remove("open");

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );
        });
      });
  }

  /* =========================================================
     PI SDK
     ========================================================= */

  function setupPi() {
    if (typeof window.Pi === "undefined") {
      console.info(
        "BISOVIA: Pi SDK is not available on this page."
      );
      return;
    }

    try {
      window.Pi.init({
        version: "2.0",
        sandbox: true
      });

      BISOVIA.state.piReady = true;

      document.dispatchEvent(
        new CustomEvent("bisovia:piReady")
      );

      updatePiStatus();
    } catch (error) {
      console.error(
        "BISOVIA: Pi initialization failed:",
        error
      );

      BISOVIA.state.piReady = false;
      updatePiStatus();
    }
  }

  function updatePiStatus() {
    document
      .querySelectorAll("[data-pi-status]")
      .forEach((element) => {
        element.textContent =
          BISOVIA.state.piReady
            ? "Pi connection is ready"
            : "Pi connection is unavailable";
      });
  }

  /* =========================================================
     GLOBAL EVENTS
     ========================================================= */

  function setupGlobalEvents() {
    document.addEventListener(
      "click",
      function (event) {
        const themeButton =
          event.target.closest(
            "[data-theme-toggle]"
          );

        if (themeButton) {
          event.preventDefault();
          toggleTheme();
          return;
        }

        const languageButton =
          event.target.closest(
            "[data-language]"
          );

        if (languageButton) {
          event.preventDefault();

          const language =
            languageButton.getAttribute(
              "data-language"
            );

          setLanguage(language);
        }
      }
    );
  }

  /* =========================================================
     FOOTER YEAR
     ========================================================= */

  function setCurrentYear() {
    document
      .querySelectorAll("[data-current-year]")
      .forEach((element) => {
        element.textContent =
          new Date().getFullYear();
      });
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {
    if (BISOVIA.initialized) {
      return;
    }

    loadState();

    applyTheme(BISOVIA.state.theme);

    document.documentElement.setAttribute(
      "lang",
      BISOVIA.state.language
    );

    setupNavigation();
    setupMobileMenu();
    setupGlobalEvents();
    setCurrentYear();
    updateLanguageButtons();

    /*
     * Wait briefly so Pi SDK has a chance to load.
     */
    if (typeof window.Pi !== "undefined") {
      setupPi();
    } else {
      window.addEventListener(
        "load",
        setupPi,
        { once: true }
      );
    }

    BISOVIA.initialized = true;

    document.dispatchEvent(
      new CustomEvent("bisovia:coreReady", {
        detail: BISOVIA
      })
    );

    console.info(
      "BISOVIA Core initialized:",
      BISOVIA.version
    );
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.BISOVIA = BISOVIA;

  window.BISOVIA.setLanguage = setLanguage;
  window.BISOVIA.toggleTheme = toggleTheme;
  window.BISOVIA.applyTheme = applyTheme;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
