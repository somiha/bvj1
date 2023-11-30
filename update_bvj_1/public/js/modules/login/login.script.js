import $ from "/js/modules/domFunc.js";
import {
  showSuccessMenu,
  showSuccessMessage,
  showErrorMessage,
} from "/js/floating-success-menu.js";

const spinnerDiv = $("#spinner");
const requiredFields = $("[required]");
const inputFields = $("[data-regFormInput]");
const submitBtn = $("#loginbtn");

/* Creating an Empty Object For Registration Form */
var formData = new Object();

/* Collect data from inputs */
inputFields.forEach((item) => {
  item.addEventListener("change", () => {
    formData[item.name] = item.value;
  });
});

/* Checking if any Required Field is empty! */
const validateForm = () => {
  var flag = 0;
  requiredFields.forEach((item) => {
    if (item.value.length == 0) {
      flag++;
    }
  });
  if (flag === 0) {
    return true;
  } else return false;
};

const doLogin = () => {
  return fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(formData),
  });
};

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerDiv.classList.remove("hidden");
  if (validateForm()) {
    const requestRegister = doLogin();
    const data = await requestRegister;
    const response = await data.json();
    spinnerDiv.classList.add("hidden");
    if (response.success) {
      showSuccessMenu();
      showSuccessMessage(response.message);
      setTimeout(() => {
        response.role == "admin"
          ? (location.href = `/admin_panel`)
          : (location.href = `/`);
      }, 2000);
    } else {
      showSuccessMenu();
      showErrorMessage(response?.message);
    }
  } else {
    spinnerDiv.classList.add("hidden");
    showSuccessMenu();
    showErrorMessage("Please fill all fields.");
  }
});
