
/* =========================================================
   BISOVIA — GLOBAL TRANSLATION SYSTEM
   File: frontend/core/translation.js
   ========================================================= */

(function () {
  "use strict";

  const BISOVIA_LANGUAGE_KEY = "bisovia_language";

  const SUPPORTED_LANGUAGES = ["en", "fr", "rn", "sw"];

  const DEFAULT_LANGUAGE = "en";

  /*
   * Get the language saved by the user.
   * If nothing is saved, use English.
   */
  function getSavedLanguage() {
    const savedLanguage = localStorage.getItem(BISOVIA_LANGUAGE_KEY);

    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    return DEFAULT_LANGUAGE;
  }

  /*
   * Save the selected language.
   */
  function saveLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      language = DEFAULT_LANGUAGE;
    }

    localStorage.setItem(BISOVIA_LANGUAGE_KEY, language);
  }

  /*
   * Get the translation dictionary currently loaded.
   */
  function getDictionary(language) {
    if (
      window.BISOVIA_TRANSLATIONS &&
      window.BISOVIA_TRANSLATIONS[language]
    ) {
      return window.BISOVIA_TRANSLATIONS[language];
    }

    return {};
  }

  /*
   * Read a nested translation key.
   *
   * Example:
   * t("nav.home")
   * t("hero.title")
   */
  function getTranslation(key, language) {
    const dictionary = getDictionary(language);

    if (!key) {
      return "";
    }

    const parts = key.split(".");
    let value = dictionary;

    for (const part of parts) {
      if (
        value &&
        Object.prototype.hasOwnProperty.call(value, part)
      ) {
        value = value[part];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  /*
   * Translate every element containing:
   *
   * data-i18n="nav.home"
   */
  function translatePage(language) {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translatedText = getTranslation(key, language);

      element.textContent = translatedText;
    });

    /*
     * Translate placeholders:
     *
     * data-i18n-placeholder="search.placeholder"
     */
    const placeholderElements =
      document.querySelectorAll("[data-i18n-placeholder]");

    placeholderElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translatedText = getTranslation(key, language);

      element.setAttribute("placeholder", translatedText);
    });

    /*
     * Translate titles:
     *
     * data-i18n-title="buttons.submit"
     */
    const titleElements =
      document.querySelectorAll("[data-i18n-title]");

    titleElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-title");
      const translatedText = getTranslation(key, language);

      element.setAttribute("title", translatedText);
    });

    /*
     * Translate aria-labels:
     *
     * data-i18n-aria-label="nav.menu"
     */
    const ariaElements =
      document.querySelectorAll("[data-i18n-aria-label]");

    ariaElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-aria-label");
      const translatedText = getTranslation(key, language);

      element.setAttribute("aria-label", translatedText);
    });

    /*
     * Update the HTML language attribute.
     */
    document.documentElement.setAttribute("lang", language);

    /*
     * Update every language selector on the page.
     */
    const languageSelectors =
      document.querySelectorAll(
        "[data-language-selector], #languageSelector, #language-select"
      );

    languageSelectors.forEach((selector) => {
      selector.value = language;
    });

    /*
     * Optional page event.
     */
    document.dispatchEvent(
      new CustomEvent("bisovia:languageChanged", {
        detail: {
          language: language
        }
      })
    );
  }

  /*
   * Change the global BISOVIA language.
   */
  function setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      console.warn(
        "BISOVIA: Unsupported language:",
        language
      );

      language = DEFAULT_LANGUAGE;
    }

    saveLanguage(language);

    /*
     * If translations are already available,
     * translate immediately.
     */
    translatePage(language);

    /*
     * Keep the language available globally.
     */
    window.BISOVIA_CURRENT_LANGUAGE = language;

    return language;
  }

  /*
   * Get the current BISOVIA language.
   */
  function getLanguage() {
    return (
      window.BISOVIA_CURRENT_LANGUAGE ||
      getSavedLanguage()
    );
  }

  /*
   * Initialize translation system.
   */
  function initializeTranslation() {
    const language = getSavedLanguage();

    window.BISOVIA_CURRENT_LANGUAGE = language;

    /*
     * Wait until the DOM is ready.
     */
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        function () {
          translatePage(language);
        },
        { once: true }
      );
    } else {
      translatePage(language);
    }

    /*
     * Connect every language selector.
     */
    document.addEventListener(
      "change",
      function (event) {
        const target = event.target;

        if (
          target.matches(
            "[data-language-selector], #languageSelector, #language-select"
          )
        ) {
          setLanguage(target.value);
        }
      }
    );
  }

  /*
   * Public BISOVIA translation API.
   */
  window.BISOVIA_TRANSLATION = {
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    getTranslation: getTranslation,
    translatePage: translatePage,
    saveLanguage: saveLanguage,
    getSavedLanguage: getSavedLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  /*
   * Start the system.
   */
  initializeTranslation();

})();
