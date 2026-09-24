
/**
 * BISOVIA — AI Guide Module
 * Path: frontend/modules/ai/guide.js
 *
 * Purpose:
 * - Provide contextual guidance to BISOVIA users
 * - Help users understand services and workflows
 * - Give safe, simple next-step recommendations
 *
 * This module does NOT:
 * - Process payments
 * - Access Pi credentials
 * - Access the database directly
 * - Make financial or security decisions
 */

(function () {
  "use strict";

  const Guide = {

    name: "BISOVIA AI Guide",
    version: "1.0.0",

    /**
     * Available guide topics
     */
    topics: {
      GENERAL: "general",
      MOBILITY: "mobility",
      AUTO: "auto",
      HOSPITALITY: "hospitality",
      COMMUNITY: "community",
      UTILITIES: "utilities",
      PAYMENTS: "payments",
      PROFILE: "profile",
      TRUST: "trust",
      SECURITY: "security"
    },

    /**
     * Basic guidance messages
     */
    messages: {

      general: {
        title: "Welcome to BISOVIA",
        message:
          "Choose a service, review the available options, and follow the steps shown on screen."
      },

      mobility: {
        title: "Mobility Guide",
        message:
          "Choose a mobility service, review the provider and service details, then continue with your request or booking."
      },

      auto: {
        title: "Vehicle Services Guide",
        message:
          "Select a vehicle service or garage, review the service details, and submit your request."
      },

      hospitality: {
        title: "Hospitality Guide",
        message:
          "Explore accommodations, meals, or events, then select a provider and continue with your booking."
      },

      community: {
        title: "Community Guide",
        message:
          "Explore community services and events, review providers, and submit a request when you are ready."
      },

      utilities: {
        title: "Digital Utilities Guide",
        message:
          "Choose a practical digital utility, review its instructions, and follow the required steps."
      },

      payments: {
        title: "Payment Guide",
        message:
          "Review the service and amount carefully before confirming a Pi payment."
      },

      profile: {
        title: "Profile Guide",
        message:
          "Keep your BISOVIA profile information accurate so providers and services can work with the correct information."
      },

      trust: {
        title: "Trust & Safety Guide",
        message:
          "Review ratings, reports, and service information before interacting with a provider."
      },

      security: {
        title: "Security Guide",
        message:
          "Never share passwords, private keys, wallet credentials, or sensitive authentication information."
      }
    },

    /**
     * Get guidance for a specific topic.
     */
    getGuide(topic = this.topics.GENERAL) {

      const selectedTopic = String(topic).toLowerCase();

      return (
        this.messages[selectedTopic] ||
        this.messages[this.topics.GENERAL]
      );
    },

    /**
     * Get a simple next step.
     */
    getNextStep(topic = this.topics.GENERAL) {

      const steps = {

        general:
          "Select a BISOVIA service to continue.",

        mobility:
          "Choose a mobility service and review the provider details.",

        auto:
          "Choose a vehicle service or garage.",

        hospitality:
          "Choose accommodation, meals, or an event.",

        community:
          "Explore a community service or event.",

        utilities:
          "Choose the digital utility you need.",

        payments:
          "Review the payment information before confirming.",

        profile:
          "Review and update your profile information.",

        trust:
          "Check provider information, ratings, and reports.",

        security:
          "Verify the information before continuing."
      };

      return steps[selectedTopic] || steps.general;
    },

    /**
     * Build a complete contextual guide.
     */
    createGuide(topic = this.topics.GENERAL) {

      const guide = this.getGuide(topic);
      const nextStep = this.getNextStep(topic);

      return {
        module: this.name,
        version: this.version,
        topic: String(topic).toLowerCase(),
        title: guide.title,
        message: guide.message,
        nextStep: nextStep,
        timestamp: new Date().toISOString()
      };
    },

    /**
     * Display guidance inside an element.
     *
     * Example:
     * Guide.render("#ai-guide", "mobility");
     */
    render(selector, topic = this.topics.GENERAL) {

      const element = document.querySelector(selector);

      if (!element) {
        return false;
      }

      const guide = this.createGuide(topic);

      element.innerHTML = `
        <div class="ai-guide-content">
          <h3>${this.escapeHTML(guide.title)}</h3>

          <p>
            ${this.escapeHTML(guide.message)}
          </p>

          <p class="ai-guide-next">
            <strong>Next step:</strong>
            ${this.escapeHTML(guide.nextStep)}
          </p>
        </div>
      `;

      return true;
    },

    /**
     * Safely escape text before inserting it into HTML.
     */
    escapeHTML(value) {

      const div = document.createElement("div");

      div.textContent = String(value);

      return div.innerHTML;
    },

    /**
     * Return all available topics.
     */
    getTopics() {

      return Object.values(this.topics);
    }
  };

  // ----------------------------------------------------
  // Register BISOVIA AI Guide
  // ----------------------------------------------------

  window.BISOVIA = window.BISOVIA || {};
  window.BISOVIA.AI = window.BISOVIA.AI || {};

  window.BISOVIA.AI.Guide = Guide;

})();
