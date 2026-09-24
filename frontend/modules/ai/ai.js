
/* =========================================
   BISOVIA AI MODULE
   frontend/modules/ai/ai.js
========================================= */

(function () {
  "use strict";

  /* -----------------------------------------
     ELEMENTS
  ----------------------------------------- */

  const form = document.getElementById("ai-form");
  const input = document.getElementById("ai-input");
  const sendButton = document.getElementById("ai-send");
  const conversation = document.getElementById("ai-conversation");
  const status = document.getElementById("ai-status");


  /* -----------------------------------------
     CONFIGURATION
  ----------------------------------------- */

  /*
   * Backend endpoint will be connected later.
   * Do NOT put secret API keys here.
   */
  const AI_API_ENDPOINT = "/api/ai";


  /* -----------------------------------------
     INITIALIZATION
  ----------------------------------------- */

  function initAI() {
    if (!form || !input || !conversation) {
      return;
    }

    form.addEventListener("submit", handleSubmit);

    input.addEventListener("keydown", handleInputKeydown);

    updateStatus("ready");
  }


  /* -----------------------------------------
     FORM SUBMISSION
  ----------------------------------------- */

  async function handleSubmit(event) {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) {
      return;
    }

    addMessage(message, "user");

    input.value = "";

    setLoading(true);

    try {
      const response = await sendMessageToBackend(message);

      if (response && response.reply) {
        addMessage(response.reply, "system");
      } else {
        addMessage(
          "AI response is not available yet.",
          "error"
        );
      }

    } catch (error) {
      console.error("BISOVIA AI error:", error);

      /*
       * During frontend development, the backend
       * may not exist yet. We keep the interface
       * functional without exposing technical errors.
       */
      addMessage(
        "BISOVIA AI is being connected to its backend.",
        "error"
      );

    } finally {
      setLoading(false);
      input.focus();
    }
  }


  /* -----------------------------------------
     KEYBOARD
  ----------------------------------------- */

  function handleInputKeydown(event) {
    /*
     * Enter sends the message.
     * Shift + Enter can still create a new line
     * if the input is later changed to a textarea.
     */
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (form) {
        form.requestSubmit();
      }
    }
  }


  /* -----------------------------------------
     SEND TO BACKEND
  ----------------------------------------- */

  async function sendMessageToBackend(message) {

    /*
     * The endpoint is intentionally kept here
     * for the future BISOVIA backend.
     *
     * No database access happens from the AI
     * frontend module.
     */

    const response = await fetch(AI_API_ENDPOINT, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      credentials: "include",

      body: JSON.stringify({
        message: message
      })
    });


    if (!response.ok) {
      throw new Error(
        `AI request failed: ${response.status}`
      );
    }


    return await response.json();
  }


  /* -----------------------------------------
     ADD MESSAGE
  ----------------------------------------- */

  function addMessage(message, type) {

    if (!conversation) {
      return;
    }


    const wrapper = document.createElement("div");

    wrapper.className = "ai-message";


    if (type === "user") {
      wrapper.classList.add("ai-message-user");
    } else if (type === "error") {
      wrapper.classList.add("ai-message-error");
    } else {
      wrapper.classList.add("ai-message-system");
    }


    const content = document.createElement("div");

    content.className = "ai-message-content";


    if (type === "user") {

      const text = document.createElement("p");

      text.textContent = message;

      content.appendChild(text);

    } else {

      const text = document.createElement("p");

      text.textContent = message;

      content.appendChild(text);
    }


    wrapper.appendChild(content);

    conversation.appendChild(wrapper);


    /*
     * Always show the newest message.
     */
    conversation.scrollTop = conversation.scrollHeight;
  }


  /* -----------------------------------------
     LOADING STATE
  ----------------------------------------- */

  function setLoading(isLoading) {

    if (sendButton) {
      sendButton.disabled = isLoading;
    }

    if (input) {
      input.disabled = isLoading;
    }

    if (isLoading) {
      updateStatus("thinking");
    } else {
      updateStatus("ready");
    }
  }


  /* -----------------------------------------
     STATUS
  ----------------------------------------- */

  function updateStatus(state) {

    if (!status) {
      return;
    }


    /*
     * These keys can later be translated
     * through the BISOVIA Core language system.
     */

    const statusKeys = {
      ready: "Ready",
      thinking: "Thinking..."
    };


    status.textContent =
      statusKeys[state] || statusKeys.ready;
  }


  /* -----------------------------------------
     PUBLIC MODULE API
  ----------------------------------------- */

  window.BISOVIA_AI = {

    sendMessage: sendMessageToBackend,

    addMessage: addMessage,

    setLoading: setLoading,

    updateStatus: updateStatus

  };


  /* -----------------------------------------
     START
  ----------------------------------------- */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initAI
    );

  } else {

    initAI();
  }

})();
