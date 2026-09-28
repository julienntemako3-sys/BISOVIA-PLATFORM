(function () {
  "use strict";

  window.BISOVIA = window.BISOVIA || {};

  BISOVIA.config = {
    appName: "BISOVIA",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fr", "rn", "sw"],
    languageStorageKey: "bisovia-language"
  };

  BISOVIA.ready = function (callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  };

  BISOVIA.go = function (url) {
    if (!url) return;
    window.location.href = url;
  };

  BISOVIA.log = function () {
    if (window.console) {
      console.log.apply(console, arguments);
    }
  };
})();
