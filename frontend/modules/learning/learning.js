/* =========================================================
   BISOVIA — LEARNING MODULE
   File: frontend/modules/learning/learning.js
   ========================================================= */

(function () {
    "use strict";

    /* =========================
       MODULE CONFIGURATION
    ========================== */

    const Learning = {
        name: "learning",
        version: "1.0.0",

        init() {
            this.setCurrentYear();
            this.initNavigation();
            this.initCategoryLinks();
            this.initAccessibility();
        },

        /* =========================
           CURRENT YEAR
        ========================== */

        setCurrentYear() {
            const yearElement = document.getElementById("currentYear");

            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        },

        /* =========================
           NAVIGATION
        ========================== */

        initNavigation() {
            const currentPage =
                window.location.pathname.split("/").pop() ||
                "index.html";

            const navigationLinks =
                document.querySelectorAll(".learning-nav a");

            navigationLinks.forEach((link) => {
                const href = link.getAttribute("href");

                if (!href) {
                    return;
                }

                const linkPage =
                    href.split("/").pop().split("?")[0];

                if (linkPage === currentPage) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }
            });
        },

        /* =========================
           CATEGORY LINKS
        ========================== */

        initCategoryLinks() {
            const categoryLinks =
                document.querySelectorAll(
                    '.learning-card a[href*="courses.html?category="]'
                );

            categoryLinks.forEach((link) => {
                link.addEventListener("click", () => {
                    const url = new URL(
                        link.href,
                        window.location.href
                    );

                    const category =
                        url.searchParams.get("category");

                    if (category) {
                        sessionStorage.setItem(
                            "bisovia_learning_category",
                            category
                        );
                    }
                });
            });
        },

        /* =========================
           ACCESSIBILITY
        ========================== */

        initAccessibility() {
            const cards =
                document.querySelectorAll(".learning-card");

            cards.forEach((card) => {
                const link = card.querySelector("a");

                if (!link) {
                    return;
                }

                card.setAttribute("role", "article");
            });
        }
    };


    /* =========================
       DOM READY
    ========================== */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            () => Learning.init()
        );
    } else {
        Learning.init();
    }


    /* =========================
       GLOBAL MODULE ACCESS
       ========================== */

    window.BISOVIA = window.BISOVIA || {};
    window.BISOVIA.Learning = Learning;

})();
