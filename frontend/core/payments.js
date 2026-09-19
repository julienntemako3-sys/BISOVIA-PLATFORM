/**
 * BISOVIA CORE
 * Pi Wallet & Payments
 *
 * Responsibilities:
 * - Initialize Pi Payments
 * - Create Pi payments
 * - Handle approve / complete callbacks
 * - Handle cancelled payments
 * - Provide a common payment contract for all modules
 *
 * IMPORTANT:
 * The Pi App Secret MUST NEVER be stored in frontend code.
 *
 * Backend verification and payment recording will be added
 * when the BISOVIA backend is connected.
 */

const BISOVIA_PAYMENTS = {

  /* =========================
     CONFIGURATION
  ========================= */

  piInitialized: false,

  sandbox: true,


  /* =========================
     INITIALIZE PI PAYMENTS
  ========================= */

  async init() {

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
        "BISOVIA: Pi Payments initialized."
      );

      return true;

    } catch (error) {

      console.error(
        "BISOVIA: Pi Payments initialization failed.",
        error
      );

      return false;
    }
  },


  /* =========================
     CREATE PAYMENT
  ========================= */

  async createPayment({
    amount,
    memo = "BISOVIA payment",
    metadata = {}
  }) {

    const initialized =
      await this.init();

    if (!initialized) {

      throw new Error(
        "Pi is not available. Please open BISOVIA inside Pi Browser."
      );
    }


    if (
      typeof amount !== "number" ||
      amount <= 0
    ) {

      throw new Error(
        "Invalid Pi payment amount."
      );
    }


    try {

      const paymentData = {

        amount: amount,

        memo: memo,

        metadata: metadata

      };


      const payment =
        await window.Pi.createPayment(
          paymentData,
          {

            onReadyForServerApproval:
              this.approvePayment.bind(this),

            onReadyForServerCompletion:
              this.completePayment.bind(this),

            onCancel:
              this.cancelPayment.bind(this),

            onError:
              this.handleError.bind(this)

          }
        );


      return payment;

    } catch (error) {

      console.error(
        "BISOVIA: Unable to create Pi payment.",
        error
      );

      throw error;
    }
  },


  /* =========================
     SERVER APPROVAL
  ========================= */

  async approvePayment(paymentId) {

    console.log(
      "BISOVIA: Payment ready for server approval.",
      paymentId
    );


    /*
     * BACKEND CONNECTION — LATER
     *
     * The BISOVIA backend will:
     *
     * 1. Receive paymentId
     * 2. Verify the Pi payment
     * 3. Approve the payment through Pi API
     * 4. Record the payment state
     *
     * The Pi App Secret will exist ONLY on the backend.
     */


    try {

      if (
        window.BISOVIA_API &&
        window.BISOVIA_API.post
      ) {

        return await window.BISOVIA_API.post(
          "/api/payments/approve",
          {
            paymentId: paymentId
          }
        );

      }


      console.warn(
        "BISOVIA: Backend API is not connected yet."
      );

      return {
        success: false,
        pendingBackend: true,
        paymentId: paymentId
      };

    } catch (error) {

      console.error(
        "BISOVIA: Payment approval failed.",
        error
      );

      throw error;
    }
  },


  /* =========================
     SERVER COMPLETION
  ========================= */

  async completePayment(
    paymentId,
    txid
  ) {

    console.log(
      "BISOVIA: Payment ready for server completion.",
      {
        paymentId,
        txid
      }
    );


    /*
     * BACKEND CONNECTION — LATER
     *
     * The backend will:
     *
     * 1. Receive paymentId
     * 2. Receive transaction ID
     * 3. Verify the transaction with Pi
     * 4. Mark the payment as completed
     * 5. Record it in the BISOVIA payment journal
     */


    try {

      if (
        window.BISOVIA_API &&
        window.BISOVIA_API.post
      ) {

        return await window.BISOVIA_API.post(
          "/api/payments/complete",
          {
            paymentId: paymentId,
            txid: txid
          }
        );

      }


      console.warn(
        "BISOVIA: Backend API is not connected yet."
      );

      return {
        success: false,
        pendingBackend: true,
        paymentId: paymentId,
        txid: txid
      };

    } catch (error) {

      console.error(
        "BISOVIA: Payment completion failed.",
        error
      );

      throw error;
    }
  },


  /* =========================
     CANCEL PAYMENT
  ========================= */

  cancelPayment(paymentId) {

    console.log(
      "BISOVIA: Payment cancelled.",
      paymentId
    );


    window.dispatchEvent(
      new CustomEvent(
        "bisovia:payment-cancelled",
        {
          detail: {
            paymentId: paymentId
          }
        }
      )
    );


    return {
      success: false,
      cancelled: true,
      paymentId: paymentId
    };
  },


  /* =========================
     PAYMENT ERROR
  ========================= */

  handleError(error) {

    console.error(
      "BISOVIA: Pi payment error.",
      error
    );


    window.dispatchEvent(
      new CustomEvent(
        "bisovia:payment-error",
        {
          detail: {
            error: error
          }
        }
      )
    );


    return {
      success: false,
      error: error
    };
  },


  /* =========================
     PAYMENT CONTRACT
  ========================= */

  buildMetadata({
    bookingId = null,
    type = "general",
    module = null
  } = {}) {

    return {

      bookingId: bookingId,

      type: type,

      module: module

    };
  }

};


/**
 * Global BISOVIA Core access.
 *
 * Examples:
 *
 * BISOVIA_PAYMENTS.createPayment(...)
 *
 * BISOVIA_PAYMENTS.buildMetadata(...)
 */

window.BISOVIA_PAYMENTS =
  BISOVIA_PAYMENTS;
