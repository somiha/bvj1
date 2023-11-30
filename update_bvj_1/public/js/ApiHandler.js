const API = {
  /**
   * Base URL of the API
   */

  url: "http://localhost:5040",

  _handleShowMessage(response) {
    let html;
    const modalContainer = document.createElement("div");
    modalContainer.className =
      "pointer-events-none fixed top-0 right-0 h-screen flex w-full justify-center items-center bg-black/40 z-50 transition-all duration-75 ease-in";
    modalContainer.id = "success";

    const modal = document.createElement("div");
    modal.className =
      "relative bg-white border border-gray-300 rounded w-72 h-auto py-8 flex flex-col justify-center items-center";

    if (response.success) {
      const checkmark = document.createElement("div");
      checkmark.className = "success-checkmark";

      const checkIcon = document.createElement("div");
      checkIcon.className = "check-icon";

      const lineTip = document.createElement("span");
      lineTip.className = "icon-line line-tip";

      const lineLong = document.createElement("span");
      lineLong.className = "icon-line line-long";

      const iconCircle = document.createElement("div");
      iconCircle.className = "icon-circle";

      const iconFix = document.createElement("div");
      iconFix.className = "icon-fix";

      const message = document.createElement("div");
      message.className = "message";
      message.innerText = response.message ? response.message : "Success!";

      checkIcon.appendChild(lineTip);
      checkIcon.appendChild(lineLong);
      checkIcon.appendChild(iconCircle);
      checkIcon.appendChild(iconFix);
      checkmark.appendChild(checkIcon);
      modal.appendChild(checkmark);
      modal.appendChild(message);
      modalContainer.appendChild(modal);
      html = modalContainer;
    } else {
      const errorIcon = document.createElement("div");
      errorIcon.className = "swal2-icon swal2-error swal2-animate-error-icon";
      errorIcon.style = "display: flex;";

      const xMark = document.createElement("span");
      xMark.className = "swal2-x-mark";

      const xMarkLineLeft = document.createElement("span");
      xMarkLineLeft.className = "swal2-x-mark-line-left";

      const xMarkLineRight = document.createElement("span");
      xMarkLineRight.className = "swal2-x-mark-line-right";

      const message = document.createElement("div");
      message.innerText = response.message ? response.message : "Error!";
      message.className = "error-message";

      xMark.appendChild(xMarkLineLeft);
      xMark.appendChild(xMarkLineRight);
      errorIcon.appendChild(xMark);
      modal.appendChild(errorIcon);
      modal.appendChild(message);
      modalContainer.appendChild(modal);
      html = modalContainer;
    }

    document.body.appendChild(html);
    setTimeout(() => {
      document.querySelector("#success").remove();
    }, 3000);
  },

  _loaderSpinner(spinner, spinner_Identifier) {
    if (spinner) {
      document.querySelector(spinner_Identifier).style.display = "block";
    } else {
      document.querySelector(spinner_Identifier).style.display = "none";
    }
  },

  /**
   * @get abstraction
   * @param {string} _endpoint - endpoint of the API
   * @param {boolean} spinner - show spinner or not
   * @param {boolean} responseModal - show response modal or not
   */
  async get(
    _endpoint,
    spinner = true,
    responseModal = true,
    spinner_Identifier = "#loader"
  ) {
    if (spinner) this._loaderSpinner(true, spinner_Identifier);
    return window
      .fetch(this.url + _endpoint)
      .then((res) => res.json())
      .then((res) => {
        if (spinner) this._loaderSpinner(false);
        if (responseModal) this._handleShowMessage(res, spinner_Identifier);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },

  /**
   *
   * @get For External API
   * @example https://api.github.com/users/username
   */
  async getX(
    _fullUrl,
    spinner = true,
    responseModal = true,
    spinner_Identifier = "#loader"
  ) {
    if (spinner) this._loaderSpinner(true, spinner_Identifier);
    return window
      .fetch(_fullUrl)
      .then((res) => res.json())
      .then((res) => {
        if (spinner) this._loaderSpinner(false, spinner_Identifier);
        if (responseModal) this._handleShowMessage(res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },

  /**
   * @post abstraction
   */
  async post(
    _endpoint,
    _data,
    spinner = true,
    responseModal = true,
    spinner_Identifier = "#loader",
    button_Identifier = "#submit"
  ) {
    if (spinner) this._loaderSpinner(true, spinner_Identifier);
    if (document.querySelector(button_Identifier)) {
      document.querySelector(button_Identifier).disabled = true;
    }
    return fetch(this.url + _endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (document.querySelector(button_Identifier)) {
          document.querySelector(button_Identifier).disabled = false;
        }
        if (spinner) this._loaderSpinner(false, spinner_Identifier);
        if (responseModal) this._handleShowMessage(res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  /**
   * @put abstraction
   */
  _put(_endpoint, _data) {
    return fetch(this.url + _endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_data),
    })
      .then((res) => res.json())
      .catch((err) => {
        throw err;
      });
  },

  /**
   *
   * @delete abstraction
   * @param {string} _endpoint - endpoint of the API
   */
  async delete(
    _endpoint,
    _body = {},
    spinner = true,
    responseModal = true,
    spinner_Identifier = "#loader",
    button_Identifier = "#submit"
  ) {
    return fetch(this.url + _endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_body),
    })
      .then((res) => res.json())
      .then((res) => {
        if (document.querySelector(button_Identifier)) {
          document.querySelector(button_Identifier).disabled = false;
        }
        if (spinner) this._loaderSpinner(false, spinner_Identifier);
        if (responseModal) this._handleShowMessage(res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
};
