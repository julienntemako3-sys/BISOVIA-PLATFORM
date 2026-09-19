
/**
 * BISOVIA CORE
 * Trust & Safety
 *
 * Responsibilities:
 * - Reputation
 * - Reviews
 * - Reports
 * - Safety events
 * - Moderation status
 *
 * IMPORTANT:
 * This frontend layer does not make final moderation
 * or trust decisions. The backend will become the
 * authoritative source for trust and safety data.
 */

const BISOVIA_TRUST = {

  /* =========================
     CONFIGURATION
  ========================= */

  storageKey: "bisovia_trust_data",

  allowedReviewTypes: [
    "service",
    "provider",
    "general"
  ],

  allowedReportTypes: [
    "service",
    "user",
    "payment",
    "safety",
    "other"
  ],


  /* =========================
     DEFAULT DATA
  ========================= */

  defaultData: {

    reputation: {
      score: 0,
      reviewsCount: 0
    },

    reviews: [],

    reports: [],

    safetyStatus: "normal"

  },


  /* =========================
     GET TRUST DATA
  ========================= */

  getData() {

    const stored =
      localStorage.getItem(
        this.storageKey
      );


    if (!stored) {

      return this.cloneDefaultData();

    }


    try {

      const data =
        JSON.parse(stored);


      return {

        ...this.cloneDefaultData(),

        ...data,

        reputation: {

          ...this.defaultData.reputation,

          ...(data.reputation || {})

        },

        reviews:
          Array.isArray(data.reviews)
            ? data.reviews
            : [],

        reports:
          Array.isArray(data.reports)
            ? data.reports
            : []

      };

    } catch (error) {

      console.warn(
        "BISOVIA: Invalid trust data."
      );

      return this.cloneDefaultData();

    }

  },


  /* =========================
     CLONE DEFAULT DATA
  ========================= */

  cloneDefaultData() {

    return {

      reputation: {
        score: 0,
        reviewsCount: 0
      },

      reviews: [],

      reports: [],

      safetyStatus: "normal"

    };

  },


  /* =========================
     SAVE TRUST DATA
  ========================= */

  saveData(data) {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(data)
    );


    this.emitEvent(
      "updated",
      data
    );


    return data;

  },


  /* =========================
     GET REPUTATION
  ========================= */

  getReputation() {

    return this.getData()
      .reputation;

  },


  /* =========================
     ADD REVIEW
  ========================= */

  addReview({

    targetId = null,

    targetType = "service",

    rating,

    comment = ""

  } = {}) {

    if (
      !this.allowedReviewTypes
        .includes(targetType)
    ) {

      throw new Error(
        "Invalid review type."
      );

    }


    const numericRating =
      Number(rating);


    if (
      !Number.isInteger(
        numericRating
      ) ||
      numericRating < 1 ||
      numericRating > 5
    ) {

      throw new Error(
        "Rating must be between 1 and 5."
      );

    }


    const data =
      this.getData();


    const review = {

      id:
        this.generateId("review"),

      targetId:
        targetId,

      targetType:
        targetType,

      rating:
        numericRating,

      comment:
        String(comment || "").trim(),

      status:
        "pending",

      createdAt:
        new Date().toISOString()

    };


    data.reviews.push(
      review
    );


    data.reputation.reviewsCount =
      data.reviews.length;


    this.saveData(data);


    this.emitEvent(
      "review-submitted",
      review
    );


    return review;

  },


  /* =========================
     GET REVIEWS
  ========================= */

  getReviews({
    targetId = null
  } = {}) {

    const reviews =
      this.getData().reviews;


    if (!targetId) {

      return reviews;

    }


    return reviews.filter(
      review =>
        review.targetId === targetId
    );

  },


  /* =========================
     SUBMIT REPORT
  ========================= */

  submitReport({

    targetId = null,

    targetType = "other",

    reason = "",

    description = ""

  } = {}) {

    if (
      !this.allowedReportTypes
        .includes(targetType)
    ) {

      throw new Error(
        "Invalid report type."
      );

    }


    if (
      !String(reason).trim()
    ) {

      throw new Error(
        "A report reason is required."
      );

    }


    const data =
      this.getData();


    const report = {

      id:
        this.generateId("report"),

      targetId:
        targetId,

      targetType:
        targetType,

      reason:
        String(reason).trim(),

      description:
        String(description || "").trim(),

      status:
        "pending",

      createdAt:
        new Date().toISOString()

    };


    data.reports.push(
      report
    );


    this.saveData(data);


    this.emitEvent(
      "report-submitted",
      report
    );


    return report;

  },


  /* =========================
     GET REPORTS
  ========================= */

  getReports() {

    return this.getData()
      .reports;

  },


  /* =========================
     SAFETY STATUS
  ========================= */

  getSafetyStatus() {

    return this.getData()
      .safetyStatus;

  },


  setSafetyStatus(status) {

    const allowedStatuses = [
      "normal",
      "review",
      "restricted"
    ];


    if (
      !allowedStatuses.includes(status)
    ) {

      throw new Error(
        "Invalid safety status."
      );

    }


    const data =
      this.getData();


    data.safetyStatus =
      status;


    this.saveData(data);


    this.emitEvent(
      "safety-status-changed",
      status
    );


    return status;

  },


  /* =========================
     GENERATE LOCAL ID
  ========================= */

  generateId(prefix) {

    return (
      prefix +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 8)
    );

  },


  /* =========================
     EVENTS
  ========================= */

  emitEvent(
    action,
    detail
  ) {

    window.dispatchEvent(
      new CustomEvent(
        `bisovia:trust-${action}`,
        {
          detail: detail
        }
      )
    );

  },


  /* =========================
     BACKEND SYNC
  ========================= */

  async syncWithBackend() {

    /*
     * BACKEND CONNECTION — LATER
     *
     * The backend will become the authoritative
     * source for:
     *
     * - reputation
     * - reviews
     * - reports
     * - moderation
     * - safety status
     *
     * Frontend localStorage is only a temporary
     * development layer.
     */

    if (
      !window.BISOVIA_API ||
      !window.BISOVIA_API.post
    ) {

      return {

        success: false,

        pendingBackend: true,

        data:
          this.getData()

      };

    }


    return await window.BISOVIA_API.post(
      "/api/trust/sync",
      this.getData()
    );

  }

};


/**
 * Global BISOVIA Core access.
 *
 * Examples:
 *
 * BISOVIA_TRUST.getReputation()
 * BISOVIA_TRUST.addReview(...)
 * BISOVIA_TRUST.submitReport(...)
 * BISOVIA_TRUST.getSafetyStatus()
 * BISOVIA_TRUST.syncWithBackend()
 */

window.BISOVIA_TRUST =
  BISOVIA_TRUST;
