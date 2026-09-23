/* =========================================================
   BISOVIA — GLOBAL CORE
   Global UI behavior for all BISOVIA pages
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     CURRENT YEAR
     --------------------------------------------------------- */
  function setCurrentYear() {
    const year = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = year;
    });

    const footerYear = document.getElementById("currentYear");

    if (footerYear) {
      footerYear.textContent = year;
    }
  }

  /* ---------------------------------------------------------
     MOBILE NAVIGATION
     --------------------------------------------------------- */
  function initMobileNavigation() {
    const menuToggle =
      document.getElementById("menuToggle") ||
      document.querySelector(".menu-toggle");

    const mobileNav =
      document.getElementById("mobileNav") ||
      document.querySelector(".mobile-nav");

    if (!menuToggle || !mobileNav) {
      return;
    }

    menuToggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (
        mobileNav.classList.contains("open") &&
        !mobileNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        mobileNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------
     ACTIVE NAVIGATION LINK
     --------------------------------------------------------- */
  function initActiveNavigation() {
    const currentPath = window.location.pathname;

    document.querySelectorAll("nav a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href === "#" || href.startsWith("javascript:")) {
        return;
      }

      try {
        const linkUrl = new URL(href, window.location.href);

        if (
          linkUrl.pathname === currentPath ||
          (
            linkUrl.pathname !== "/" &&
            currentPath.startsWith(linkUrl.pathname)
          )
        ) {
          link.classList.add("active");
        }
      } catch (error) {
        // Ignore invalid navigation URLs.
      }
    });
  }

  /* ---------------------------------------------------------
     BACK BUTTON
     --------------------------------------------------------- */
  function initBackButtons() {
    document.querySelectorAll("[data-back]").forEach((button) => {
      button.addEventListener("click", function () {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "../index.html";
        }
      });
    });
  }

  /* ---------------------------------------------------------
     SAFE LOCAL STORAGE
     --------------------------------------------------------- */
  function storageGet(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  /* ---------------------------------------------------------
     BISOVIA GLOBAL API
     --------------------------------------------------------- */
  window.BISOVIA = window.BISOVIA || {};

  window.BISOVIA.storage = {
    get: storageGet,
    set: storageSet
  };

  window.BISOVIA.global = {
    setCurrentYear,
    initMobileNavigation,
    initActiveNavigation,
    initBackButtons
  };

  /* ---------------------------------------------------------
     INITIALIZE
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    setCurrentYear();
    initMobileNavigation();
    initActiveNavigation();
    initBackButtons();
  });

})();
