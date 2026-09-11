"use strict";

/*
 * BISOVIA
 * Frontend foundation
 *
 * Includes:
 * - Pi SDK initialization
 * - Pi Sign-In
 * - Dark / Light theme
 * - EN / FR / RN / SW language switching
 * - Mobile navigation
 * - Current year
 */

const BISOVIA = {
  piInitialized: false,
  currentTheme: "light",
  currentLanguage: "en"
};


/* ---------------------------------
   DOM HELPERS
--------------------------------- */

function getElement(id) {
  return document.getElementById(id);
}


/* ---------------------------------
   TRANSLATIONS
--------------------------------- */

const translations = {

  en: {
    home: "Home",
    about: "About",
    services: "Services",
    community: "Community",
    contact: "Contact",

    signIn: "Sign in with Pi",
    connecting: "Connecting...",
    connected: "Connected with Pi",

    coreDirection: "CORE DIRECTION",
    platformTitle: "A platform built for real utility",
    platformDescription:
      "BISOVIA will grow through clearly separated modules, secure Pi integration and a structure that can evolve without rebuilding the entire application.",

    utility: "Utility",
    utilityText:
      "Practical digital services designed around actual user needs.",

    communityTitle: "Community",
    communityText:
      "A structured environment where users can interact around useful services and content.",

    piNative: "Pi-native",
    piNativeText:
      "Authentication and payments will use the official Pi SDK and Platform API.",

    expandable: "Expandable",
    expandableText:
      "The architecture will remain ready for future infrastructure such as SoloHost.",

    platformStatus: "PLATFORM STATUS",
    buildingTitle: "BISOVIA is being built step by step.",
    buildingText:
      "The first priority is a stable frontend foundation. Backend services, database integration and Pi transactions will be connected progressively.",

    foundation: "Foundation",

    footerText: "A new Pi-native utility platform.",
    aboutLink: "About",
    contactLink: "Contact"
  },


  fr: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    community: "Communauté",
    contact: "Contact",

    signIn: "Se connecter avec Pi",
    connecting: "Connexion...",
    connected: "Connecté avec Pi",

    coreDirection: "DIRECTION PRINCIPALE",
    platformTitle: "Une plateforme conçue pour une utilité réelle",
    platformDescription:
      "BISOVIA évoluera grâce à des modules clairement séparés, une intégration sécurisée de Pi et une architecture capable d'évoluer sans reconstruire toute l'application.",

    utility: "Utilité",
    utilityText:
      "Des services numériques pratiques conçus autour des besoins réels des utilisateurs.",

    communityTitle: "Communauté",
    communityText:
      "Un environnement structuré où les utilisateurs peuvent interagir autour de services et de contenus utiles.",

    piNative: "Pi-native",
    piNativeText:
      "L'authentification et les paiements utiliseront le SDK Pi officiel et l'API de la plateforme.",

    expandable: "Évolutif",
    expandableText:
      "L'architecture restera prête pour de futures infrastructures telles que SoloHost.",

    platformStatus: "ÉTAT DE LA PLATEFORME",
    buildingTitle: "BISOVIA est construit étape par étape.",
    buildingText:
      "La première priorité est une base frontend stable. Les services backend, la base de données et les transactions Pi seront connectés progressivement.",

    foundation: "Fondation",

    footerText: "Une nouvelle plateforme utilitaire Pi-native.",
    aboutLink: "À propos",
    contactLink: "Contact"
  },


  rn: {
    home: "Ahabanza",
    about: "Ivyerekeye",
    services: "Serivisi",
    community: "Abanyagihugu",
    contact: "Twandikire",

    signIn: "Injira ukoresheje Pi",
    connecting: "Biriko birahuza...",
    connected: "Wahujwe na Pi",

    coreDirection: "INTUMBERO NYAMUKURU",
    platformTitle: "Urubuga rwubakiwe akamaro nyako",
    platformDescription:
      "BISOVIA izotera imbere ikoresheje modules zitandukanye, uguhuza Pi mu buryo butekanye hamwe n'uburyo bwo kwagura application ata gusubira kuyubaka yose.",

    utility: "Akamaro",
    utilityText:
      "Serivisi za digitale zifasha mu vyo abakoresha bakeneye vy'ukuri.",

    communityTitle: "Abanyagihugu",
    communityText:
      "Ahantu hatunganijwe aho abakoresha bashobora gukorana biciye kuri serivisi n'ibintu vy'ingirakamaro.",

    piNative: "Pi-native",
    piNativeText:
      "Kwinjira no kwishura bizokoresha Pi SDK hamwe na Pi Platform API vyemewe.",

    expandable: "Yaguka",
    expandableText:
      "Uburyo application yubatswemwo buzoguma bwiteguye kwakira ibikorwa vy'inyongera nka SoloHost.",

    platformStatus: "UKO URUBUGA RUMEZE",
    buildingTitle: "BISOVIA iriko yubakwa intambwe ku yindi.",
    buildingText:
      "Ikintu ca mbere ni ukubaka frontend ikomeye kandi itekanye. Backend, database hamwe n'ama transactions ya Pi bizokwongerwa buhoro buhoro.",

    foundation: "Intango",

    footerText: "Urubuga rushasha rw'ingirakamaro rushingiye kuri Pi.",
    aboutLink: "Ivyerekeye",
    contactLink: "Twandikire"
  },


  sw: {
    home: "Nyumbani",
    about: "Kuhusu",
    services: "Huduma",
    community: "Jamii",
    contact: "Mawasiliano",

    signIn: "Ingia kwa Pi",
    connecting: "Inaunganisha...",
    connected: "Umeunganishwa na Pi",

    coreDirection: "MWELEKEO MKUU",
    platformTitle: "Jukwaa lililojengwa kwa matumizi halisi",
    platformDescription:
      "BISOVIA itakua kupitia moduli zilizotenganishwa vizuri, muunganisho salama wa Pi na mfumo unaoweza kupanuka bila kujenga upya programu yote.",

    utility: "Huduma",
    utilityText:
      "Huduma za kidijitali zinazolenga mahitaji halisi ya watumiaji.",

    communityTitle: "Jamii",
    communityText:
      "Mazingira yaliyopangwa ambapo watumiaji wanaweza kushirikiana kupitia huduma na maudhui yenye manufaa.",

    piNative: "Pi-native",
    piNativeText:
      "Uthibitishaji na malipo vitatumia Pi SDK rasmi na Pi Platform API.",

    expandable: "Inayopanuka",
    expandableText:
      "Muundo wa programu utabaki tayari kwa miundombinu ya baadaye kama SoloHost.",

    platformStatus: "HALI YA JUKWAA",
    buildingTitle: "BISOVIA inajengwa hatua kwa hatua.",
    buildingText:
      "Kipaumbele cha kwanza ni msingi thabiti wa frontend. Huduma za backend, database na miamala ya Pi vitaunganishwa hatua kwa hatua.",

    foundation: "Msingi",

    footerText: "Jukwaa jipya la huduma linalotumia Pi.",
    aboutLink: "Kuhusu",
    contactLink: "Mawasiliano"
  }

};


/* ---------------------------------
   TRANSLATION HELPERS
--------------------------------- */

function translatePage(language) {

  const dictionary = translations[language];

  if (!dictionary) {
    return;
  }

  BISOVIA.currentLanguage = language;

  /*
   * Navigation
   */

  const pageLinks = {
    home: dictionary.home,
    about: dictionary.about,
    services: dictionary.services,
    community: dictionary.community,
    contact: dictionary.contact
  };

  Object.entries(pageLinks).forEach(([page, text]) => {

    const link = document.querySelector(
      `[data-page="${page}"]`
    );

    if (link) {
      link.textContent = text;
    }

  });


  /*
   * Pi button
   */

  const piLogin = getElement("pi-login");

  if (piLogin && !piLogin.disabled) {
    piLogin.textContent = dictionary.signIn;
  }


  /*
   * Main headings and content
   */

  const eyebrowElements =
    document.querySelectorAll(".eyebrow");

  if (eyebrowElements.length > 0) {

    if (eyebrowElements[0]) {
      eyebrowElements[0].textContent =
        dictionary.coreDirection;
    }

    if (eyebrowElements[1]) {
      eyebrowElements[1].textContent =
        dictionary.platformStatus;
    }
  }


  const sectionHeading =
    document.querySelector(".section-heading h2");

  if (sectionHeading) {
    sectionHeading.textContent =
      dictionary.platformTitle;
  }


  const sectionDescription =
    document.querySelector(".section-heading p");

  if (sectionDescription) {
    sectionDescription.textContent =
      dictionary.platformDescription;
  }


  /*
   * Feature cards
   */

  const featureCards =
    document.querySelectorAll(".feature-card");

  if (featureCards.length >= 4) {

    featureCards[0].querySelector("h3").textContent =
      dictionary.utility;

    featureCards[0].querySelector("p").textContent =
      dictionary.utilityText;


    featureCards[1].querySelector("h3").textContent =
      dictionary.communityTitle;

    featureCards[1].querySelector("p").textContent =
      dictionary.communityText;


    featureCards[2].querySelector("h3").textContent =
      dictionary.piNative;

    featureCards[2].querySelector("p").textContent =
      dictionary.piNativeText;


    featureCards[3].querySelector("h3").textContent =
      dictionary.expandable;

    featureCards[3].querySelector("p").textContent =
      dictionary.expandableText;
  }


  /*
   * Platform status
   */

  const statusHeading =
    document.querySelector(".status-card h2");

  if (statusHeading) {
    statusHeading.textContent =
      dictionary.buildingTitle;
  }


  const statusText =
    document.querySelector(".status-card p");

  if (statusText) {
    statusText.textContent =
      dictionary.buildingText;
  }


  const statusIndicator =
    document.querySelector(".status-indicator span:last-child");

  if (statusIndicator) {
    statusIndicator.textContent =
      dictionary.foundation;
  }


  /*
   * Footer
   */

  const footerText =
    document.querySelector(".footer-inner > div p");

  if (footerText) {
    footerText.textContent =
      dictionary.footerText;
  }

  const footerLinks =
    document.querySelectorAll(".footer-links a");

  if (footerLinks.length >= 2) {

    footerLinks[0].textContent =
      dictionary.aboutLink;

    footerLinks[1].textContent =
      dictionary.contactLink;
  }


  /*
   * Save language
   */

  localStorage.setItem(
    "bisovia-language",
    language
  );
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

    window.Pi.init({
      version: "2.0",
      sandbox: true
    });

    BISOVIA.piInitialized = true;

    if (status) {
      status.textContent =
        "Pi SDK initialized. BISOVIA is ready for Pi authentication.";
    }

    console.info(
      "BISOVIA: Pi SDK initialized."
    );

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

  const language =
    BISOVIA.currentLanguage || "en";

  const dictionary =
    translations[language] || translations.en;

  button.disabled = true;
  button.textContent = dictionary.connecting;

  try {

    const authResult =
      await window.Pi.authenticate(
        ["username", "payments"],
        handleIncompletePayment
      );

    console.log(
      "BISOVIA Pi authentication result:",
      authResult
    );

    if (status) {

      status.textContent =
        `${dictionary.connected}: ${authResult.user.username}`;
    }

    button.textContent =
      dictionary.connected;

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

    button.textContent =
      dictionary.signIn;
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
   * Payment completion will be handled
   * by the backend when transaction
   * infrastructure is ready.
   */
}


/* ---------------------------------
   MOBILE MENU
--------------------------------- */

function initializeMenu() {

  const toggle =
    getElement("menu-toggle");

  const navigation =
    getElement("main-navigation");

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

  const toggle =
    getElement("theme-toggle");

  if (!toggle) {
    return;
  }

  const savedTheme =
    localStorage.getItem("bisovia-theme");

  if (savedTheme === "dark") {

    document.body.classList.add("dark");

    BISOVIA.currentTheme = "dark";

    toggle.textContent = "☀️";
    toggle.setAttribute(
      "aria-label",
      "Switch to light mode"
    );

  } else {

    toggle.textContent = "🌙";

    toggle.setAttribute(
      "aria-label",
      "Switch to dark mode"
    );
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


    if (BISOVIA.currentTheme === "dark") {

      toggle.textContent = "☀️";

      toggle.setAttribute(
        "aria-label",
        "Switch to light mode"
      );

    } else {

      toggle.textContent = "🌙";

      toggle.setAttribute(
        "aria-label",
        "Switch to dark mode"
      );
    }
  });
}


/* ---------------------------------
   LANGUAGE
--------------------------------- */

function initializeLanguage() {

  const select =
    getElement("language-select");

  if (!select) {
    return;
  }

  const savedLanguage =
    localStorage.getItem("bisovia-language");


  const language =
    translations[savedLanguage]
      ? savedLanguage
      : "en";


  BISOVIA.currentLanguage =
    language;


  select.value =
    language;


  translatePage(language);


  select.addEventListener("change", () => {

    const selectedLanguage =
      select.value;

    if (translations[selectedLanguage]) {

      translatePage(
        selectedLanguage
      );
    }
  });
}


/* ---------------------------------
   YEAR
--------------------------------- */

function initializeYear() {

  const year =
    getElement("current-year");

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


/* ---------------------------------
   DOM READY
--------------------------------- */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startBISOVIA
  );

} else {

  startBISOVIA();

}
