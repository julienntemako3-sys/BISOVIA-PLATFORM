
"use strict";

/*
 * BISOVIA
 * Frontend foundation
 *
 * Important:
 * - No private Pi API key belongs here.
 * - Pi SDK is initialized here.
 * - Authentication will be connected after backend verification exists.
 * - Payment flow will be connected only with the official Pi flow.
 */

const BISOVIA = {
  piInitialized: false,
  currentTheme: "light"
};


/* ---------------------------------
   DOM HELPERS
--------------------------------- */

function getElement(id) {
  return document.getElementById(id);
}


/* ---------------------------------
   PI SDK
--------------------------------- */

function initializePi() {
  const status = getElement("pi-status");

  if (!window.Pi) {
    if (status) {
      status.textContent =
        "Pi SDK is not available. Open BISOVIA inside Pi Browser.";
    }

    return;
  }

  try {
    /*
     * Sandbox is intentionally enabled during development.
     * It must be changed only when the production environment
     * is officially ready.
     */
    window.Pi.init({
      version: "2.0",
      sandbox: true
    });

    BISOVIA.piInitialized = true;

    if (status) {
      status.textContent =
        "Pi SDK initialized. BISOVIA is ready for Pi authentication.";
    }

  } catch (error) {

    console.error(
      "BISOVIA: Pi SDK initialization failed:",
      error
    );

    if (status) {
      status.textContent =
        "Pi SDK could not be initialized.";
    }
  }
}


/* ---------------------------------
   PI LOGIN
--------------------------------- */

async function handlePiLogin() {
  const button = getElement("pi-login");
  const status = getElement("pi-status");

  if (!BISOVIA.piInitialized) {
    if (status) {
      status.textContent =
        "Pi is not ready. Open this application inside Pi Browser.";
    }

    return;
  }

  if (!window.Pi) {
    return;
  }

  button.disabled = true;
  button.textContent = "Connecting...";

  try {

    /*
     * We request only the scopes needed for the current
     * authentication/payment-ready foundation.
     *
     * The backend verification endpoint will be added
     * before this authentication result is trusted.
     */
    const authResult = await window.Pi.authenticate(
      ["username", "payments"],
      handleIncompletePayment
    );

    console.log(
      "BISOVIA Pi authentication result:",
      authResult
    );

    if (status) {
      status.textContent =
        `Welcome, ${authResult.user.username}.`;
    }

    button.textContent = "Connected with Pi";

  } catch (error) {

    console.error(
      "BISOVIA: Pi authentication failed:",
      error
    );

    if (status) {
      status.textContent =
        "Pi authentication was cancelled or failed.";
    }

    button.disabled = false;
    button.textContent = "Sign in with Pi";
  }
}


/* ---------------------------------
   INCOMPLETE PAYMENT
--------------------------------- */

function handleIncompletePayment(payment) {
  console.warn(
    "BISOVIA: incomplete Pi payment detected:",
    payment
  );

  /*
   * We do NOT complete a payment from the frontend.
   *
   * According to Pi's developer documentation,
   * incomplete payments must be resolved through
   * the backend.
   *
   * Backend transaction handling will be added later.
   */
}


/* ---------------------------------
   MOBILE MENU
--------------------------------- */

function initializeMenu() {
  const toggle = getElement("menu-toggle");
  const navigation = getElement("main-navigation");

  if (!toggle || !navigation) {
    return;
  }

  toggle.addEventListener("click", () => {

    const isOpen =
      navigation.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  navigation
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener("click", () => {
        navigation.classList.remove("open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });

    });
}


/* ---------------------------------
   THEME
--------------------------------- */

function initializeTheme() {
  const toggle = getElement("theme-toggle");

  if (!toggle) {
    return;
  }

  const savedTheme =
    localStorage.getItem("bisovia-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    BISOVIA.currentTheme = "dark";
  }

  toggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    BISOVIA.currentTheme =
      document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem(
      "bisovia-theme",
      BISOVIA.currentTheme
    );
  });
}


/* ---------------------------------
   LANGUAGE
--------------------------------- */

function initializeLanguage() {
  const select = getElement("language-select");

  if (!select) {
    return;
  }

  const savedLanguage =
    localStorage.getItem("bisovia-language");

  if (savedLanguage) {
    select.value = savedLanguage;
  }

  select.addEventListener("change", () => {

    const language = select.value;

    localStorage.setItem(
      "bisovia-language",
      language
    );

    /*
     * Real translations will be introduced
     * through a dedicated translation system.
     *
     * We do not mix translation logic into
     * unrelated application logic.
     */

    console.info(
      "BISOVIA language selected:",
      language
    );
  });
}


/* ---------------------------------
   YEAR
--------------------------------- */

function initializeYear() {
  const year = getElement("current-year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
}


/* ---------------------------------
   APPLICATION START
--------------------------------- */

function startBISOVIA() {

  initializePi();

  initializeMenu();

  initializeTheme();

  initializeLanguage();

  initializeYear();

  const loginButton =
    getElement("pi-login");

  if (loginButton) {
    loginButton.addEventListener(
      "click",
      handlePiLogin
    );
  }

  console.info(
    "BISOVIA frontend initialized."
  );
}


/*
 * Wait until the document is ready.
 */
if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    startBISOVIA
  );

} else {

  startBISOVIA();

}
