import $ from "/js/modules/domFunc.js";
import {
  showSuccessMenu,
  showSuccessMessage,
  showErrorMessage,
} from "/js/floating-success-menu.js";

const spinnerDiv = $("#spinner");
const inputField = $("[data-searchFormInput]");
const submitBtn = $("#searchbtn");
const resultDiv = $("#result");
const resultList = $("#resut_list_item");

var sendEmailBtn;

/* Creating an Empty Object For Registration Form */
var formData = new Object();

/* Collect data from inputs */
inputField.addEventListener("change", () => {
  formData[inputField.name] = inputField.value;
});

const doSearch = () => {
  return fetch("/login/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(formData),
  });
};

const doSendMail = () => {
  return fetch("/login/recovery-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      email: $("#send-recovery-email").getAttribute("aria-details"),
    }),
  });
};

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerDiv.classList.remove("hidden");
  const requestRegister = doSearch();
  const data = await requestRegister;
  const response = await data.json();
  spinnerDiv.classList.add("hidden");

  if (response.success) {
    resultDiv.classList.remove("hidden");
    resultList.innerHTML = `
    <div class="card mb-2">
    <div class="card-body">
      <div class="d-flex flex-column flex-lg-row justify-content-between items-center">
        <div class="d-flex flex-column">
          <span class="text-lg text-xl-lg font-medium">${response.data.email}</span>
        </div>
        <div class="d-flex flex-column mt-1">
          <button class="btn btn-primary text-sm-sm text-lg-lg" id="send-recovery-email" aria-details="${response.data.email}"><div id="spinner2" class="hidden spinner-border text-light h-5 w-5 mr-2" role="status"></div>Send Email</button>
        </div>
      </div>
    </div>
  </div>`;
    sendEmailBtn = $("#send-recovery-email");
    sendEmailBtn.addEventListener("click", async (e) => {
      sendEmailBtn.setAttribute("disabled", true);
      const spinner2 = $("#spinner2");
      spinner2.classList.remove("hidden");
      const data = await doSendMail();
      const response = await data.json();
      if (response.success) {
        spinner2.classList.add("hidden");
        sendEmailBtn.textContent = "Email Sent!";
        showSuccessMenu();
        showSuccessMessage(response.message);
      }
    });
  } else {
    resultDiv.classList.remove("hidden");
    resultList.innerHTML = `<div class="card mb-2">
    <div class="card-body">
      <div id="email-not-found">
        Email not found!
      </div>
    </div>`;
  }
});
