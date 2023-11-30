import $ from "/js/modules/domFunc.js";
import {
  showSuccessMenu,
  showSuccessMessage,
  showErrorMessage,
} from "/js/floating-success-menu.js";

const spinnerDiv = document.getElementById("spinner");
const requiredFields = document.querySelectorAll("[required]");
const inputFields = document.querySelectorAll("[data-regFormInput]");
const submitBtn = document.getElementById("regbtn");

/* Creating an Empty Object For Registration Form */
var formData = new Object();

/* Checking if any Required Field is empty! */
inputFields.forEach((item) => {
  item.addEventListener("change", () => {
    formData[item.name] = item.value;
  });
});

const checkConfirmPAssword = () => {
  const passField = $('[name="password"]');
  const confirmPassField = $('[name="c_password"]');
  if (passField.value !== confirmPassField.value) {
    return false;
  } else {
    return true;
  }
};

const validateForm = () => {
  var flag = 0;
  requiredFields.forEach((item) => {
    if (item.value?.lenth === 0) {
      flag++;
    }
  });
  if (flag === 0) {
    return true;
  } else return false;
};

const doRegister = () => {
  return fetch("/register", {
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
  if (checkConfirmPAssword()) {
    if (validateForm()) {
      const requestRegister = doRegister();
      const data = await requestRegister;
      const response = await data.json();
      spinnerDiv.classList.add("hidden");
      if (response.success) {
        showSuccessMenu();
        showSuccessMessage(response.message);
        setTimeout(() => {
          location.href = `/login`;
        }, 2000);
      } else {
        showSuccessMenu();
        showErrorMessage(response?.message);
      }
    } else {
      spinnerDiv.classList.add("hidden");
      showSuccessMenu();
      showErrorMessage("Please fill all fields!");
    }
  } else {
    showSuccessMenu();
    showErrorMessage("Password Does Not Match!");
    spinnerDiv.classList.add("hidden");
  }
});
