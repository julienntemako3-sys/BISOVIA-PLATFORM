/* =========================================
   BISOVIA AUTO MODULE
   auto.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     CURRENT YEAR
  ========================================= */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =========================================
     DARK / LIGHT MODE
  ========================================= */

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("bisovia-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  updateThemeIcon();


  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      document.body.classList.toggle("dark");

      const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

      localStorage.setItem("bisovia-theme", theme);

      updateThemeIcon();

    });

  }


  function updateThemeIcon() {

    if (!themeToggle) {
      return;
    }

    const isDark =
      document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "☀" : "◐";

    themeToggle.setAttribute(
      "aria-label",
      isDark
        ? "Switch to light mode"
        : "Switch to dark mode"
    );

  }


  /* =========================================
     SERVICE LINKS
  ========================================= */

  const serviceLinks =
    document.querySelectorAll(".service-link");

  serviceLinks.forEach((link) => {

    link.addEventListener("click", () => {

      link.classList.add("clicked");

      setTimeout(() => {
        link.classList.remove("clicked");
      }, 250);

    });

  });


  /* =========================================
     SMOOTH SCROLL
  ========================================= */

  const hashLinks =
    document.querySelectorAll('a[href^="#"]');

  hashLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") {
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


  /* =========================================
     ACTIVE NAVIGATION
  ========================================= */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

  const navLinks =
    document.querySelectorAll(".main-nav a");

  navLinks.forEach((link) => {

    const href =
      link.getAttribute("href");

    if (!href) {
      return;
    }

    const linkPage =
      href.split("/")
        .pop()
        .split("?")[0]
        .toLowerCase();

    if (
      linkPage === currentPage &&
      currentPage !== ""
    ) {

      navLinks.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");

    }

  });


  /* =========================================
     MODULE READY
  ========================================= */

  document.body.classList.add("auto-module-ready");

});
