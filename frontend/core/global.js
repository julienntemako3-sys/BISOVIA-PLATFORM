
 /* =========================================================
   BISOVIA — GLOBAL UI INTEGRATION
   File: frontend/core/global.js
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     GLOBAL HELPERS
     ========================================================= */

  const BISOVIA_THEME_KEY = "bisovia_theme";

  function getElement(selector) {
    return document.querySelector(selector);
  }

  function getElements(selector) {
    return document.querySelectorAll(selector);
  }

  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  function initializeCurrentYear() {
    const year = new Date().getFullYear();

    getElements("[data-current-year]").forEach(function (element) {
      element.textContent = year;
    });
  }

  /* =========================================================
     THEME
     ========================================================= */

  function getSavedTheme() {
    return localStorage.getItem(BISOVIA_THEME_KEY) || "system";
  }

  function applyTheme(theme) {
    if (!["light", "dark", "system"].includes(theme)) {
      theme = "system";
    }

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(BISOVIA_THEME_KEY, theme);

    getElements(
      "[data-theme-selector], #themeSelector, #theme-select"
    ).forEach(function (selector) {
      selector.value = theme;
    });

    document.dispatchEvent(
      new CustomEvent("bisovia:themeChanged", {
        detail: {
          theme: theme
        }
      })
    );
  }

  function initializeTheme() {
    const savedTheme = getSavedTheme();

    applyTheme(savedTheme);

    document.addEventListener("change", function (event) {
      const target = event.target;

      if (
        target.matches(
          "[data-theme-selector], #themeSelector, #theme-select"
        )
      ) {
        applyTheme(target.value);
      }
    });

    /*
     * Support a simple theme toggle button.
     */
    getElements(
      "[data-theme-toggle], #themeToggle"
    ).forEach(function (button) {
      button.addEventListener("click", function () {
        const currentTheme =
          document.documentElement.getAttribute("data-theme");

        if (currentTheme === "dark") {
          applyTheme("light");
        } else {
          applyTheme("dark");
        }
      });
    });

    /*
     * Follow system theme when "system" is selected.
     */
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    function handleSystemTheme() {
      const currentTheme = getSavedTheme();

      if (currentTheme !== "system") {
        return;
      }

      document.documentElement.setAttribute(
        "data-theme",
        mediaQuery.matches ? "dark" : "light"
      );
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(
        "change",
        handleSystemTheme
      );
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemTheme);
    }

    handleSystemTheme();
  }

  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  function initializeMobileNavigation() {
    const menuButton =
      getElement(
        "[data-menu-toggle], #menuToggle, .menu-toggle"
      );

    const navigation =
      getElement(
        "[data-mobile-nav], #mobileNav, .mobile-nav"
      );

    if (!menuButton || !navigation) {
      return;
    }

    menuButton.addEventListener("click", function () {
      const isOpen =
        navigation.classList.toggle("open");

      menuButton.classList.toggle(
        "active",
        isOpen
      );

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      navigation.setAttribute(
        "aria-hidden",
        String(!isOpen)
      );
    });

    /*
     * Close mobile navigation after selecting a link.
     */
    navigation
      .querySelectorAll("a")
      .forEach(function (link) {
        link.addEventListener("click", function () {
          navigation.classList.remove("open");
          menuButton.classList.remove("active");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

          navigation.setAttribute(
            "aria-hidden",
            "true"
          );
        });
      });

    /*
     * Close navigation when clicking outside.
     */
    document.addEventListener("click", function (event) {
      if (!navigation.classList.contains("open")) {
        return;
      }

      if (
        navigation.contains(event.target) ||
        menuButton.contains(event.target)
      ) {
        return;
      }

      navigation.classList.remove("open");
      menuButton.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      navigation.setAttribute(
        "aria-hidden",
        "true"
      );
    });
  }

  /* =========================================================
     LANGUAGE SELECTOR
     ========================================================= */

  function initializeLanguageSelector() {
    const selectors = getElements(
      "[data-language-selector], #languageSelector, #language-select"
    );

    if (!selectors.length) {
      return;
    }

    const currentLanguage =
      window.BISOVIA_TRANSLATION &&
      typeof window.BISOVIA_TRANSLATION.getLanguage ===
        "function"
        ? window.BISOVIA_TRANSLATION.getLanguage()
        : "en";

    selectors.forEach(function (selector) {
      selector.value = currentLanguage;

      selector.addEventListener(
        "change",
        function () {
          const language = selector.value;

          if (
            window.BISOVIA_TRANSLATION &&
            typeof window.BISOVIA_TRANSLATION.setLanguage ===
              "function"
          ) {
            window.BISOVIA_TRANSLATION.setLanguage(
              language
            );
          }
        }
      );
    });
  }

  /* =========================================================
     ACTIVE NAVIGATION LINK
     ========================================================= */

  function initializeActiveNavigation() {
    const currentPage =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    getElements(
      "nav a[href], header a[href]"
    ).forEach(function (link) {
      const href =
        link.getAttribute("href") || "";

      if (
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:")
      ) {
        return;
      }

      const linkPage =
        href
          .split("/")
          .pop()
          .split("?")[0]
          .split("#")[0]
          .toLowerCase();

      if (
        linkPage &&
        linkPage === currentPage
      ) {
        link.classList.add("active");
        link.setAttribute(
          "aria-current",
          "page"
        );
      }
    });
  }

  /* =========================================================
     SMOOTH INTERNAL LINKS
     ========================================================= */

  function initializeSmoothLinks() {
    getElements(
      'a[href^="#"]'
    ).forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  /* =========================================================
     GLOBAL EXTERNAL LINK SAFETY
     ========================================================= */

  function initializeExternalLinks() {
    getElements("a[target='_blank']").forEach(
      function (link) {
        const currentRel =
          link.getAttribute("rel") || "";

        if (!currentRel.includes("noopener")) {
          link.setAttribute(
            "rel",
            (currentRel + " noopener noreferrer").trim()
          );
        }
      }
    );
  }

  /* =========================================================
     GLOBAL INITIALIZATION
     ========================================================= */

  function initializeGlobalUI() {
    initializeCurrentYear();
    initializeTheme();
    initializeMobileNavigation();
    initializeLanguageSelector();
    initializeActiveNavigation();
    initializeSmoothLinks();
    initializeExternalLinks();

    document.dispatchEvent(
      new CustomEvent("bisovia:globalReady")
    );
  }

  /* =========================================================
     PUBLIC GLOBAL API
     ========================================================= */

  window.BISOVIA_GLOBAL = {
    initialize: initializeGlobalUI,
    applyTheme: applyTheme,
    getSavedTheme: getSavedTheme
  };

  /* =========================================================
     START
     ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGlobalUI,
      { once: true }
    );
  } else {
    initializeGlobalUI();
  }

})();
