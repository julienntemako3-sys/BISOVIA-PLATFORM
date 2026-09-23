
/* =========================================================
   BISOVIA — CORE INITIALIZER
   Connects Global + Theme + Translation + Pi
   ========================================================= */

(function () {
  "use strict";

  window.BISOVIA = window.BISOVIA || {};

  /* ---------------------------------------------------------
     PI INITIALIZATION
     --------------------------------------------------------- */
  function initPi() {
    if (!window.Pi) {
      return;
    }

    try {
      window.Pi.init({
        version: "2.0",
        sandbox: true
      });

      window.BISOVIA.pi = {
        initialized: true
      };

      document.dispatchEvent(
        new CustomEvent("bisovia:pi-ready")
      );

    } catch (error) {
      console.warn(
        "BISOVIA Pi initialization failed:",
        error
      );

      window.BISOVIA.pi = {
        initialized: false,
        error: error
      };
    }
  }

  /* ---------------------------------------------------------
     PI SIGN-IN
     --------------------------------------------------------- */
  async function signInWithPi() {
    if (!window.Pi) {
      alert("Pi Browser / Pi SDK is not available.");
      return null;
    }

    try {
      const scopes = ["username", "payments"];

      const authResult = await window.Pi.authenticate(
        scopes,
        function onIncompletePaymentFound(payment) {
          console.warn(
            "Incomplete Pi payment found:",
            payment
          );
        }
      );

      window.BISOVIA.piUser = authResult.user;

      document.dispatchEvent(
        new CustomEvent("bisovia:pi-authenticated", {
          detail: authResult
        })
      );

      return authResult;

    } catch (error) {
      console.error(
        "BISOVIA Pi authentication error:",
        error
      );

      alert(
        "Pi Sign-In could not be completed. Please try again inside Pi Browser."
      );

      return null;
    }
  }

  /* ---------------------------------------------------------
     CONNECT PI SIGN-IN BUTTONS
     --------------------------------------------------------- */
  function initPiSignIn() {
    const buttons = document.querySelectorAll(
      "#piSignIn, .pi-sign-in, [data-pi-signin]"
    );

    buttons.forEach((button) => {
      button.addEventListener("click", async function () {
        button.disabled = true;

        const originalText = button.textContent;

        try {
          button.textContent = "Connecting...";

          await signInWithPi();

          button.textContent = "Connected with Pi";

        } catch (error) {
          button.textContent = originalText;
        }

        setTimeout(() => {
          button.disabled = false;
        }, 1000);
      });
    });
  }

  /* ---------------------------------------------------------
     CORE READY EVENT
     --------------------------------------------------------- */
  function emitCoreReady() {
    document.dispatchEvent(
      new CustomEvent("bisovia:core-ready")
    );
  }

  /* ---------------------------------------------------------
     PUBLIC CORE API
     --------------------------------------------------------- */
  window.BISOVIA.core = {
    initPi,
    signInWithPi,
    initPiSignIn
  };

  /* ---------------------------------------------------------
     INITIALIZATION
     --------------------------------------------------------- */
  function initializeCore() {
    initPi();
    initPiSignIn();

    emitCoreReady();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeCore
    );
  } else {
    initializeCore();
  }

})();
