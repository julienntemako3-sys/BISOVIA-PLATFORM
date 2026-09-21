/* =========================================================
   BISOVIA — UTILITIES MODULE
   utility.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     1. CURRENT YEAR
  ======================================================= */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     2. PI SDK INITIALIZATION
  ======================================================= */

  if (window.Pi) {
    try {
      Pi.init({
        version: "2.0",
        sandbox: true
      });
    } catch (error) {
      console.warn("Pi initialization error:", error);
    }
  }


  /* =======================================================
     3. MOBILE MENU
  ======================================================= */

  const mobileMenuToggle =
    document.getElementById("mobileMenuToggle");

  const mainNavigation =
    document.getElementById("mainNavigation");

  if (mobileMenuToggle && mainNavigation) {

    mobileMenuToggle.addEventListener("click", () => {

      const isOpen =
        mainNavigation.classList.toggle("open");

      mobileMenuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });

  }


  /* =======================================================
     4. CLOSE MOBILE MENU AFTER CLICK
  ======================================================= */

  if (mainNavigation) {

    const navigationLinks =
      mainNavigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {

      link.addEventListener("click", () => {

        mainNavigation.classList.remove("open");

        if (mobileMenuToggle) {
          mobileMenuToggle.setAttribute(
            "aria-expanded",
            "false"
          );
        }

      });

    });

  }


  /* =======================================================
     5. DARK / LIGHT THEME
  ======================================================= */

  const themeToggle =
    document.getElementById("themeToggle");

  const savedTheme =
    localStorage.getItem("bisoviaTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");

    if (themeToggle) {
      themeToggle.textContent = "☀️";
    }
  }

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      document.body.classList.toggle("dark-mode");

      const isDark =
        document.body.classList.contains("dark-mode");

      localStorage.setItem(
        "bisoviaTheme",
        isDark ? "dark" : "light"
      );

      themeToggle.textContent =
        isDark ? "☀️" : "🌙";

    });

  }


  /* =======================================================
     6. LANGUAGE SELECTION
     ======================================================= */

  const languageSelect =
    document.getElementById("languageSelect");

  const savedLanguage =
    localStorage.getItem("bisoviaLanguage");

  if (languageSelect && savedLanguage) {
    languageSelect.value = savedLanguage;
    document.documentElement.lang = savedLanguage;
  }

  if (languageSelect) {

    languageSelect.addEventListener("change", () => {

      const selectedLanguage =
        languageSelect.value;

      localStorage.setItem(
        "bisoviaLanguage",
        selectedLanguage
      );

      document.documentElement.lang =
        selectedLanguage;

      /*
       * Full EN / FR / RN / SW translation system
       * will be centralized across BISOVIA frontend
       * after all module pages are completed.
       */

    });

  }


  /* =======================================================
     7. PI SIGN IN
  ======================================================= */

  const piSignIn =
    document.getElementById("piSignIn");

  if (piSignIn) {

    piSignIn.addEventListener("click", async () => {

      if (!window.Pi) {

        alert(
          "Pi is not available. Please open BISOVIA inside Pi Browser."
        );

        return;
      }

      piSignIn.disabled = true;
      piSignIn.textContent = "Connecting...";

      try {

        await Pi.authenticate(
          ["username", "payments"],
          (payment) => {

            console.log(
              "Incomplete Pi payment:",
              payment
            );

          }
        );

        piSignIn.textContent = "Connected with Pi";

      } catch (error) {

        console.error(
          "Pi authentication failed:",
          error
        );

        piSignIn.disabled = false;
        piSignIn.textContent = "Sign in with Pi";

        alert(
          "Pi Sign-In could not be completed. Please try again in Pi Browser."
        );

      }

    });

  }


  /* =======================================================
     8. SERVICE SEARCH & FILTER
  ======================================================= */

  const serviceSearch =
    document.getElementById("serviceSearch");

  const serviceCategory =
    document.getElementById("serviceCategory");

  const serviceAvailability =
    document.getElementById("serviceAvailability");

  const servicesGrid =
    document.getElementById("servicesGrid");

  const noServicesMessage =
    document.getElementById("noServicesMessage");

  const clearServiceFilters =
    document.getElementById("clearServiceFilters");


  function filterServices() {

    if (!servicesGrid) {
      return;
    }

    const cards =
      servicesGrid.querySelectorAll(".service-card");

    const searchTerm =
      serviceSearch
        ? serviceSearch.value.toLowerCase().trim()
        : "";

    const selectedCategory =
      serviceCategory
        ? serviceCategory.value
        : "all";

    const selectedAvailability =
      serviceAvailability
        ? serviceAvailability.value
        : "all";

    let visibleCount = 0;

    cards.forEach((card) => {

      const searchableText =
        (
          card.dataset.search || ""
        ).toLowerCase();

      const category =
        card.dataset.category || "";

      const availability =
        card.dataset.availability || "";

      const matchesSearch =
        !searchTerm ||
        searchableText.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const matchesAvailability =
        selectedAvailability === "all" ||
        availability === selectedAvailability;

      const visible =
        matchesSearch &&
        matchesCategory &&
        matchesAvailability;

      card.style.display =
        visible ? "" : "none";

      if (visible) {
        visibleCount++;
      }

    });

    if (noServicesMessage) {
      noServicesMessage.hidden =
        visibleCount !== 0;
    }

  }


  if (serviceSearch) {
    serviceSearch.addEventListener(
      "input",
      filterServices
    );
  }

  if (serviceCategory) {
    serviceCategory.addEventListener(
      "change",
      filterServices
    );
  }

  if (serviceAvailability) {
    serviceAvailability.addEventListener(
      "change",
      filterServices
    );
  }

  if (clearServiceFilters) {

    clearServiceFilters.addEventListener(
      "click",
      () => {

        if (serviceSearch) {
          serviceSearch.value = "";
        }

        if (serviceCategory) {
          serviceCategory.value = "all";
        }

        if (serviceAvailability) {
          serviceAvailability.value = "all";
        }

        filterServices();

      }
    );

  }


  /* =======================================================
     9. TOOLS SEARCH & FILTER
  ======================================================= */

  const toolSearch =
    document.getElementById("toolSearch");

  const toolCategory =
    document.getElementById("toolCategory");

  const toolsGrid =
    document.getElementById("toolsGrid");

  const noToolsMessage =
    document.getElementById("noToolsMessage");

  const clearToolFilters =
    document.getElementById("clearToolFilters");


  function filterTools() {

    if (!toolsGrid) {
      return;
    }

    const cards =
      toolsGrid.querySelectorAll(".tool-card");

    const searchTerm =
      toolSearch
        ? toolSearch.value.toLowerCase().trim()
        : "";

    const selectedCategory =
      toolCategory
        ? toolCategory.value
        : "all";

    let visibleCount = 0;

    cards.forEach((card) => {

      const searchableText =
        (
          card.dataset.search || ""
        ).toLowerCase();

      const category =
        card.dataset.category || "";

      const matchesSearch =
        !searchTerm ||
        searchableText.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const visible =
        matchesSearch &&
        matchesCategory;

      card.style.display =
        visible ? "" : "none";

      if (visible) {
        visibleCount++;
      }

    });

    if (noToolsMessage) {
      noToolsMessage.hidden =
        visibleCount !== 0;
    }

  }


  if (toolSearch) {
    toolSearch.addEventListener(
      "input",
      filterTools
    );
  }

  if (toolCategory) {
    toolCategory.addEventListener(
      "change",
      filterTools
    );
  }

  if (clearToolFilters) {

    clearToolFilters.addEventListener(
      "click",
      () => {

        if (toolSearch) {
          toolSearch.value = "";
        }

        if (toolCategory) {
          toolCategory.value = "all";
        }

        filterTools();

      }
    );

  }


  /* =======================================================
     10. UNIT CONVERTER
  ======================================================= */

  const convertUnitBtn =
    document.getElementById("convertUnitBtn");

  const unitValue =
    document.getElementById("unitValue");

  const unitFrom =
    document.getElementById("unitFrom");

  const unitTo =
    document.getElementById("unitTo");

  const unitResult =
    document.getElementById("unitResult");


  if (convertUnitBtn) {

    convertUnitBtn.addEventListener(
      "click",
      () => {

        const value =
          Number(unitValue?.value);

        const from =
          unitFrom?.value;

        const to =
          unitTo?.value;

        if (!Number.isFinite(value)) {

          if (unitResult) {
            unitResult.textContent =
              "Please enter a valid number.";
          }

          return;
        }

        /*
         * Base conversion table.
         * Length and weight are kept separate
         * to prevent invalid conversions.
         */

        const lengthUnits = {
          m: 1,
          km: 1000,
          cm: 0.01
        };

        const weightUnits = {
          kg: 1,
          g: 0.001
        };

        let result = null;

        if (
          lengthUnits[from] &&
          lengthUnits[to]
        ) {

          result =
            value *
            lengthUnits[from] /
            lengthUnits[to];

        } else if (
          weightUnits[from] &&
          weightUnits[to]
        ) {

          result =
            value *
            weightUnits[from] /
            weightUnits[to];

        }

        if (result === null) {

          if (unitResult) {
            unitResult.textContent =
              "These units cannot be converted together.";
          }

          return;
        }

        if (unitResult) {

          unitResult.textContent =
            `${value} ${from} = ${result} ${to}`;

        }

      }
    );

  }


  /* =======================================================
     11. CURRENCY INFORMATION PLACEHOLDER
  ======================================================= */

  const currencyInfoBtn =
    document.getElementById("currencyInfoBtn");

  const currencyAmount =
    document.getElementById("currencyAmount");

  const currencyFrom =
    document.getElementById("currencyFrom");

  const currencyTo =
    document.getElementById("currencyTo");

  const currencyResult =
    document.getElementById("currencyResult");


  if (currencyInfoBtn) {

    currencyInfoBtn.addEventListener(
      "click",
      () => {

        const amount =
          Number(currencyAmount?.value);

        const from =
          currencyFrom?.value;

        const to =
          currencyTo?.value;

        if (!Number.isFinite(amount)) {

          if (currencyResult) {
            currencyResult.textContent =
              "Please enter a valid amount.";
          }

          return;
        }

        /*
         * No exchange rate is invented here.
         * Live rates will later come from a verified
         * backend/data source.
         */

        if (currencyResult) {

          currencyResult.textContent =
            `${amount} ${from} → ${to}. Live exchange-rate data will be connected through the BISOVIA backend.`;

        }

      }
    );

  }


  /* =======================================================
     12. CURRENT DATE & TIME
  ======================================================= */

  const currentDateTime =
    document.getElementById("currentDateTime");

  const refreshTimeBtn =
    document.getElementById("refreshTimeBtn");


  function updateDateTime() {

    if (!currentDateTime) {
      return;
    }

    const now =
      new Date();

    currentDateTime.textContent =
      now.toLocaleString(
        undefined,
        {
          dateStyle: "medium",
          timeStyle: "medium"
        }
      );

  }


  updateDateTime();

  if (refreshTimeBtn) {

    refreshTimeBtn.addEventListener(
      "click",
      updateDateTime
    );

  }


  /* =======================================================
     13. BASIC CALCULATOR
  ======================================================= */

  const calculateBtn =
    document.getElementById("calculateBtn");

  const calculatorInput =
    document.getElementById("calculatorInput");

  const calculatorResult =
    document.getElementById("calculatorResult");


  if (calculateBtn) {

    calculateBtn.addEventListener(
      "click",
      () => {

        const expression =
          calculatorInput
            ? calculatorInput.value.trim()
            : "";

        if (!expression) {

          if (calculatorResult) {
            calculatorResult.textContent =
              "Enter a calculation first.";
          }

          return;
        }

        /*
         * Only allow simple arithmetic characters.
         * No arbitrary JavaScript expressions are executed.
         */

        const safeExpression =
          /^[0-9+\-*/().%\s]+$/.test(
            expression
          );

        if (!safeExpression) {

          if (calculatorResult) {
            calculatorResult.textContent =
              "Only basic arithmetic expressions are allowed.";
          }

          return;
        }

        try {

          /*
           * The expression has already passed a strict
           * arithmetic-character validation.
           */

          const result =
            Function(
              `"use strict"; return (${expression})`
            )();

          if (
            typeof result !== "number" ||
            !Number.isFinite(result)
          ) {
            throw new Error("Invalid result");
          }

          if (calculatorResult) {
            calculatorResult.textContent =
              `Result: ${result}`;
          }

        } catch (error) {

          if (calculatorResult) {
            calculatorResult.textContent =
              "Unable to calculate this expression.";
          }

        }

      }
    );

  }


  /* =======================================================
     14. BOOKING SERVICE PARAMETER
  ======================================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const selectedService =
    params.get("service");

  if (selectedService) {

    localStorage.setItem(
      "bisoviaSelectedUtilityService",
      selectedService
    );

  }


  /* =======================================================
     15. GENERIC FORM FEEDBACK
  ======================================================= */

  const utilityForms =
    document.querySelectorAll(
      "[data-utility-form]"
    );

  utilityForms.forEach((form) => {

    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const message =
          form.querySelector(
            "[data-form-message]"
          );

        if (message) {

          message.textContent =
            "Your request has been prepared. Backend submission will be connected later.";

        }

      }
    );

  });

});
