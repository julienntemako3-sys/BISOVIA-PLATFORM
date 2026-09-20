/* =========================================================
   BISOVIA — MOBILITY MODULE
   Shared JavaScript for all Mobility pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ================= CURRENT YEAR ================= */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* ================= REQUEST FILTER ================= */

  const requestStatus = document.getElementById("requestStatus");
  const requestsGrid = document.getElementById("requestsGrid");
  const requestsEmpty = document.getElementById("requestsEmpty");

  if (requestStatus && requestsGrid) {

    const requestCards = Array.from(
      requestsGrid.querySelectorAll(".request-card")
    );

    const filterRequests = () => {

      const selectedStatus = requestStatus.value;
      let visibleCount = 0;

      requestCards.forEach((card) => {

        const cardStatus = card.dataset.status;

        const shouldShow =
          selectedStatus === "all" ||
          cardStatus === selectedStatus;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount++;
        }

      });

      if (requestsEmpty) {
        requestsEmpty.hidden = visibleCount !== 0;
      }

    };

    requestStatus.addEventListener(
      "change",
      filterRequests
    );

    filterRequests();
  }


  /* ================= PROVIDER SEARCH ================= */

  const providerSearch =
    document.getElementById("providerSearch");

  const serviceFilter =
    document.getElementById("serviceFilter");

  const availabilityFilter =
    document.getElementById("availabilityFilter");

  const providersGrid =
    document.getElementById("providersGrid");

  const providersEmpty =
    document.getElementById("providersEmpty");


  if (providersGrid) {

    const providerCards = Array.from(
      providersGrid.querySelectorAll(".provider-card")
    );

    const filterProviders = () => {

      const searchValue =
        providerSearch
          ? providerSearch.value.trim().toLowerCase()
          : "";

      const selectedService =
        serviceFilter
          ? serviceFilter.value
          : "all";

      const selectedAvailability =
        availabilityFilter
          ? availabilityFilter.value
          : "all";

      let visibleCount = 0;

      providerCards.forEach((card) => {

        const text =
          card.textContent.toLowerCase();

        const cardService =
          card.dataset.service || "all";

        const cardAvailability =
          card.dataset.availability || "all";

        const matchesSearch =
          !searchValue ||
          text.includes(searchValue);

        const matchesService =
          selectedService === "all" ||
          cardService === selectedService;

        const matchesAvailability =
          selectedAvailability === "all" ||
          cardAvailability === selectedAvailability;

        const shouldShow =
          matchesSearch &&
          matchesService &&
          matchesAvailability;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount++;
        }

      });

      if (providersEmpty) {
        providersEmpty.hidden = visibleCount !== 0;
      }

    };


    if (providerSearch) {
      providerSearch.addEventListener(
        "input",
        filterProviders
      );
    }

    if (serviceFilter) {
      serviceFilter.addEventListener(
        "change",
        filterProviders
      );
    }

    if (availabilityFilter) {
      availabilityFilter.addEventListener(
        "change",
        filterProviders
      );
    }

    filterProviders();
  }


  /* ================= BOOKING FORM ================= */

  const bookingForm =
    document.getElementById("mobilityBookingForm");

  if (bookingForm) {

    const serviceType =
      document.getElementById("serviceType");

    /*
     * Read service/provider/request information
     * from the current URL when available.
     */

    const params =
      new URLSearchParams(window.location.search);

    const serviceFromUrl =
      params.get("service");

    const providerFromUrl =
      params.get("provider");

    const requestFromUrl =
      params.get("request");


    /* ---------- SERVICE FROM URL ---------- */

    if (serviceType && serviceFromUrl) {

      const optionExists =
        Array.from(serviceType.options)
          .some(
            option => option.value === serviceFromUrl
          );

      if (optionExists) {
        serviceType.value = serviceFromUrl;
      }

    }


    /* ---------- PROVIDER FROM URL ---------- */

    const provider =
      document.getElementById("provider");

    if (provider && providerFromUrl) {

      const optionExists =
        Array.from(provider.options)
          .some(
            option => option.value === providerFromUrl
          );

      if (optionExists) {
        provider.value = providerFromUrl;
      }

    }


    /* ---------- REQUEST REFERENCE ---------- */

    if (requestFromUrl) {

      const requestReference =
        document.createElement("input");

      requestReference.type = "hidden";
      requestReference.name = "requestId";
      requestReference.value = requestFromUrl;

      bookingForm.appendChild(
        requestReference
      );

    }


    /* ---------- FORM SUBMISSION ---------- */

    bookingForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const formData =
          new FormData(bookingForm);

        const request = {
          serviceType:
            formData.get("serviceType"),

          provider:
            formData.get("provider"),

          pickup:
            formData.get("pickup"),

          destination:
            formData.get("destination"),

          serviceDate:
            formData.get("serviceDate"),

          serviceTime:
            formData.get("serviceTime"),

          passengers:
            formData.get("passengers"),

          notes:
            formData.get("notes"),

          requestId:
            formData.get("requestId") || null
        };


        /*
         * Frontend stage:
         * We prepare the request structure here.
         *
         * Backend/API connection will be added later.
         * No real booking or Pi payment is created here.
         */

        console.log(
          "BISOVIA Mobility Request:",
          request
        );


        /*
         * Temporary user feedback.
         * This will later be replaced by the real
         * BISOVIA Core API response.
         */

        alert(
          "Your mobility request has been prepared. " +
          "The BISOVIA service flow will process it."
        );

      }
    );

  }


  /* ================= SERVICE DETAILS ================= */

  const serviceTitle =
    document.getElementById("serviceTitle");

  const serviceDescription =
    document.getElementById("serviceDescription");

  const detailsTitle =
    document.getElementById("detailsTitle");

  const detailsDescription =
    document.getElementById("detailsDescription");

  const sideTitle =
    document.getElementById("sideTitle");

  const sideDescription =
    document.getElementById("sideDescription");

  const bookServiceButton =
    document.getElementById("bookServiceButton");

  const detailsBookingButton =
    document.getElementById("detailsBookingButton");


  if (serviceTitle) {

    const params =
      new URLSearchParams(window.location.search);

    const service =
      params.get("service");

    const provider =
      params.get("provider");


    const serviceData = {

      "local-ride": {
        title: "Local Ride",
        description:
          "Practical local transportation for everyday mobility needs."
      },

      "shared-transport": {
        title: "Shared Transport",
        description:
          "Shared transportation designed for practical local travel."
      },

      "minibus": {
        title: "Minibus Transport",
        description:
          "Local minibus transportation for everyday mobility."
      },

      "private-transport": {
        title: "Private Transport",
        description:
          "Private mobility for users who need a dedicated transport service."
      },

      "delivery": {
        title: "Local Delivery",
        description:
          "A mobility service for local delivery and transport needs."
      },

      "new-mobility": {
        title: "New Mobility Services",
        description:
          "Expandable mobility services that can be introduced as BISOVIA grows."
      }

    };


    if (service && serviceData[service]) {

      const data =
        serviceData[service];

      if (serviceTitle) {
        serviceTitle.textContent =
          data.title;
      }

      if (serviceDescription) {
        serviceDescription.textContent =
          data.description;
      }

      if (detailsTitle) {
        detailsTitle.textContent =
          data.title;
      }

      if (detailsDescription) {
        detailsDescription.textContent =
          data.description;
      }

      if (sideTitle) {
        sideTitle.textContent =
          data.title;
      }

      if (sideDescription) {
        sideDescription.textContent =
          data.description;
      }


      /*
       * Preserve the selected service when
       * moving to the booking page.
       */

      const bookingUrl =
        `booking.html?service=${encodeURIComponent(service)}`;


      if (bookServiceButton) {
        bookServiceButton.href =
          bookingUrl;
      }

      if (detailsBookingButton) {
        detailsBookingButton.href =
          bookingUrl;
      }

    }


    /* ================= PROVIDER CONTEXT ================= */

    if (provider) {

      const providerLabel =
        document.createElement("p");

      providerLabel.className =
        "service-provider-context";

      providerLabel.textContent =
        `Provider selected: ${provider}`;

      const hero =
        document.querySelector(".page-hero .mobility-container");

      if (hero) {
        hero.appendChild(providerLabel);
      }

    }

  }


  /* ================= MOBILE NAVIGATION ================= */

  /*
   * The shared Mobility pages currently use a simple
   * responsive navigation. This section intentionally
   * avoids changing the Core BISOVIA navigation.
   */

  const mobilityNav =
    document.querySelector(".mobility-nav");

  if (mobilityNav) {

    const activeLink =
      mobilityNav.querySelector("a.active");

    if (activeLink) {
      activeLink.setAttribute(
        "aria-current",
        "page"
      );
    }

  }


  /* ================= SAFE LINK HANDLING ================= */

  const mobilityLinks =
    document.querySelectorAll(
      ".mobility-nav a, .hero-actions a, .card-actions a"
    );

  mobilityLinks.forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        /*
         * Keep navigation normal.
         * No interception is performed here.
         */

      }
    );

  });


});
