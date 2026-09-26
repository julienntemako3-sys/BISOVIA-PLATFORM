/* =========================================================
   BISOVIA GLOBAL FRONTEND INTEGRATION
   ========================================================= */

(function () {
  "use strict";

  const GLOBAL = {
    initialized: false,

    init() {
      if (this.initialized) return;

      this.markActiveNavigation();
      this.setupMobileNavigation();
      this.setupGlobalLinks();
      this.updateCurrentYear();
      this.updatePiStatus();

      document.addEventListener(
        "bisovia:coreReady",
        () => {
          this.markActiveNavigation();
          this.updatePiStatus();
        }
      );

      document.addEventListener(
        "bisovia:piReady",
        () => {
          this.updatePiStatus();
        }
      );

      document.addEventListener(
        "bisovia:translationsApplied",
        () => {
          this.markActiveNavigation();
          this.updateCurrentYear();
        }
      );

      this.initialized = true;

      console.info(
        "BISOVIA Global Frontend initialized."
      );
    },

    /* =======================================================
       ACTIVE NAVIGATION
       ======================================================= */

    markActiveNavigation() {
      const currentPath =
        window.location.pathname
          .split("/")
          .pop() || "index.html";

      document
        .querySelectorAll(
          "[data-global-nav], .bisovia-nav-links a"
        )
        .forEach((link) => {
          const href =
            link.getAttribute("href");

          if (!href) return;

          const linkPath =
            href.split("?")[0]
              .split("#")[0]
              .split("/")
              .pop();

          link.classList.toggle(
            "active",
            linkPath === currentPath
          );
        });
    },

    /* =======================================================
       MOBILE NAVIGATION
       ======================================================= */

    setupMobileNavigation() {
      const toggle =
        document.querySelector(
          "[data-mobile-menu]"
        );

      const nav =
        document.querySelector(
          "[data-mobile-nav]"
        );

      if (!toggle || !nav) return;

      toggle.addEventListener(
        "click",
        () => {
          const open =
            nav.classList.toggle("open");

          toggle.setAttribute(
            "aria-expanded",
            open ? "true" : "false"
          );
        }
      );

      nav.querySelectorAll("a").forEach(
        (link) => {
          link.addEventListener(
            "click",
            () => {
              nav.classList.remove("open");

              toggle.setAttribute(
                "aria-expanded",
                "false"
              );
            }
          );
        }
      );
    },

    /* =======================================================
       GLOBAL LINKS
       ======================================================= */

    setupGlobalLinks() {
      document
        .querySelectorAll("[data-global-link]")
        .forEach((element) => {
          element.addEventListener(
            "click",
            (event) => {
              const target =
                element.getAttribute(
                  "data-global-link"
                );

              if (!target) return;

              event.preventDefault();
              window.location.href = target;
            }
          );
        });
    },

    /* =======================================================
       CURRENT YEAR
       ======================================================= */

    updateCurrentYear() {
      document
        .querySelectorAll(
          "[data-current-year]"
        )
        .forEach((element) => {
          element.textContent =
            new Date().getFullYear();
        });
    },

    /* =======================================================
       PI STATUS
       ======================================================= */

    updatePiStatus() {
      const ready =
        window.BISOVIA &&
        window.BISOVIA.state &&
        window.BISOVIA.state.piReady;

      document
        .querySelectorAll(
          "[data-pi-status]"
        )
        .forEach((element) => {
          element.textContent = ready
            ? "Pi connection is ready"
            : "Pi connection is unavailable";

          element.classList.toggle(
            "connected",
            Boolean(ready)
          );
        });
    }
  };

  window.BISOVIA_GLOBAL = GLOBAL;

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => GLOBAL.init(),
      { once: true }
    );
  } else {
    GLOBAL.init();
  }

})();
