/* =========================================================
   BISOVIA TRANSLATION SYSTEM
   EN / FR / RN / SW
   ========================================================= */

(function () {
  "use strict";

  const LANGUAGES = ["en", "fr", "rn", "sw"];
  const STORAGE_KEY = "bisovia-language";
  const DEFAULT_LANGUAGE = "en";

  let currentLanguage =
    localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;

  if (!LANGUAGES.includes(currentLanguage)) {
    currentLanguage = DEFAULT_LANGUAGE;
  }

  let dictionaries = {};

  /* =======================================================
     DICTIONARIES
     ======================================================= */

  dictionaries.en = {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.providers": "Providers",
    "nav.requests": "Requests",
    "nav.booking": "Booking",
    "nav.payments": "Payments",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.about": "About",

    "common.loading": "Loading...",
    "common.search": "Search",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",

    "theme.light": "Light",
    "theme.dark": "Dark",

    "language.select": "Language",

    "pi.ready": "Pi connection is ready",
    "pi.unavailable": "Pi connection is unavailable",

    "footer.rights": "All rights reserved.",

    "home.title": "Utility starts here",
    "home.subtitle":
      "A Pi-native utility platform built for practical digital services and community interaction.",

    "services.title": "Services",
    "providers.title": "Service Providers",
    "requests.title": "Requests",
    "booking.title": "Booking",
    "payments.title": "Payments"
  };

  dictionaries.fr = {
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.providers": "Prestataires",
    "nav.requests": "Demandes",
    "nav.booking": "Réservation",
    "nav.payments": "Paiements",
    "nav.profile": "Profil",
    "nav.settings": "Paramètres",
    "nav.about": "À propos",

    "common.loading": "Chargement...",
    "common.search": "Rechercher",
    "common.submit": "Envoyer",
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.close": "Fermer",
    "common.back": "Retour",
    "common.next": "Suivant",

    "theme.light": "Clair",
    "theme.dark": "Sombre",

    "language.select": "Langue",

    "pi.ready": "La connexion Pi est prête",
    "pi.unavailable": "La connexion Pi n'est pas disponible",

    "footer.rights": "Tous droits réservés.",

    "home.title": "L'utilité commence ici",
    "home.subtitle":
      "Une plateforme utilitaire native de Pi pour les services numériques pratiques et l'interaction communautaire.",

    "services.title": "Services",
    "providers.title": "Prestataires de services",
    "requests.title": "Demandes",
    "booking.title": "Réservation",
    "payments.title": "Paiements"
  };

  dictionaries.rn = {
    "nav.home": "Ahabanza",
    "nav.services": "Serivisi",
    "nav.providers": "Abatanga serivisi",
    "nav.requests": "Amasaba",
    "nav.booking": "Kwiyandikisha",
    "nav.payments": "Kwishura",
    "nav.profile": "Umwirondoro",
    "nav.settings": "Amagenamiterere",
    "nav.about": "Ibitwerekeye",

    "common.loading": "Biriko birategurwa...",
    "common.search": "Rondera",
    "common.submit": "Rungika",
    "common.cancel": "Hagarika",
    "common.save": "Bika",
    "common.close": "Funga",
    "common.back": "Subira inyuma",
    "common.next": "Kurikira",

    "theme.light": "Umuco",
    "theme.dark": "Umwijima",

    "language.select": "Ururimi",

    "pi.ready": "Ukwiyunga na Pi kwiteguye",
    "pi.unavailable": "Ukwiyunga na Pi ntikuboneka",

    "footer.rights": "Uburenganzira bwose burakingiwe.",

    "home.title": "Akamaro gatangurira hano",
    "home.subtitle":
      "Urubuga rwa Pi rwubakiye kuri serivisi ngirakamaro za digitale n'ugukorana kw'abanyagihugu.",

    "services.title": "Serivisi",
    "providers.title": "Abatanga serivisi",
    "requests.title": "Amasaba",
    "booking.title": "Kwiyandikisha",
    "payments.title": "Kwishura"
  };

  dictionaries.sw = {
    "nav.home": "Mwanzo",
    "nav.services": "Huduma",
    "nav.providers": "Watoa huduma",
    "nav.requests": "Maombi",
    "nav.booking": "Uhifadhi",
    "nav.payments": "Malipo",
    "nav.profile": "Wasifu",
    "nav.settings": "Mipangilio",
    "nav.about": "Kuhusu",

    "common.loading": "Inapakia...",
    "common.search": "Tafuta",
    "common.submit": "Tuma",
    "common.cancel": "Ghairi",
    "common.save": "Hifadhi",
    "common.close": "Funga",
    "common.back": "Rudi",
    "common.next": "Ifuatayo",

    "theme.light": "Mwanga",
    "theme.dark": "Giza",

    "language.select": "Lugha",

    "pi.ready": "Muunganisho wa Pi uko tayari",
    "pi.unavailable": "Muunganisho wa Pi haupatikani",

    "footer.rights": "Haki zote zimehifadhiwa.",

    "home.title": "Huduma huanzia hapa",
    "home.subtitle":
      "Jukwaa la huduma za kidijitali la Pi lililojengwa kwa huduma za vitendo na mwingiliano wa jamii.",

    "services.title": "Huduma",
    "providers.title": "Watoa huduma",
    "requests.title": "Maombi",
    "booking.title": "Uhifadhi",
    "payments.title": "Malipo"
  };

  /* =======================================================
     TRANSLATION
     ======================================================= */

  function translate(key) {
    const dictionary = dictionaries[currentLanguage];

    if (
      dictionary &&
      Object.prototype.hasOwnProperty.call(dictionary, key)
    ) {
      return dictionary[key];
    }

    if (
      dictionaries[DEFAULT_LANGUAGE] &&
      dictionaries[DEFAULT_LANGUAGE][key]
    ) {
      return dictionaries[DEFAULT_LANGUAGE][key];
    }

    return key;
  }

  /* =======================================================
     APPLY TRANSLATION
     ======================================================= */

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");

      if (!key) return;

      element.textContent = translate(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const key = element.getAttribute("data-i18n-html");

      if (!key) return;

      element.innerHTML = translate(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");

      if (!key) return;

      element.setAttribute(
        "placeholder",
        translate(key)
      );
    });

    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      const key = element.getAttribute("data-i18n-title");

      if (!key) return;

      element.setAttribute(
        "title",
        translate(key)
      );
    });

    updateLanguageButtons();

    document.dispatchEvent(
      new CustomEvent("bisovia:translationsApplied", {
        detail: {
          language: currentLanguage
        }
      })
    );
  }

  /* =======================================================
     LANGUAGE
     ======================================================= */

  function setLanguage(language) {
    if (!LANGUAGES.includes(language)) {
      console.warn(
        "BISOVIA: unsupported language:",
        language
      );
      return;
    }

    currentLanguage = language;

    localStorage.setItem(
      STORAGE_KEY,
      currentLanguage
    );

    applyTranslations();
  }

  function getLanguage() {
    return currentLanguage;
  }

  function updateLanguageButtons() {
    document
      .querySelectorAll("[data-language]")
      .forEach((button) => {
        const language =
          button.getAttribute("data-language");

        button.classList.toggle(
          "active",
          language === currentLanguage
        );

        button.setAttribute(
          "aria-current",
          language === currentLanguage
            ? "true"
            : "false"
        );
      });
  }

  /* =======================================================
     OBSERVER
     ======================================================= */

  const observer = new MutationObserver(() => {
    applyTranslations();
  });

  function init() {
    applyTranslations();

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.info(
      "BISOVIA Translation initialized:",
      currentLanguage
    );
  }

  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.BISOVIA_TRANSLATE = function (language) {
    setLanguage(language);
  };

  window.BISOVIA_TRANSLATION = {
    setLanguage,
    getLanguage,
    translate,
    applyTranslations,
    languages: LANGUAGES
  };

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
