/**
 * BISOVIA CORE
 * Pi Identity & Authentication
 *
 * Responsibilities:
 * - Initialize Pi SDK
 * - Handle Pi Sign-In
 * - Store the BISOVIA frontend session
 * - Provide authentication state
 * - Provide logout
 *
 * IMPORTANT:
 * Pi App Secret and server-side verification
 * must NEVER be placed in this frontend file.
 */

const BISOVIA_AUTH = {

  /* =========================
     CONFIGURATION
  ========================= */

  piInitialized: false,

  sandbox: true,

  sessionKey: "bisovia_auth_session",


  /* =========================
     INITIALIZE PI
  ========================= */

  async initPi() {

    if (this.piInitialized) {
      return true;
    }

    if (typeof window.Pi === "undefined") {

      console.warn(
        "BISOVIA: Pi SDK is not available."
      );

      return false;
    }

    try {

      window.Pi.init({
        version: "2.0",
        sandbox: this.sandbox
      });

      this.piInitialized = true;

      console.log(
        "BISOVIA: Pi SDK initialized."
      );

      return true;

    } catch (error) {

      console.error(
        "BISOVIA: Pi initialization failed.",
        error
      );

      return false;
    }
  },


  /* =========================
     PI SIGN-IN
  ========================= */

  async signIn() {

    const initialized =
      await this.initPi();

    if (!initialized) {

      throw new Error(
        "Pi is not available. Please open BISOVIA inside Pi Browser."
      );
    }


    try {

      const scopes = [
        "username",
        "payments"
      ];


      const authResult =
        await window.Pi.authenticate(
          scopes,
          this.onIncompletePaymentFound.bind(this)
        );


      if (!authResult || !authResult.user) {

        throw new Error(
          "BISOVIA could not complete Pi authentication."
        );
      }


      const user = authResult.user;


      /*
       * Keep only safe client-side identity information.
       *
       * Server-side verification will happen later
       * when the BISOVIA backend is connected.
       */

      const session = {

        authenticated: true,

        uid: user.uid || null,

        username: user.username || null,

        authenticatedAt:
          new Date().toISOString()

      };


      localStorage.setItem(
        this.sessionKey,
        JSON.stringify(session)
      );


      window.dispatchEvent(
        new CustomEvent(
          "bisovia:auth",
          {
            detail: session
          }
        )
      );


      return session;

    } catch (error) {

      console.error(
        "BISOVIA: Pi authentication failed.",
        error
      );

      throw error;
    }
  },


  /* =========================
     INCOMPLETE PAYMENTS
  ========================= */

  onIncompletePaymentFound(payment) {

    console.log(
      "BISOVIA: Incomplete Pi payment found.",
      payment
    );

    /*
     * Payment recovery will be handled by
     * the BISOVIA Core Payments service.
     *
     * Do not complete or modify payments here.
     */
  },


  /* =========================
     GET SESSION
  ========================= */

  getSession() {

    const stored =
      localStorage.getItem(
        this.sessionKey
      );


    if (!stored) {
      return null;
    }


    try {

      return JSON.parse(stored);

    } catch (error) {

      localStorage.removeItem(
        this.sessionKey
      );

      return null;
    }
  },


  /* =========================
     AUTH STATUS
  ========================= */

  isAuthenticated() {

    const session =
      this.getSession();

    return Boolean(
      session &&
      session.authenticated
    );
  },


  /* =========================
     CURRENT USER
  ========================= */

  getCurrentUser() {

    const session =
      this.getSession();

    if (!session) {
      return null;
    }


    return {

      uid: session.uid,

      username: session.username

    };
  },


  /* =========================
     LOGOUT
  ========================= */

  logout() {

    localStorage.removeItem(
      this.sessionKey
    );


    window.dispatchEvent(
      new CustomEvent(
        "bisovia:logout"
      )
    );


    return true;
  }

};


/**
 * Expose BISOVIA Auth globally.
 *
 * Other Core services and pages can use:
 *
 * BISOVIA_AUTH.initPi()
 * BISOVIA_AUTH.signIn()
 * BISOVIA_AUTH.getSession()
 * BISOVIA_AUTH.isAuthenticated()
 * BISOVIA_AUTH.getCurrentUser()
 * BISOVIA_AUTH.logout()
 */

window.BISOVIA_AUTH =
  BISOVIA_AUTH;
