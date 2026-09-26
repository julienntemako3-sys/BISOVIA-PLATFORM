/**
 * BISOVIA LEARNING — CATEGORIES
 * Path:
 * frontend/modules/learning/categories/categories.js
 *
 * Responsibilities:
 * - Category search
 * - Clear / reset search
 * - Empty state
 * - Search status
 * - Theme management
 * - Language integration
 * - Mobile navigation
 * - Current year
 * - URL category handling
 * - Safe BISOVIA Core integration
 *
 * No backend / database access.
 */

(() => {
    "use strict";

    /* =========================================================
       CONFIGURATION
    ========================================================= */

    const STORAGE = {
        theme: "bisovia-theme",
        language: "bisovia-language"
    };

    const LANGUAGES = ["en", "fr", "rn", "sw"];

    const elements = {
        search: document.getElementById("categorySearch"),
        clearSearch: document.getElementById("clearSearch"),
        searchStatus: document.getElementById("searchStatus"),

        grid: document.getElementById("categoriesGrid"),
        emptyState: document.getElementById("emptyState"),
        resetSearch: document.getElementById("resetSearch"),

        themeToggle: document.getElementById("themeToggle"),
        languageToggle: document.getElementById("languageToggle"),

        menuToggle: document.getElementById("menuToggle"),
        nav: document.querySelector(".main-nav"),

        year: document.getElementById("currentYear")
    };

    /* =========================================================
       UTILITIES
    ========================================================= */

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE.theme);
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE.theme, theme);
        } catch (error) {
            // Ignore storage errors.
        }
    }

    function getStoredLanguage() {
        try {
            return localStorage.getItem(STORAGE.language);
        } catch (error) {
            return null;
        }
    }

    function saveLanguage(language) {
        try {
            localStorage.setItem(STORAGE.language, language);
        } catch (error) {
            // Ignore storage errors.
        }
    }

    function getPreferredTheme() {
        const stored = getStoredTheme();

        if (stored === "dark" || stored === "light") {
            return stored;
        }

        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            return "dark";
        }

        return "light";
    }

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    /* =========================================================
       THEME
    ========================================================= */

    function applyTheme(theme) {
        const safeTheme = theme === "dark" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", safeTheme);
        document.body.setAttribute("data-theme", safeTheme);

        saveTheme(safeTheme);

        if (elements.themeToggle) {
            const isDark = safeTheme === "dark";

            elements.themeToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );

            elements.themeToggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            elements.themeToggle.title = isDark
                ? "Light mode"
                : "Dark mode";

            elements.themeToggle.textContent = isDark ? "☀️" : "🌙";
        }

        window.dispatchEvent(
            new CustomEvent("bisovia:themeChanged", {
                detail: {
                    theme: safeTheme
                }
            })
        );
    }

    function toggleTheme() {
        const current =
            document.documentElement.getAttribute("data-theme") ||
            "light";

        applyTheme(current === "dark" ? "light" : "dark");
    }

    /* =========================================================
       LANGUAGE
    ========================================================= */

    function getLanguage() {
        try {
            if (
                window.BISOVIA &&
                typeof window.BISOVIA.getLanguage === "function"
            ) {
                const coreLanguage = window.BISOVIA.getLanguage();

                if (LANGUAGES.includes(coreLanguage)) {
                    return coreLanguage;
                }
            }
        } catch (error) {
            // Fallback below.
        }

        const stored = getStoredLanguage();

        if (LANGUAGES.includes(stored)) {
            return stored;
        }

        return "en";
    }

    function setLanguage(language) {
        const safeLanguage = LANGUAGES.includes(language)
            ? language
            : "en";

        let coreUpdated = false;

        try {
            if (
                window.BISOVIA &&
                typeof window.BISOVIA.setLanguage === "function"
            ) {
                window.BISOVIA.setLanguage(safeLanguage);
                coreUpdated = true;
            }
        } catch (error) {
            coreUpdated = false;
        }

        if (!coreUpdated) {
            saveLanguage(safeLanguage);
        } else {
            saveLanguage(safeLanguage);
        }

        document.documentElement.setAttribute(
            "lang",
            safeLanguage
        );

        if (elements.languageToggle) {
            elements.languageToggle.dataset.language = safeLanguage;

            elements.languageToggle.setAttribute(
                "aria-label",
                `Language: ${safeLanguage.toUpperCase()}`
            );

            elements.languageToggle.title =
                `Language: ${safeLanguage.toUpperCase()}`;
        }

        window.dispatchEvent(
            new CustomEvent("bisovia:languageChanged", {
                detail: {
                    language: safeLanguage
                }
            })
        );
    }

    function cycleLanguage() {
        const current = getLanguage();
        const index = LANGUAGES.indexOf(current);

        const next =
            LANGUAGES[(index + 1) % LANGUAGES.length];

        setLanguage(next);
    }

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    function closeMenu() {
        if (!elements.nav || !elements.menuToggle) {
            return;
        }

        elements.nav.classList.remove("open");

        elements.menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    function toggleMenu() {
        if (!elements.nav || !elements.menuToggle) {
            return;
        }

        const isOpen =
            elements.nav.classList.toggle("open");

        elements.menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }

    function setupMobileNavigation() {
        if (!elements.menuToggle) {
            return;
        }

        elements.menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        elements.menuToggle.addEventListener(
            "click",
            toggleMenu
        );

        document.addEventListener("click", (event) => {
            if (!elements.nav || !elements.menuToggle) {
                return;
            }

            const clickedInsideNav =
                elements.nav.contains(event.target);

            const clickedMenuButton =
                elements.menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedMenuButton) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        elements.nav?.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });
    }

    /* =========================================================
       CATEGORY SEARCH
    ========================================================= */

    function getCategoryCards() {
        if (!elements.grid) {
            return [];
        }

        return Array.from(
            elements.grid.querySelectorAll(".category-card")
        );
    }

    function getCardSearchText(card) {
        const dataCategory =
            card.getAttribute("data-category") || "";

        const title =
            card.querySelector("h3")?.textContent || "";

        const description =
            card.querySelector("p")?.textContent || "";

        return normalize(
            `${dataCategory} ${title} ${description}`
        );
    }

    function updateSearchStatus(visibleCount, totalCount, query) {
        if (!elements.searchStatus) {
            return;
        }

        if (!query) {
            elements.searchStatus.textContent =
                `${totalCount} categories available`;
            return;
        }

        elements.searchStatus.textContent =
            `${visibleCount} result${visibleCount === 1 ? "" : "s"} found`;
    }

    function updateEmptyState(visibleCount) {
        if (!elements.emptyState) {
            return;
        }

        elements.emptyState.hidden = visibleCount !== 0;
    }

    function updateClearButton(query) {
        if (!elements.clearSearch) {
            return;
        }

        const hasQuery = Boolean(query);

        elements.clearSearch.hidden = !hasQuery;
        elements.clearSearch.disabled = !hasQuery;
    }

    function searchCategories(query = "") {
        const cards = getCategoryCards();
        const normalizedQuery = normalize(query);

        let visibleCount = 0;

        cards.forEach((card) => {
            const searchableText =
                getCardSearchText(card);

            const matches =
                !normalizedQuery ||
                searchableText.includes(normalizedQuery);

            card.hidden = !matches;

            card.setAttribute(
                "aria-hidden",
                String(!matches)
            );

            if (matches) {
                visibleCount += 1;
            }
        });

        updateEmptyState(visibleCount);
        updateClearButton(normalizedQuery);

        updateSearchStatus(
            visibleCount,
            cards.length,
            normalizedQuery
        );

        return visibleCount;
    }

    function clearSearch() {
        if (elements.search) {
            elements.search.value = "";
            elements.search.focus();
        }

        searchCategories("");
    }

    /* =========================================================
       URL CATEGORY HANDLING
    ========================================================= */

    function getURLCategory() {
        try {
            const params = new URLSearchParams(
                window.location.search
            );

            return normalize(
                params.get("category")
            );
        } catch (error) {
            return "";
        }
    }

    function highlightCurrentCategory() {
        const category =
            getURLCategory();

        if (!category) {
            return;
        }

        const cards = getCategoryCards();

        cards.forEach((card) => {
            card.classList.remove("current");

            const cardCategory =
                normalize(
                    card.getAttribute("data-category")
                );

            if (
                cardCategory === category ||
                cardCategory.includes(category) ||
                category.includes(cardCategory)
            ) {
                card.classList.add("current");
            }
        });
    }

    /* =========================================================
       CATEGORY LINKS
    ========================================================= */

    function setupCategoryLinks() {
        const cards = getCategoryCards();

        cards.forEach((card) => {
            const link =
                card.querySelector("a");

            if (!link) {
                return;
            }

            link.addEventListener("click", () => {
                try {
                    const category =
                        card.getAttribute("data-category");

                    if (!category) {
                        return;
                    }

                    const url =
                        new URL(
                            link.href,
                            window.location.href
                        );

                    if (!url.searchParams.has("category")) {
                        url.searchParams.set(
                            "category",
                            normalize(category)
                        );

                        link.href = url.toString();
                    }
                } catch (error) {
                    // Keep normal navigation.
                }
            });
        });
    }

    /* =========================================================
       CORE INTEGRATION
    ========================================================= */

    function notifyCoreReady() {
        window.dispatchEvent(
            new CustomEvent(
                "bisovia:learningCategoriesReady",
                {
                    detail: {
                        module: "learning",
                        section: "categories"
                    }
                }
            )
        );
    }

    /* =========================================================
       YEAR
    ========================================================= */

    function updateYear() {
        if (elements.year) {
            elements.year.textContent =
                new Date().getFullYear();
        }
    }

    /* =========================================================
       EVENT LISTENERS
    ========================================================= */

    function setupEvents() {
        if (elements.search) {
            elements.search.addEventListener(
                "input",
                (event) => {
                    searchCategories(
                        event.target.value
                    );
                }
            );

            elements.search.addEventListener(
                "search",
                (event) => {
                    searchCategories(
                        event.target.value
                    );
                }
            );
        }

        elements.clearSearch?.addEventListener(
            "click",
            clearSearch
        );

        elements.resetSearch?.addEventListener(
            "click",
            clearSearch
        );

        elements.themeToggle?.addEventListener(
            "click",
            toggleTheme
        );

        elements.languageToggle?.addEventListener(
            "click",
            cycleLanguage
        );

        window.addEventListener(
            "bisovia:languageChanged",
            (event) => {
                const language =
                    event.detail?.language;

                if (
                    language &&
                    LANGUAGES.includes(language)
                ) {
                    document.documentElement.setAttribute(
                        "lang",
                        language
                    );
                }
            }
        );

        window.addEventListener(
            "bisovia:themeChanged",
            (event) => {
                const theme =
                    event.detail?.theme;

                if (
                    theme === "light" ||
                    theme === "dark"
                ) {
                    document.documentElement.setAttribute(
                        "data-theme",
                        theme
                    );
                }
            }
        );
    }

    /* =========================================================
       INITIALIZATION
    ========================================================= */

    function init() {
        applyTheme(getPreferredTheme());

        setLanguage(getLanguage());

        updateYear();

        setupMobileNavigation();

        setupEvents();

        setupCategoryLinks();

        searchCategories(
            elements.search?.value || ""
        );

        highlightCurrentCategory();

        notifyCoreReady();

        window.BISOVIA_LEARNING_CATEGORIES = {
            search: searchCategories,
            clearSearch,
            setLanguage,
            getLanguage,
            setTheme: applyTheme,
            toggleTheme,
            getCategoryCards
        };
    }

    /* =========================================================
       START
    ========================================================= */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );
    } else {
        init();
    }

})();
