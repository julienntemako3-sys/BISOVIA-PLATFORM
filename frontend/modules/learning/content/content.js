
/* =========================================================
   BISOVIA — LEARNING CONTENT
   frontend/modules/learning/content/content.js
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeYear();

  initializeContentFilters();

  initializeContentSearch();

  initializeTheme();

  initializeLanguageButton();

  initializeUrlFilter();

});


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initializeYear() {

  const yearElement = document.getElementById("currentYear");

  if (!yearElement) return;

  yearElement.textContent = new Date().getFullYear();

}


/* =========================================================
   CONTENT FILTERS
   ========================================================= */

function initializeContentFilters() {

  const filterContainer =
    document.getElementById("contentFilters");

  if (!filterContainer) return;

  const buttons =
    filterContainer.querySelectorAll(".filter-button");

  const cards =
    document.querySelectorAll(".content-card");

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedType =
        button.dataset.contentType || "all";


      /* Active button */

      buttons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");


      /* Filter cards */

      let visibleCards = 0;

      cards.forEach((card) => {

        const cardType =
          card.dataset.contentType || "";

        const matches =
          selectedType === "all" ||
          cardType === selectedType;


        if (matches) {

          card.hidden = false;

          visibleCards++;

        } else {

          card.hidden = true;

        }

      });


      updateEmptyState(visibleCards);

    });

  });

}


/* =========================================================
   SEARCH
   ========================================================= */

function initializeContentSearch() {

  const form =
    document.getElementById("contentSearchForm");

  const input =
    document.getElementById("contentSearch");

  if (!form || !input) return;


  form.addEventListener("submit", (event) => {

    event.preventDefault();

    performSearch(input.value);

  });


  input.addEventListener("input", () => {

    const value =
      input.value.trim();

    if (!value) {

      resetSearch();

      return;

    }

    performSearch(value);

  });

}


/* =========================================================
   PERFORM SEARCH
   ========================================================= */

function performSearch(query) {

  const normalizedQuery =
    query.toLowerCase().trim();

  const cards =
    document.querySelectorAll(".content-card");

  let visibleCards = 0;


  cards.forEach((card) => {

    const searchableText =
      card.textContent
        .toLowerCase();


    const matches =
      searchableText.includes(normalizedQuery);


    if (matches) {

      card.hidden = false;

      visibleCards++;

    } else {

      card.hidden = true;

    }

  });


  /* Remove active filter */

  document
    .querySelectorAll(".filter-button")
    .forEach((button) => {

      button.classList.remove("active");

    });


  const allButton =
    document.querySelector(
      '.filter-button[data-content-type="all"]'
    );


  if (allButton) {

    allButton.classList.add("active");

  }


  updateEmptyState(visibleCards);

}


/* =========================================================
   RESET SEARCH
   ========================================================= */

function resetSearch() {

  const cards =
    document.querySelectorAll(".content-card");


  cards.forEach((card) => {

    card.hidden = false;

  });


  document
    .querySelectorAll(".filter-button")
    .forEach((button) => {

      button.classList.remove("active");

    });


  const allButton =
    document.querySelector(
      '.filter-button[data-content-type="all"]'
    );


  if (allButton) {

    allButton.classList.add("active");

  }


  updateEmptyState(cards.length);

}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function updateEmptyState(visibleCards) {

  const emptyState =
    document.getElementById("contentEmptyState");

  if (!emptyState) return;


  emptyState.hidden =
    visibleCards !== 0;

}


/* =========================================================
   URL CONTENT TYPE
   Example:
   content.html?type=video
   ========================================================= */

function initializeUrlFilter() {

  const params =
    new URLSearchParams(window.location.search);

  const type =
    params.get("type");


  if (!type) return;


  const button =
    document.querySelector(
      `.filter-button[data-content-type="${type}"]`
    );


  if (button) {

    button.click();

  }

}


/* =========================================================
   THEME
   ========================================================= */

function initializeTheme() {

  const themeButton =
    document.getElementById("themeToggle");

  if (!themeButton) return;


  const savedTheme =
    localStorage.getItem("bisovia-theme");


  if (savedTheme === "dark") {

    document.documentElement.dataset.theme =
      "dark";

  }


  updateThemeButton(themeButton);


  themeButton.addEventListener("click", () => {

    const currentTheme =
      document.documentElement.dataset.theme;


    if (currentTheme === "dark") {

      document.documentElement.dataset.theme =
        "light";

      localStorage.setItem(
        "bisovia-theme",
        "light"
      );

    } else {

      document.documentElement.dataset.theme =
        "dark";

      localStorage.setItem(
        "bisovia-theme",
        "dark"
      );

    }


    updateThemeButton(themeButton);

  });

}


/* =========================================================
   THEME BUTTON
   ========================================================= */

function updateThemeButton(button) {

  if (!button) return;


  const isDark =
    document.documentElement.dataset.theme === "dark";


  button.textContent =
    isDark ? "☀" : "◐";


  button.setAttribute(
    "aria-label",
    isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
  );

}


/* =========================================================
   LANGUAGE BUTTON
   ========================================================= */

function initializeLanguageButton() {

  const languageButton =
    document.getElementById("languageToggle");

  if (!languageButton) return;


  /*
   * BISOVIA Core translation system will control
   * the complete language switch.
   *
   * This button remains compatible with:
   *
   * frontend/core/translation.js
   * frontend/core/langues/en.js
   * frontend/core/langues/fr.js
   * frontend/core/langues/rn.js
   * frontend/core/langues/sw.js
   */


  languageButton.addEventListener("click", () => {

    if (
      window.BISOVIA &&
      typeof window.BISOVIA.setLanguage === "function"
    ) {

      const current =
        window.BISOVIA.getLanguage
          ? window.BISOVIA.getLanguage()
          : "en";


      const languages =
        ["en", "fr", "rn", "sw"];


      const index =
        languages.indexOf(current);


      const next =
        languages[
          (index + 1) % languages.length
        ];


      window.BISOVIA.setLanguage(next);

      languageButton.textContent =
        next.toUpperCase();

      return;

    }


    /*
     * Fallback until Core translation
     * is fully connected.
     */

    const current =
      localStorage.getItem(
        "bisovia-language"
      ) || "en";


    const languages =
      ["en", "fr", "rn", "sw"];


    const index =
      languages.indexOf(current);


    const next =
      languages[
        (index + 1) % languages.length
      ];


    localStorage.setItem(
      "bisovia-language",
      next
    );


    languageButton.textContent =
      next.toUpperCase();

  });

}


/* =========================================================
   CONTENT API PLACEHOLDER
   ========================================================= */

/*
 * Later the backend can provide real learning content.
 *
 * Expected structure:
 *
 * {
 *   id: "content-001",
 *   type: "video",
 *   title: "...",
 *   description: "...",
 *   category: "science",
 *   subject: "physics",
 *   courseId: "...",
 *   lessonId: "...",
 *   teacherId: "...",
 *   mediaUrl: "...",
 *   thumbnailUrl: "...",
 *   language: "en",
 *   duration: 720,
 *   level: "beginner"
 * }
 *
 * The frontend should NOT connect directly to a database.
 *
 * Future flow:
 *
 * BISOVIA Frontend
 *       ↓
 * Core / API
 *       ↓
 * Backend
 *       ↓
 * Database / Storage
 */


/* =========================================================
   PUBLIC CONTENT HELPERS
   ========================================================= */

window.BISOVIA_LEARNING_CONTENT = {

  filter(type) {

    const button =
      document.querySelector(
        `.filter-button[data-content-type="${type}"]`
      );


    if (button) {

      button.click();

    }

  },


  search(query) {

    performSearch(query);

  },


  reset() {

    resetSearch();

  }

};


/* =========================================================
   END
   ========================================================= */
