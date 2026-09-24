
/**

* BISOVIA — AI Support
* Path: frontend/modules/ai/support.js
* 
* Purpose:
* - Provides a simple AI support/help layer.
* - Gives users guidance when they need assistance.
* - Keeps AI support independent from the BISOVIA Core.
* 
* Note:
* This frontend module does NOT contain private API keys
* and does NOT connect directly to a database.
  */

(function () {
"use strict";

const BISOVIA_AI_SUPPORT = {
    name: "BISOVIA AI Support",
    version: "1.0.0",

    messages: {
        en: {
            welcome: "Hello! How can BISOVIA AI Support help you?",
            unknown: "I can help you understand BISOVIA services, payments, bookings, profiles, trust and safety, and other platform features.",
            payment:
                "For Pi payments, choose the service, verify the amount and payment information, then continue with Pi. Never share your wallet passphrase.",
            booking:
                "To make a booking, select a service or provider, choose the available date and time, review the details, and confirm your request.",
            profile:
                "Your profile contains your account information, preferences and activity. Keep your personal information accurate and secure.",
            safety:
                "For your safety, do not share passwords, wallet passphrases, private keys or sensitive personal information with anyone.",
            support:
                "If a problem cannot be solved here, use the available BISOVIA support channel or report the issue through the appropriate feature."
        },

        fr: {
            welcome: "Bonjour ! Comment BISOVIA AI Support peut-il vous aider ?",
            unknown:
                "Je peux vous aider à comprendre les services BISOVIA, les paiements, les réservations, les profils, la confiance et la sécurité.",
            payment:
                "Pour les paiements Pi, choisissez le service, vérifiez le montant et les informations du paiement, puis continuez avec Pi. Ne partagez jamais votre phrase secrète de portefeuille.",
            booking:
                "Pour effectuer une réservation, choisissez un service ou un prestataire, sélectionnez la date et l'heure disponibles, vérifiez les détails puis confirmez votre demande.",
            profile:
                "Votre profil contient vos informations de compte, vos préférences et votre activité. Gardez vos informations personnelles exactes et sécurisées.",
            safety:
                "Pour votre sécurité, ne partagez jamais vos mots de passe, phrases secrètes de portefeuille, clés privées ou informations personnelles sensibles.",
            support:
                "Si le problème ne peut pas être résolu ici, utilisez le canal d'assistance BISOVIA disponible ou signalez le problème avec la fonction appropriée."
        },

        rn: {
            welcome: "Muraho! BISOVIA AI Support yoshobora kubafasha iki?",
            unknown:
                "Nshobora kubafasha gutahura ibikorwa vya BISOVIA, ukwishura, booking, profile, ukwizigirana n'umutekano.",
            payment:
                "Ku bijanye no kwishura na Pi, hitamwo service, suzuma amafaranga n'amakuru y'ukwishura, hanyuma ukomeze ukoresheje Pi. Ntuzigere utanga ijambo ry'ibanga rya wallet yawe.",
            booking:
                "Kugira booking, hitamwo service canke provider, hitamwo itariki n'isaha biboneka, suzuma amakuru hanyuma wemeze request yawe.",
            profile:
                "Profile yawe irimwo amakuru ya konti, ivyo ukunda n'ibikorwa vyawe. Bika amakuru yawe neza kandi ayobore.",
            safety:
                "Ku mutekano wawe, ntusangize umuntu password, wallet passphrase, private key canke amakuru yawe y'ibanga.",
            support:
                "Nimba ikibazo kidashobora gukemuka hano, koresha BISOVIA support canke utange report ukoresheje igice kibereye."
        },

        sw: {
            welcome: "Habari! BISOVIA AI Support inaweza kukusaidia nini?",
            unknown:
                "Naweza kukusaidia kuelewa huduma za BISOVIA, malipo, booking, profile, uaminifu na usalama.",
            payment:
                "Kwa malipo ya Pi, chagua huduma, hakikisha kiasi na taarifa za malipo, kisha endelea kupitia Pi. Usishiriki kamwe passphrase ya wallet yako.",
            booking:
                "Ili kufanya booking, chagua huduma au mtoa huduma, chagua tarehe na muda unaopatikana, kagua taarifa kisha thibitisha ombi lako.",
            profile:
                "Profile yako ina taarifa za akaunti, mapendeleo na shughuli zako. Weka taarifa zako sahihi na salama.",
            safety:
                "Kwa usalama wako, usishiriki passwords, wallet passphrases, private keys au taarifa nyeti za kibinafsi.",
            support:
                "Ikiwa tatizo haliwezi kutatuliwa hapa, tumia njia ya BISOVIA support inayopatikana au ripoti tatizo kupitia sehemu inayofaa."
        }
    },

    /**
     * Detect the current BISOVIA language.
     */
    getLanguage: function () {
        const storedLanguage =
            localStorage.getItem("bisovia_language") ||
            localStorage.getItem("language") ||
            document.documentElement.lang;

        const language = String(storedLanguage || "en").toLowerCase();

        if (language.startsWith("fr")) return "fr";
        if (language.startsWith("rn")) return "rn";
        if (language.startsWith("sw")) return "sw";

        return "en";
    },

    /**
     * Return the current language dictionary.
     */
    getDictionary: function () {
        const language = this.getLanguage();
        return this.messages[language] || this.messages.en;
    },

    /**
     * Provide a support response according to the user's question.
     */
    respond: function (input) {
        const dictionary = this.getDictionary();
        const text = String(input || "").trim().toLowerCase();

        if (!text) {
            return dictionary.welcome;
        }

        if (
            text.includes("payment") ||
            text.includes("pay") ||
            text.includes("pi") ||
            text.includes("paiement") ||
            text.includes("kwishura") ||
            text.includes("malipo")
        ) {
            return dictionary.payment;
        }

        if (
            text.includes("booking") ||
            text.includes("reservation") ||
            text.includes("réservation") ||
            text.includes("réserver") ||
            text.includes("booking") ||
            text.includes("kubika")
        ) {
            return dictionary.booking;
        }

        if (
            text.includes("profile") ||
            text.includes("account") ||
            text.includes("compte") ||
            text.includes("konti")
        ) {
            return dictionary.profile;
        }

        if (
            text.includes("safe") ||
            text.includes("security") ||
            text.includes("sécurité") ||
            text.includes("umutekano") ||
            text.includes("usalama")
        ) {
            return dictionary.safety;
        }

        if (
            text.includes("support") ||
            text.includes("help") ||
            text.includes("aide") ||
            text.includes("ubufasha") ||
            text.includes("msaada")
        ) {
            return dictionary.support;
        }

        return dictionary.unknown;
    },

    /**
     * Attach support behavior to a form.
     *
     * Expected HTML:
     *
     * <form id="ai-support-form">
     *   <input id="ai-support-input">
     *   <button type="submit">Send</button>
     * </form>
     *
     * <div id="ai-support-response"></div>
     */
    init: function () {
        const form = document.getElementById("ai-support-form");
        const input = document.getElementById("ai-support-input");
        const response = document.getElementById("ai-support-response");

        if (!form || !input || !response) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const userMessage = input.value.trim();

            if (!userMessage) {
                response.textContent = BISOVIA_AI_SUPPORT.getDictionary().welcome;
                return;
            }

            response.textContent =
                BISOVIA_AI_SUPPORT.respond(userMessage);

            input.value = "";
        });
    }
};

// Make the support module available to other BISOVIA frontend files.
window.BISOVIA_AI_SUPPORT = BISOVIA_AI_SUPPORT;

// Initialize after the document is ready.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        BISOVIA_AI_SUPPORT.init();
    });
} else {
    BISOVIA_AI_SUPPORT.init();
}

})();
