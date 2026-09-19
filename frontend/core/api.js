/**
 * BISOVIA CORE
 * API Gateway / Core Contract
 *
 * This file provides the shared communication layer
 * between the BISOVIA frontend and backend.
 *
 * IMPORTANT:
 * No vertical business logic belongs here.
 */

const BISOVIA_API = {

  /*
   * Backend base URL.
   *
   * During frontend development, keep this empty.
   * Later, when the BISOVIA backend is deployed on Render,
   * this will point to the production API.
   */
  baseUrl: "",


  /**
   * Build an API URL.
   */
  url(path) {

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    return this.baseUrl + path;
  },


  /**
   * Shared GET request.
   */
  async get(path) {

    const response = await fetch(
      this.url(path),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return this.handleResponse(response);
  },


  /**
   * Shared POST request.
   */
  async post(path, data = {}) {

    const response = await fetch(
      this.url(path),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    return this.handleResponse(response);
  },


  /**
   * Shared PUT request.
   */
  async put(path, data = {}) {

    const response = await fetch(
      this.url(path),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    return this.handleResponse(response);
  },


  /**
   * Shared DELETE request.
   */
  async delete(path) {

    const response = await fetch(
      this.url(path),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return this.handleResponse(response);
  },


  /**
   * Handle API responses consistently.
   */
  async handleResponse(response) {

    let data = null;

    try {

      data = await response.json();

    } catch (error) {

      data = null;

    }


    if (!response.ok) {

      const message =
        data?.message ||
        "BISOVIA API request failed.";

      throw new Error(message);

    }


    return data;

  }

};


/**
 * Global access.
 *
 * Other BISOVIA Core services and modules can use:
 *
 * BISOVIA_API.get(...)
 * BISOVIA_API.post(...)
 * BISOVIA_API.put(...)
 * BISOVIA_API.delete(...)
 */
window.BISOVIA_API = BISOVIA_API;
