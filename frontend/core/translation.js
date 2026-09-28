(function () {
  "use strict";

  window.BISOVIA = window.BISOVIA || {};

  const STORAGE_KEY =
    (BISOVIA.config && BISOVIA.config.languageStorageKey) ||
    "bisovia-language";

  const DEFAULT_LANGUAGE =
    (BISOVIA.config && BISOVIA.config.defaultLanguage) || "en";

  const SUPPORTED =
    (BISOVIA.config && BISOVIA.config.supportedLanguages) ||
    ["en", "fr", "rn", "sw"];

  function getDictionary(language) {
    if (
      window.BISOVIA_LANGUAGES &&
      window.BISOVIA_LANGUAGES[language]
    ) {
      return window.BISOVIA_LANGUAGES[language];
    }

    return {};
  }

  function getValue(dictionary, key) {
    return key.split(".").reduce(function (current, part) {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        return current[part];
      }

      return undefined;
    }, dictionary);
  }

  function translateElement(element, dictionary) {
    const key = element.getAttribute("data-i18n");

    if (key) {
      const value = getValue(dictionary, key);

      if (value !== undefined) {
        element.textContent = value;
      }
    }

    const placeholderKey = element.getAttribute("data-i18n-placeholder");

    if (placeholderKey) {
      const value = getValue(dictionary, placeholderKey);

      if (value !== undefined) {
        element.setAttribute("placeholder", value);
      }
    }

    const titleKey = element.getAttribute("data-i18n-title");

    if (titleKey) {
      const value = getValue(dictionary, titleKey);

      if (value !== undefined) {
        element.setAttribute("title", value);
      }
    }

    const ariaKey = element.getAttribute("data-i18n-aria");

    if (ariaKey) {
      const value = getValue(dictionary, ariaKey);

      if (value !== undefined) {
        element.setAttribute("aria-label", value);
      }
    }
  }

  function applyLanguage(language) {
    if (!SUPPORTED.includes(language)) {
      language = DEFAULT_LANGUAGE;
    }

    const dictionary = getDictionary(language);

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      translateElement(element, dictionary);
    });

    document
      .querySelectorAll("[data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]")
      .forEach(function (element) {
        translateElement(element, dictionary);
      });

    document.querySelectorAll("[data-language]").forEach(function (element) {
      element.classList.toggle(
        "active",
        element.getAttribute("data-language") === language
      );
    });

    localStorage.setItem(STORAGE_KEY, language);

    BISOVIA.currentLanguage = language;

    window.dispatchEvent(
      new CustomEvent("bisovia:languageChanged", {
        detail: { language: language }
      })
    );
  }

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && SUPPORTED.includes(saved)) {
      return saved;
    }

    return DEFAULT_LANGUAGE;
  }

  BISOVIA.translation = {
    init: function () {
      applyLanguage(getLanguage());

      document.querySelectorAll("[data-language]").forEach(function (button) {
        button.addEventListener("click", function () {
          const language = button.getAttribute("data-language");
          applyLanguage(language);
        });
      });
    },

    setLanguage: applyLanguage,

    getLanguage: getLanguage
  };

  BISOVIA.ready(function () {
    BISOVIA.translation.init();
  });
})();
