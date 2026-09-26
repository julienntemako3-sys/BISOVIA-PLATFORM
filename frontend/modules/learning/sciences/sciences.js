/* =========================================================
   BISOVIA LEARNING — SCIENCES
   File:
   frontend/modules/learning/categories/sciences/sciences.js

   Purpose:
   - Mobile navigation
   - Theme management
   - Language management
   - Current year
   - Science subject navigation
   - URL parameter support
   - Safe Core integration
   - Frontend only / no database access
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const STORAGE = {
    theme: "bisovia-theme",
    language: "bisovia-language"
  };


  const SUPPORTED_LANGUAGES = [
    "en",
    "fr",
    "rn",
    "sw"
  ];


  /* =======================================================
     DOM HELPERS
     ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));


  /* =======================================================
     YEAR
     ======================================================= */

  function setCurrentYear() {
    const yearElement = $("#currentYear");

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }


  /* =======================================================
     THEME
     ======================================================= */

  function getStoredTheme() {
    const storedTheme = localStorage.getItem(STORAGE.theme);

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }


  function applyTheme(theme) {
    const validTheme =
      theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = validTheme;

    localStorage.setItem(
      STORAGE.theme,
      validTheme
    );

    updateThemeButton(validTheme);
  }


  function updateThemeButton(theme) {
    const button = $("#themeToggle");

    if (!button) return;

    if (theme === "dark") {
      button.textContent = "☀";
      button.setAttribute(
        "aria-label",
        "Switch to light mode"
      );
      button.setAttribute(
        "title",
        "Light mode"
      );
    } else {
      button.textContent = "◐";
      button.setAttribute(
        "aria-label",
        "Switch to dark mode"
      );
      button.setAttribute(
        "title",
        "Dark mode"
      );
    }
  }


  function toggleTheme() {
    const currentTheme =
      document.documentElement.dataset.theme ||
      getStoredTheme();

    applyTheme(
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  }


  /* =======================================================
     LANGUAGE
     ======================================================= */

  function getLanguageFromCore() {
    try {
      if (
        window.BISOVIA &&
        typeof window.BISOVIA.getLanguage === "function"
      ) {
        const language =
          window.BISOVIA.getLanguage();

        if (
          language &&
          SUPPORTED_LANGUAGES.includes(language)
        ) {
          return language;
        }
      }
    } catch (error) {
      console.warn(
        "BISOVIA Core language unavailable:",
        error
      );
    }

    return null;
  }


  function getLanguage() {
    const coreLanguage =
      getLanguageFromCore();

    if (coreLanguage) {
      return coreLanguage;
    }

    const storedLanguage =
      localStorage.getItem(STORAGE.language);

    if (
      storedLanguage &&
      SUPPORTED_LANGUAGES.includes(storedLanguage)
    ) {
      return storedLanguage;
    }

    return "en";
  }


  function setLanguage(language) {
    if (
      !SUPPORTED_LANGUAGES.includes(language)
    ) {
      language = "en";
    }


    localStorage.setItem(
      STORAGE.language,
      language
    );


    try {
      if (
        window.BISOVIA &&
        typeof window.BISOVIA.setLanguage === "function"
      ) {
        window.BISOVIA.setLanguage(language);
      }
    } catch (error) {
      console.warn(
        "BISOVIA Core language update failed:",
        error
      );
    }


    updateLanguageButton(language);

    /*
      The global BISOVIA translation system should handle
      the actual text replacement.

      This page intentionally does not duplicate the
      translation engine.
    */

    document.documentElement.lang = language;

    document.dispatchEvent(
      new CustomEvent(
        "bisovia:languageChanged",
        {
          detail: {
            language
          }
        }
      )
    );
  }


  function updateLanguageButton(language) {
    const button = $("#languageToggle");

    if (!button) return;

    const labels = {
      en: "EN",
      fr: "FR",
      rn: "RN",
      sw: "SW"
    };

    button.textContent =
      labels[language] || "EN";

    button.setAttribute(
      "title",
      "Change language"
    );
  }


  function cycleLanguage() {
    const current =
      getLanguage();

    const index =
      SUPPORTED_LANGUAGES.indexOf(current);

    const nextIndex =
      index === -1
        ? 0
        : (index + 1) %
          SUPPORTED_LANGUAGES.length;

    setLanguage(
      SUPPORTED_LANGUAGES[nextIndex]
    );
  }


  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  function setupMobileNavigation() {
    const menuToggle =
      $("#menuToggle");

    const mainNav =
      $(".main-nav");

    if (!menuToggle || !mainNav) {
      return;
    }


    menuToggle.addEventListener(
      "click",
      function () {

        const isOpen =
          mainNav.classList.toggle("open");

        menuToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

        menuToggle.setAttribute(
          "aria-label",
          isOpen
            ? "Close menu"
            : "Open menu"
        );
      }
    );


    /* Close menu after selecting a link */

    $$(".main-nav a").forEach(
      function (link) {

        link.addEventListener(
          "click",
          function () {

            mainNav.classList.remove(
              "open"
            );

            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

            menuToggle.setAttribute(
              "aria-label",
              "Open menu"
            );
          }
        );
      }
    );


    /* Close menu when clicking outside */

    document.addEventListener(
      "click",
      function (event) {

        if (
          !mainNav.contains(event.target) &&
          !menuToggle.contains(event.target)
        ) {
          mainNav.classList.remove(
            "open"
          );

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Open menu"
          );
        }
      }
    );


    /* Close menu with Escape */

    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Escape") {

          mainNav.classList.remove(
            "open"
          );

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Open menu"
          );

          menuToggle.focus();
        }
      }
    );
  }


  /* =======================================================
     HEADER CONTROLS
     ======================================================= */

  function setupHeaderControls() {

    const themeToggle =
      $("#themeToggle");

    const languageToggle =
      $("#languageToggle");


    if (themeToggle) {
      themeToggle.addEventListener(
        "click",
        toggleTheme
      );
    }


    if (languageToggle) {
      languageToggle.addEventListener(
        "click",
        cycleLanguage
      );
    }
  }


  /* =======================================================
     SCIENCE SUBJECTS
     ======================================================= */

  const SCIENCE_SUBJECTS = [
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "earth-environmental",
    "astronomy",
    "computer-science",
    "statistics",
    "health-sciences"
  ];


  function getCurrentSubject() {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const subject =
      params.get("subject");

    if (
      subject &&
      SCIENCE_SUBJECTS.includes(subject)
    ) {
      return subject;
    }

    return null;
  }


  function highlightCurrentSubject() {
    const currentSubject =
      getCurrentSubject();

    if (!currentSubject) {
      return;
    }


    const card =
      document.querySelector(
        `[data-subject="${currentSubject}"]`
      );

    if (!card) {
      return;
    }


    card.classList.add(
      "current-subject"
    );

    card.setAttribute(
      "aria-current",
      "page"
    );
  }


  /* =======================================================
     CATEGORY LINKS
     ======================================================= */

  function setupScienceLinks() {

    $$(".science-card").forEach(
      function (card) {

        card.addEventListener(
          "click",
          function () {

            const subject =
              card.dataset.subject;

            if (!subject) {
              return;
            }


            /*
              Keep category information in
              the URL so Subjects/Courses can
              identify the parent category.
            */

            const url =
              new URL(
                card.href,
                window.location.href
              );

            url.searchParams.set(
              "category",
              "sciences"
            );

            url.searchParams.set(
              "subject",
              subject
            );

            card.href =
              url.toString();
          }
        );
      }
    );
  }


  /* =======================================================
     URL CATEGORY CONTEXT
     ======================================================= */

  function ensureScienceCategoryContext() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const category =
      params.get("category");

    if (
      category === "sciences"
    ) {
      document.body.dataset.category =
        "sciences";
    }
  }


  /* =======================================================
     COURSE / CONTENT LINKS
     ======================================================= */

  function setupContextLinks() {

    const links =
      $$(
        'a[href*="courses.html"],' +
        'a[href*="content.html"],' +
        'a[href*="teachers.html"],' +
        'a[href*="ask-expert.html"],' +
        'a[href*="course.html"]'
      );


    links.forEach(
      function (link) {

        try {

          const url =
            new URL(
              link.href,
              window.location.href
            );

          url.searchParams.set(
            "category",
            "sciences"
          );

          link.href =
            url.toString();

        } catch (error) {
          console.warn(
            "Unable to update BISOVIA link:",
            error
          );
        }
      }
    );
  }


  /* =======================================================
     CORE READY HOOK
     ======================================================= */

  function notifyCore() {

    try {

      document.dispatchEvent(
        new CustomEvent(
          "bisovia:scienceReady",
          {
            detail: {
              category: "sciences",
              subjects:
                SCIENCE_SUBJECTS.slice()
            }
          }
        )
      );

    } catch (error) {
      console.warn(
        "BISOVIA science event failed:",
        error
      );
    }
  }


  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.BISOVIA_LEARNING_SCIENCES = {

    getLanguage,

    setLanguage,

    getTheme: function () {
      return (
        document.documentElement.dataset.theme ||
        getStoredTheme()
      );
    },

    setTheme: applyTheme,

    toggleTheme,

    getSubject: getCurrentSubject,

    subjects:
      SCIENCE_SUBJECTS.slice()
  };


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function init() {

    setCurrentYear();

    applyTheme(
      getStoredTheme()
    );

    updateLanguageButton(
      getLanguage()
    );

    setupMobileNavigation();

    setupHeaderControls();

    ensureScienceCategoryContext();

    highlightCurrentSubject();

    setupScienceLinks();

    setupContextLinks();

    notifyCore();
  }


  /* =======================================================
     DOM READY
     ======================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
