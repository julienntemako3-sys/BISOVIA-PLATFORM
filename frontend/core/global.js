(function () {
  "use strict";

  window.BISOVIA = window.BISOVIA || {};

  function getBasePath() {
    const path = window.location.pathname;

    if (path.includes("/modules/")) {
      return "../../";
    }

    if (path.includes("/pages/")) {
      return "../";
    }

    return "./";
  }

  function resolveLink(link) {
    const href = link.getAttribute("href");

    if (!href) return;

    if (
      href.startsWith("#") ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      return;
    }

    /*
     * Links beginning with / are treated as frontend-root links.
     */
    if (href.startsWith("/")) {
      const clean = href.replace(/^\/+/, "");
      link.setAttribute("href", getBasePath() + clean);
    }
  }

  function initLinks() {
    document.querySelectorAll("a[href]").forEach(resolveLink);
  }

  function initExternalLinks() {
    document.querySelectorAll("a[target='_blank']").forEach(function (link) {
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function initCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (element) {
      element.textContent = new Date().getFullYear();
    });
  }

  function initMobileMenu() {
    const buttons = document.querySelectorAll("[data-mobile-menu-toggle]");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        document.body.classList.toggle("mobile-menu-open");
      });
    });
  }

  BISOVIA.global = {
    init: function () {
      initLinks();
      initExternalLinks();
      initCurrentYear();
      initMobileMenu();
    }
  };

  BISOVIA.ready(function () {
    BISOVIA.global.init();
  });
})();
