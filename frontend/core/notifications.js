/**
 * BISOVIA Core
 * Notification Service
 *
 * Responsibility:
 * - Create notifications
 * - Store notifications temporarily in localStorage
 * - Read notifications
 * - Track unread notifications
 * - Mark one/all as read
 * - Delete/clear notifications
 * - Emit Core events
 * - Prepare backend synchronization
 *
 * Note:
 * Frontend storage is temporary.
 * Backend will become authoritative later.
 */

const BISOVIA_NOTIFICATIONS = {

  storageKey: "bisovia_notifications_data",

  allowedTypes: [
    "system",
    "payment",
    "trust",
    "service",
    "booking",
    "community",
    "general"
  ],

  defaultData() {
    return {
      notifications: []
    };
  },

  /**
   * Generate a simple local notification ID.
   */
  generateId(prefix = "notification") {
    return `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;
  },

  /**
   * Get stored notification data.
   */
  getData() {
    try {
      const stored = localStorage.getItem(this.storageKey);

      if (!stored) {
        return this.defaultData();
      }

      const parsed = JSON.parse(stored);

      if (!parsed || !Array.isArray(parsed.notifications)) {
        return this.defaultData();
      }

      return parsed;

    } catch (error) {
      console.error(
        "BISOVIA Notification Service: unable to read notifications.",
        error
      );

      return this.defaultData();
    }
  },

  /**
   * Save notification data.
   */
  saveData(data) {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(data)
      );

      return data;

    } catch (error) {
      console.error(
        "BISOVIA Notification Service: unable to save notifications.",
        error
      );

      return null;
    }
  },

  /**
   * Create a notification.
   */
  create({
    title,
    message,
    type = "general",
    link = null,
    metadata = {}
  }) {

    if (!title || !message) {
      throw new Error(
        "Notification title and message are required."
      );
    }

    if (!this.allowedTypes.includes(type)) {
      type = "general";
    }

    const data = this.getData();

    const notification = {
      id: this.generateId(),
      title: String(title),
      message: String(message),
      type,
      link,
      metadata,
      read: false,
      createdAt: new Date().toISOString()
    };

    data.notifications.unshift(notification);

    this.saveData(data);

    this.emitEvent(
      "created",
      notification
    );

    return notification;
  },

  /**
   * Get all notifications.
   */
  getAll() {
    return this.getData().notifications;
  },

  /**
   * Get one notification by ID.
   */
  getById(notificationId) {

    if (!notificationId) {
      return null;
    }

    return this.getAll().find(
      notification => notification.id === notificationId
    ) || null;
  },

  /**
   * Get unread notifications.
   */
  getUnread() {
    return this.getAll().filter(
      notification => notification.read === false
    );
  },

  /**
   * Get unread notification count.
   */
  getUnreadCount() {
    return this.getUnread().length;
  },

  /**
   * Mark one notification as read.
   */
  markAsRead(notificationId) {

    const data = this.getData();

    const notification = data.notifications.find(
      item => item.id === notificationId
    );

    if (!notification) {
      return false;
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();

    this.saveData(data);

    this.emitEvent(
      "read",
      notification
    );

    return true;
  },

  /**
   * Mark one notification as unread.
   */
  markAsUnread(notificationId) {

    const data = this.getData();

    const notification = data.notifications.find(
      item => item.id === notificationId
    );

    if (!notification) {
      return false;
    }

    notification.read = false;
    delete notification.readAt;

    this.saveData(data);

    this.emitEvent(
      "unread",
      notification
    );

    return true;
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead() {

    const data = this.getData();

    const now = new Date().toISOString();

    data.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        notification.readAt = now;
      }
    });

    this.saveData(data);

    this.emitEvent(
      "all-read",
      {
        count: data.notifications.length
      }
    );

    return true;
  },

  /**
   * Delete one notification.
   */
  remove(notificationId) {

    const data = this.getData();

    const originalLength = data.notifications.length;

    data.notifications =
      data.notifications.filter(
        notification =>
          notification.id !== notificationId
      );

    if (data.notifications.length === originalLength) {
      return false;
    }

    this.saveData(data);

    this.emitEvent(
      "removed",
      {
        notificationId
      }
    );

    return true;
  },

  /**
   * Clear all notifications.
   */
  clearAll() {

    const data = this.getData();

    const count = data.notifications.length;

    data.notifications = [];

    this.saveData(data);

    this.emitEvent(
      "cleared",
      {
        count
      }
    );

    return true;
  },

  /**
   * Filter notifications by type.
   */
  getByType(type) {

    if (!type) {
      return [];
    }

    return this.getAll().filter(
      notification =>
        notification.type === type
    );
  },

  /**
   * Create a system notification.
   */
  system(title, message, options = {}) {
    return this.create({
      title,
      message,
      type: "system",
      ...options
    });
  },

  /**
   * Create a payment notification.
   */
  payment(title, message, options = {}) {
    return this.create({
      title,
      message,
      type: "payment",
      ...options
    });
  },

  /**
   * Create a trust notification.
   */
  trust(title, message, options = {}) {
    return this.create({
      title,
      message,
      type: "trust",
      ...options
    });
  },

  /**
   * Create a service notification.
   */
  service(title, message, options = {}) {
    return this.create({
      title,
      message,
      type: "service",
      ...options
    });
  },

  /**
   * Create a booking notification.
   */
  booking(title, message, options = {}) {
    return this.create({
      title,
      message,
      type: "booking",
      ...options
    });
  },

  /**
   * Create a community notification.
   */
  community(title, message, options = {}) {
    return this.create({
      title,
      message,
      type: "community",
      ...options
    });
  },

  /**
   * Emit a BISOVIA Core notification event.
   */
  emitEvent(action, detail = {}) {

    try {
      window.dispatchEvent(
        new CustomEvent(
          `bisovia:notification-${action}`,
          {
            detail
          }
        )
      );

    } catch (error) {
      console.error(
        "BISOVIA Notification Service: event error.",
        error
      );
    }
  },

  /**
   * Synchronize notifications with backend.
   *
   * Backend endpoint will be implemented later.
   */
  async syncWithBackend() {

    if (
      typeof window.BISOVIA_API === "undefined"
    ) {
      return {
        success: false,
        pendingBackend: true,
        message: "BISOVIA API is not connected yet."
      };
    }

    try {

      const response =
        await window.BISOVIA_API.post(
          "/api/notifications/sync",
          {
            notifications: this.getAll()
          }
        );

      return {
        success: true,
        data: response
      };

    } catch (error) {

      console.error(
        "BISOVIA Notification Service: backend sync failed.",
        error
      );

      return {
        success: false,
        pendingBackend: true,
        error
      };
    }
  },

  /**
   * Initialize the Notification Service.
   */
  init() {

    const data = this.getData();

    console.log(
      "BISOVIA Notification Service initialized.",
      {
        total: data.notifications.length,
        unread: this.getUnreadCount()
      }
    );

    return data;
  }
};


/**
 * Expose the Notification Service globally.
 */
window.BISOVIA_NOTIFICATIONS =
  BISOVIA_NOTIFICATIONS;


/**
 * Initialize Core Notification Service.
 */
BISOVIA_NOTIFICATIONS.init();
