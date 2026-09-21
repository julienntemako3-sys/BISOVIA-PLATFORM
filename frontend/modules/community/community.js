<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>BISOVIA — Community Service</title>

  <meta
    name="description"
    content="View community service details and connect with providers through BISOVIA."
  />

  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg" />

  <!-- Core stylesheet -->
  <link rel="stylesheet" href="../../style.css" />

  <!-- Community module stylesheet -->
  <link rel="stylesheet" href="community.css" />

  <!-- Pi SDK -->
  <script src="https://sdk.minepi.com/pi-sdk.js"></script>
</head>

<body>

  <!-- =========================
       HEADER
  ========================== -->
  <header class="site-header">

    <div class="header-inner">

      <a href="../../index.html" class="brand">
        <img
          src="../../assets/logo.svg"
          alt="BISOVIA"
          class="brand-logo"
        />
        <span class="brand-name">BISOVIA</span>
      </a>

      <button
        class="mobile-menu-toggle"
        id="mobileMenuToggle"
        type="button"
        aria-label="Open navigation menu"
        aria-expanded="false"
      >
        ☰
      </button>

      <nav class="main-nav" id="mainNav">

        <a href="../../index.html">Home</a>
        <a href="../../about.html">About</a>

        <a href="../mobility/index.html">Mobility</a>
        <a href="../auto/index.html">Auto</a>
        <a href="../hospitality/index.html">Hospitality</a>

        <a
          href="index.html"
          class="active"
          aria-current="page"
        >
          Community
        </a>

        <a href="../../pages/payments.html">Payments</a>

      </nav>

      <div class="header-actions">

        <!-- Language -->
        <label class="sr-only" for="languageSelect">
          Language
        </label>

        <select id="languageSelect" aria-label="Select language">
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="rn">RN</option>
          <option value="sw">SW</option>
        </select>

        <!-- Theme -->
        <button
          id="themeToggle"
          class="icon-button"
          type="button"
          aria-label="Toggle dark and light mode"
          title="Toggle theme"
        >
          ◐
        </button>

        <!-- Pi Sign In -->
        <button
          id="piSignIn"
          class="btn btn-primary"
          type="button"
        >
          Sign in with Pi
        </button>

      </div>

    </div>

  </header>


  <!-- =========================
       MAIN
  ========================== -->
  <main>

    <!-- Hero -->
    <section class="community-hero">

      <div class="community-container">

        <div class="community-hero-content">

          <span class="eyebrow">
            COMMUNITY SERVICE
          </span>

          <h1>
            Community Learning Session
          </h1>

          <p>
            Discover the service, understand what it offers,
            and connect with the provider through BISOVIA.
          </p>

        </div>

      </div>

    </section>


    <!-- =========================
         SERVICE DETAILS
    ========================== -->
    <section class="community-section">

      <div class="community-container">

        <div class="service-detail-layout">

          <!-- Main details -->
          <article class="community-card service-detail-card">

            <div class="service-detail-header">

              <div class="service-detail-icon">
                📚
              </div>

              <div>

                <span class="status-badge status-open">
                  Available
                </span>

                <h2>
                  Community Learning Session
                </h2>

                <p class="service-category">
                  Education & Community
                </p>

              </div>

            </div>


            <div class="service-detail-content">

              <h3>
                About this service
              </h3>

              <p>
                A practical community learning service designed
                to help participants exchange knowledge, develop
                useful skills and learn together.
              </p>

              <p>
                Sessions may cover digital skills, practical
                knowledge, community participation and other
                useful topics depending on the provider.
              </p>


              <h3>
                What is included
              </h3>

              <ul class="service-feature-list">

                <li>
                  Community-oriented learning activities
                </li>

                <li>
                  Practical knowledge and skill sharing
                </li>

                <li>
                  Interaction with other participants
                </li>

                <li>
                  Provider guidance during the session
                </li>

                <li>
                  Participation information before booking
                </li>

              </ul>


              <h3>
                Service information
              </h3>

              <div class="service-info-grid">

                <div class="info-item">

                  <span class="info-label">
                    Category
                  </span>

                  <strong>
                    Education
                  </strong>

                </div>


                <div class="info-item">

                  <span class="info-label">
                    Availability
                  </span>

                  <strong>
                    By booking
                  </strong>

                </div>


                <div class="info-item">

                  <span class="info-label">
                    Format
                  </span>

                  <strong>
                    Community session
                  </strong>

                </div>


                <div class="info-item">

                  <span class="info-label">
                    Payment
                  </span>

                  <strong>
                    Pi supported
                  </strong>

                </div>

              </div>

            </div>

          </article>


          <!-- Provider / booking card -->
          <aside class="community-card service-action-card">

            <div class="card-header">

              <span class="card-icon">
                🤝
              </span>

              <div>

                <h2>
                  Provider
                </h2>

                <p>
                  Community learning provider
                </p>

              </div>

            </div>


            <div class="provider-mini-profile">

              <div class="provider-avatar">
                CL
              </div>

              <div>

                <h3>
                  Community Learning Provider
                </h3>

                <p>
                  Bujumbura
                </p>

              </div>

            </div>


            <div class="provider-status">

              <span class="status-dot"></span>

              <span>
                Currently accepting requests
              </span>

            </div>


            <div class="trust-mini">

              <span class="trust-icon">
                🛡️
              </span>

              <div>

                <strong>
                  Trust & Safety
                </strong>

                <p>
                  Provider information and community
                  interactions are designed to work with
                  BISOVIA Trust & Safety services.
                </p>

              </div>

            </div>


            <div class="service-action-buttons">

              <a
                href="booking.html"
                class="btn btn-primary"
              >
                Book this service
              </a>

              <a
                href="providers.html"
                class="btn btn-secondary"
              >
                View providers
              </a>

            </div>

          </aside>

        </div>

      </div>

    </section>


    <!-- =========================
         HOW IT WORKS
    ========================== -->
    <section class="community-section community-section-alt">

      <div class="community-container">

        <div class="section-heading">

          <span class="eyebrow">
            HOW IT WORKS
          </span>

          <h2>
            From service discovery to participation
          </h2>

          <p>
            BISOVIA keeps the community booking process simple
            and structured.
          </p>

        </div>


        <div class="community-grid">

          <article class="community-card">

            <div class="card-icon">
              🔎
            </div>

            <h3>
              1. Discover
            </h3>

            <p>
              Find a community service that matches your needs.
            </p>

          </article>


          <article class="community-card">

            <div class="card-icon">
              📅
            </div>

            <h3>
              2. Request a booking
            </h3>

            <p>
              Select a date, time, provider and other required
              information.
            </p>

          </article>


          <article class="community-card">

            <div class="card-icon">
              🤝
            </div>

            <h3>
              3. Provider response
            </h3>

            <p>
              The provider can review the request and respond
              through the platform.
            </p>

          </article>


          <article class="community-card">

            <div class="card-icon">
              ✓
            </div>

            <h3>
              4. Confirmation
            </h3>

            <p>
              Once confirmed, the booking can continue through
              the BISOVIA Core flow.
            </p>

          </article>

        </div>

      </div>

    </section>


    <!-- =========================
         RELATED COMMUNITY PAGES
    ========================== -->
    <section class="community-section">

      <div class="community-container">

        <div class="section-heading">

          <span class="eyebrow">
            COMMUNITY
          </span>

          <h2>
            Continue exploring
          </h2>

        </div>


        <div class="community-grid">

          <article class="community-card">

            <div class="card-icon">
              🛠️
            </div>

            <h3>
              Services
            </h3>

            <p>
              Browse other community services available on
              BISOVIA.
            </p>

            <a
              href="services.html"
              class="btn btn-secondary"
            >
              Browse services
            </a>

          </article>


          <article class="community-card">

            <div class="card-icon">
              🎫
            </div>

            <h3>
              Events
            </h3>

            <p>
              Discover community events and activities.
            </p>

            <a
              href="events.html"
              class="btn btn-secondary"
            >
              Browse events
            </a>

          </article>


          <article class="community-card">

            <div class="card-icon">
              📢
            </div>

            <h3>
              Requests
            </h3>

            <p>
              See community requests or create a new one.
            </p>

            <a
              href="requests.html"
              class="btn btn-secondary"
            >
              View requests
            </a>

          </article>


          <article class="community-card">

            <div class="card-icon">
              📅
            </div>

            <h3>
              Booking
            </h3>

            <p>
              Create a booking request for a community service
              or event.
            </p>

            <a
              href="booking.html"
              class="btn btn-secondary"
            >
              Create booking
            </a>

          </article>

        </div>

      </div>

    </section>


    <!-- =========================
         TRUST NOTE
    ========================== -->
    <section class="community-section community-section-alt">

      <div class="community-container">

        <div class="community-trust-note">

          <div class="trust-icon">
            🛡️
          </div>

          <div>

            <h2>
              Responsible community participation
            </h2>

            <p>
              BISOVIA is designed to support transparent
              interactions between users and providers.
              Reputation, reviews, reports, moderation and
              booking status belong to the Core Trust & Safety
              architecture and will be connected through the
              standard platform contracts.
            </p>

          </div>

        </div>

      </div>

    </section>


    <!-- =========================
         CTA
    ========================== -->
    <section class="community-section community-cta">

      <div class="community-container">

        <div class="cta-content">

          <span class="eyebrow">
            COMMUNITY SERVICE
          </span>

          <h2>
            Ready to participate?
          </h2>

          <p>
            Submit a booking request and connect with the
            community provider.
          </p>

          <a
            href="booking.html"
            class="btn btn-primary"
          >
            Book this service
          </a>

        </div>

      </div>

    </section>

  </main>


  <!-- =========================
       FOOTER
  ========================== -->
  <footer class="site-footer">

    <div class="footer-inner">

      <div class="footer-brand">

        <a href="../../index.html" class="brand">

          <img
            src="../../assets/logo.svg"
            alt="BISOVIA"
            class="brand-logo"
          />

          <span class="brand-name">
            BISOVIA
          </span>

        </a>

        <p>
          A Pi-native utility platform built for practical
          digital services and community interaction.
        </p>

      </div>


      <div class="footer-links">

        <div>

          <h3>
            Community
          </h3>

          <a href="index.html">
            Home
          </a>

          <a href="services.html">
            Services
          </a>

          <a href="events.html">
            Events
          </a>

          <a href="providers.html">
            Providers
          </a>

          <a href="requests.html">
            Requests
          </a>

          <a href="booking.html">
            Booking
          </a>

        </div>


        <div>

          <h3>
            Platform
          </h3>

          <a href="../../index.html">
            Home
          </a>

          <a href="../../about.html">
            About
          </a>

          <a href="../../pages/payments.html">
            Payments
          </a>

        </div>

      </div>

    </div>


    <div class="footer-bottom">

      <p>
        © <span id="currentYear"></span> BISOVIA.
        All rights reserved.
      </p>

    </div>

  </footer>


  <!-- Community JavaScript -->
  <script src="community.js"></script>

</body>
</html>
