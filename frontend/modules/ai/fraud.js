
/**
 * BISOVIA — AI Fraud Detection Module
 * Path: frontend/modules/ai/fraud.js
 *
 * Purpose:
 * - Detect suspicious activity patterns
 * - Produce a risk assessment
 * - Never make final account/payment decisions alone
 *
 * Frontend-safe:
 * - No private keys
 * - No Pi credentials
 * - No database access
 * - No payment completion logic
 */

(function () {
  "use strict";

  const Fraud = {

    name: "BISOVIA Fraud Detection",
    version: "1.0.0",

    /**
     * Basic risk levels
     */
    riskLevels: {
      LOW: "low",
      MEDIUM: "medium",
      HIGH: "high",
      CRITICAL: "critical"
    },

    /**
     * Analyze an activity/event.
     *
     * Expected data example:
     * {
     *   type: "payment",
     *   amount: 0.2,
     *   currency: "Pi",
     *   userId: "...",
     *   newDevice: false,
     *   rapidActions: false,
     *   unusualLocation: false,
     *   failedAttempts: 0
     * }
     */
    analyze(activity = {}) {

      let score = 0;
      const reasons = [];

      // --------------------------------------------------
      // 1. Failed attempts
      // --------------------------------------------------
      const failedAttempts = Number(activity.failedAttempts || 0);

      if (failedAttempts >= 3) {
        score += 20;
        reasons.push("Multiple failed attempts detected.");
      }

      if (failedAttempts >= 6) {
        score += 20;
        reasons.push("High number of failed attempts.");
      }

      // --------------------------------------------------
      // 2. New device
      // --------------------------------------------------
      if (activity.newDevice === true) {
        score += 15;
        reasons.push("Activity originated from a new device.");
      }

      // --------------------------------------------------
      // 3. Unusual location
      // --------------------------------------------------
      if (activity.unusualLocation === true) {
        score += 20;
        reasons.push("Activity differs from the user's usual pattern.");
      }

      // --------------------------------------------------
      // 4. Rapid repeated actions
      // --------------------------------------------------
      if (activity.rapidActions === true) {
        score += 20;
        reasons.push("Repeated actions occurred within a short period.");
      }

      // --------------------------------------------------
      // 5. Unusually large transaction
      // --------------------------------------------------
      const amount = Number(activity.amount || 0);

      if (amount > 100) {
        score += 15;
        reasons.push("Transaction amount is unusually high.");
      }

      if (amount > 500) {
        score += 20;
        reasons.push("Transaction amount requires additional verification.");
      }

      // --------------------------------------------------
      // 6. Suspicious activity flag
      // --------------------------------------------------
      if (activity.suspicious === true) {
        score += 30;
        reasons.push("Activity was previously flagged as suspicious.");
      }

      // --------------------------------------------------
      // Limit score
      // --------------------------------------------------
      score = Math.min(score, 100);

      // --------------------------------------------------
      // Determine risk level
      // --------------------------------------------------
      let level = this.riskLevels.LOW;

      if (score >= 75) {
        level = this.riskLevels.CRITICAL;
      } else if (score >= 50) {
        level = this.riskLevels.HIGH;
      } else if (score >= 25) {
        level = this.riskLevels.MEDIUM;
      }

      return {
        score,
        level,
        reasons,
        requiresReview: score >= 50,
        analyzedAt: new Date().toISOString()
      };
    },

    /**
     * Quick check for a payment.
     */
    checkPayment(payment = {}) {

      return this.analyze({
        type: "payment",
        amount: payment.amount,
        currency: payment.currency || "Pi",
        newDevice: payment.newDevice,
        unusualLocation: payment.unusualLocation,
        rapidActions: payment.rapidActions,
        failedAttempts: payment.failedAttempts,
        suspicious: payment.suspicious
      });
    },

    /**
     * Quick check for login/authentication activity.
     */
    checkLogin(login = {}) {

      return this.analyze({
        type: "login",
        newDevice: login.newDevice,
        unusualLocation: login.unusualLocation,
        rapidActions: login.rapidActions,
        failedAttempts: login.failedAttempts,
        suspicious: login.suspicious
      });
    },

    /**
     * Returns true when the activity should be
     * sent to Core/backend for additional review.
     */
    shouldReview(activity = {}) {

      const result = this.analyze(activity);

      return result.requiresReview === true;
    },

    /**
     * Prepare a safe fraud report.
     */
    createReport(activity = {}) {

      const result = this.analyze(activity);

      return {
        module: this.name,
        version: this.version,
        risk: result.level,
        score: result.score,
        requiresReview: result.requiresReview,
        reasons: result.reasons,
        timestamp: result.analyzedAt
      };
    }
  };

  // ----------------------------------------------------
  // Expose module
  // ----------------------------------------------------

  window.BISOVIA = window.BISOVIA || {};
  window.BISOVIA.AI = window.BISOVIA.AI || {};

  window.BISOVIA.AI.Fraud = Fraud;

})();
