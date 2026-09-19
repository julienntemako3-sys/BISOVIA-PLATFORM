
/**
 * BISOVIA CORE
 * User & Profile
 *
 * Responsibilities:
 * - Manage the BISOVIA user profile
 * - Store frontend preferences temporarily
 * - Provide a common profile contract for modules
 * - Prepare profile data for future backend synchronization
 *
 * IMPORTANT:
 * This frontend storage is temporary.
 * The BISOVIA backend will become the authoritative
 * source for persistent user profile data.
 */

const BISOVIA_PROFILE = {

  /* =========================
     CONFIGURATION
  ========================= */

  storageKey: "bisovia_profile",


  /* =========================
     DEFAULT PROFILE
  ========================= */

  defaultProfile: {

    displayName: "",

    role: "client",

    language: "en",

    username: "",

    uid: null,

    preferences: {

      notifications: true,

      paymentNotifications: true

    }

  },


  /* =========================
     GET PROFILE
  ========================= */

  getProfile() {

    const stored =
      localStorage.getItem(
        this.storageKey
      );


    if (!stored) {

      return {
        ...this.defaultProfile,
        preferences: {
          ...this.defaultProfile.preferences
        }
      };

    }


    try {

      const profile =
        JSON.parse(stored);


      return {

        ...this.defaultProfile,

        ...profile,

        preferences: {

          ...this.defaultProfile.preferences,

          ...(profile.preferences || {})

        }

      };

    } catch (error) {

      console.warn(
        "BISOVIA: Invalid stored profile."
      );

      return {
        ...this.defaultProfile,
        preferences: {
          ...this.defaultProfile.preferences
        }
      };

    }

  },


  /* =========================
     SAVE PROFILE
  ========================= */

  saveProfile(profileData = {}) {

    const currentProfile =
      this.getProfile();


    const updatedProfile = {

      ...currentProfile,

      ...profileData,

      preferences: {

        ...currentProfile.preferences,

        ...(profileData.preferences || {})

      }

    };


    localStorage.setItem(
      this.storageKey,
      JSON.stringify(updatedProfile)
    );


    this.emitProfileEvent(
      "updated",
      updatedProfile
    );


    return updatedProfile;

  },


  /* =========================
     UPDATE ONE FIELD
  ========================= */

  updateField(field, value) {

    if (!field) {

      throw new Error(
        "Profile field is required."
      );

    }


    return this.saveProfile({

      [field]: value

    });

  },


  /* =========================
     UPDATE PREFERENCES
  ========================= */

  updatePreferences(preferences = {}) {

    return this.saveProfile({

      preferences: preferences

    });

  },


  /* =========================
     CONNECT PI IDENTITY
  ========================= */

  connectPiIdentity(user) {

    if (!user) {

      throw new Error(
        "Pi user information is required."
      );

    }


    return this.saveProfile({

      uid: user.uid || null,

      username: user.username || "",

      displayName:
        user.username || "",

    });

  },


  /* =========================
     GET PI IDENTITY
  ========================= */

  getPiIdentity() {

    const profile =
      this.getProfile();


    return {

      uid: profile.uid,

      username: profile.username

    };

  },


  /* =========================
     CHECK PI CONNECTION
  ========================= */

  isPiConnected() {

    const profile =
      this.getProfile();


    return Boolean(
      profile.uid ||
      profile.username
    );

  },


  /* =========================
     SET ROLE
  ========================= */

  setRole(role) {

    const allowedRoles = [
      "client",
      "provider"
    ];


    if (
      !allowedRoles.includes(role)
    ) {

      throw new Error(
        "Invalid BISOVIA profile role."
      );

    }


    return this.updateField(
      "role",
      role
    );

  },


  /* =========================
     SET LANGUAGE
  ========================= */

  setLanguage(language) {

    const allowedLanguages = [
      "en",
      "fr",
      "rn",
      "sw"
    ];


    if (
      !allowedLanguages.includes(language)
    ) {

      throw new Error(
        "Invalid BISOVIA language."
      );

    }


    return this.updateField(
      "language",
      language
    );

  },


  /* =========================
     DISPLAY NAME
  ========================= */

  setDisplayName(name) {

    const cleanName =
      String(name || "").trim();


    return this.updateField(
      "displayName",
      cleanName
    );

  },


  /* =========================
     RESET PROFILE
  ========================= */

  resetProfile() {

    localStorage.removeItem(
      this.storageKey
    );


    const profile = {

      ...this.defaultProfile,

      preferences: {
        ...this.defaultProfile.preferences
      }

    };


    this.emitProfileEvent(
      "reset",
      profile
    );


    return profile;

  },


  /* =========================
     PREPARE BACKEND DATA
  ========================= */

  toApiPayload() {

    const profile =
      this.getProfile();


    return {

      displayName:
        profile.displayName,

      role:
        profile.role,

      language:
        profile.language,

      preferences:
        profile.preferences

    };

  },


  /* =========================
     PROFILE EVENTS
  ========================= */

  emitProfileEvent(
    action,
    profile
  ) {

    window.dispatchEvent(
      new CustomEvent(
        `bisovia:profile-${action}`,
        {
          detail: profile
        }
      )
    );

  },


  /* =========================
     BACKEND SYNC PLACEHOLDER
  ========================= */

  async syncWithBackend() {

    /*
     * BACKEND CONNECTION — LATER
     *
     * The BISOVIA backend will:
     *
     * 1. Authenticate the Pi identity
     * 2. Retrieve the authoritative profile
     * 3. Save profile changes
     * 4. Return the updated profile
     *
     * No database connection belongs in the frontend.
     */

    if (
      !window.BISOVIA_API ||
      !window.BISOVIA_API.post
    ) {

      return {

        success: false,

        pendingBackend: true,

        profile:
          this.getProfile()

      };

    }


    return await window.BISOVIA_API.post(
      "/api/profile/sync",
      this.toApiPayload()
    );

  }

};


/**
 * Global BISOVIA Core access.
 *
 * Other pages and modules can use:
 *
 * BISOVIA_PROFILE.getProfile()
 * BISOVIA_PROFILE.saveProfile(...)
 * BISOVIA_PROFILE.setRole(...)
 * BISOVIA_PROFILE.setLanguage(...)
 * BISOVIA_PROFILE.connectPiIdentity(...)
 * BISOVIA_PROFILE.isPiConnected()
 */

window.BISOVIA_PROFILE =
  BISOVIA_PROFILE;
