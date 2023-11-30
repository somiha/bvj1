import { showSuccessMenu, showSuccessMessage, showErrorMessage } from "/js/floating-success-menu.js";

const spinnerDiv = document.getElementById('spinner');
const spinnerDiv2 = document.getElementById('spinner2');
const inputFields = document.querySelectorAll('[data-regFormInput]');
const submitBtn = document.getElementById('regbtn');

/* Creating an Empty Object For Registration Form */
var formData = new Object;

/* Populate data into formData */
inputFields.forEach(item => {
  item.addEventListener('change', () => {
    formData[item.name] = item.value;
  })
});

const detectChange = () => {
  var hasChanged = false;
  for(var item in formData){
    hasChanged = true;
  }
  return hasChanged;
}

const doRegister = () => {
  return fetch('/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(formData)
  })
}

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  spinnerDiv.classList.remove('hidden');
  if(detectChange()){
    const requestRegister = doRegister();
    const data = await requestRegister;
    const response = await data.json();
    spinnerDiv.classList.add('hidden');
    if(response.success){
      showSuccessMenu();
      showSuccessMessage(response.message);
    }else {
      showSuccessMenu();
      showErrorMessage(response?.message);
    }
  }else {
    spinnerDiv.classList.add('hidden');
    showSuccessMenu();
    showErrorMessage('No changes detected');
  }
})

const changePassBtn = document.getElementById('changePass');
const passFields = document.querySelectorAll('[data-changePass]');

var passData = new Object;

passFields.forEach(item => {
  item.addEventListener('change', () => {
    passData[item.name] = item.value;
  })
});

const detectPassChange = () => {
  var hasChanged = false;
  for(var item in passData){
    hasChanged = true;
  }
  return hasChanged;
}

const doChangePass = () => {
  return fetch('/profile/change_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(passData)
  })
}

changePassBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  spinnerDiv2.classList.remove('hidden');
  if(detectPassChange()){
    const requestChangePass = doChangePass();
    const data = await requestChangePass;
    const response = await data.json();
    spinnerDiv2.classList.add('hidden');
    if(response.success){
      showSuccessMenu();
      showSuccessMessage(response.message);
    }else {
      showSuccessMenu();
      showErrorMessage(response?.message);
    }
  }else {
    spinnerDiv2.classList.add('hidden');
    showSuccessMenu();
    showErrorMessage('No changes detected');
  }
})

 