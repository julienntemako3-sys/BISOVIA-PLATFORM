
/* =========================================================
   BISOVIA — CORE ORCHESTRATOR
   File: frontend/core/core.js
   ========================================================= */

(function () {
  "use strict";

  const BISOVIA_CORE_VERSION = "1.0.0";

  function isFunction(value) {
    return typeof value === "function";
  }

  function initializeTranslation() {
    if (
      window.BISOVIA_TRANSLATION &&
      isFunction(
        window.BISOVIA_TRANSLATION.translatePage
      )
    ) {
      const language =
        window.BISOVIA_TRANSLATION.getLanguage();

      window.BISOVIA_TRANSLATION.translatePage(
        language
      );

      return true;
    }

    return false;
  }

  function initializeTheme() {
    if (
      window.BISOVIA_THEME &&
      isFunction(
        window.BISOVIA_THEME.applyTheme
      )
    ) {
      const theme =
        window.BISOVIA_THEME.getSavedTheme();

      window.BISOVIA_THEME.applyTheme(theme);

      return true;
    }

    return false;
  }

  function initializeGlobal() {
    if (
      window.BISOVIA_GLOBAL &&
      isFunction(
        window.BISOVIA_GLOBAL.initialize
      )
    ) {
      window.BISOVIA_GLOBAL.initialize();

      return true;
    }

    return false;
  }

  function updateCurrentYear() {
    const currentYear =
      new Date().getFullYear();

    document
      .querySelectorAll("[data-current-year]")
      .forEach(function (element) {
        element.textContent =
          currentYear;
      });
  }

  function initializeCore() {
    /*
     * Translation
     */
    initializeTranslation();

    /*
     * Theme
     */
    initializeTheme();

    /*
     * Global UI
     */
    initializeGlobal();

    /*
     * Footer year
     */
    updateCurrentYear();

    /*
     * Core ready event
     */
    document.dispatchEvent(
      new CustomEvent(
        "bisovia:coreReady",
        {
          detail: {
            version:
              BISOVIA_CORE_VERSION
          }
        }
      )
    );

    window.BISOVIA_CORE_READY = true;
  }

  /*
   * Public BISOVIA Core API
   */
  window.BISOVIA_CORE = {
    version:
      BISOVIA_CORE_VERSION,

    initialize:
      initializeCore,

    translation:
      function () {
        return window.BISOVIA_TRANSLATION || null;
      },

    theme:
      function () {
        return window.BISOVIA_THEME || null;
      },

    global:
      function () {
        return window.BISOVIA_GLOBAL || null;
      },

    isReady:
      function () {
        return (
          window.BISOVIA_CORE_READY === true
        );
      }
  };

  /*
   * Start Core
   */
  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeCore,
      { once: true }
    );
  } else {
    initializeCore();
  }

})();
