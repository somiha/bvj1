const fileInput = document.querySelector("#inputGroupFile02");
const fileLabel = document.querySelector('[for="inputGroupFile02"]');
const uploadBtn = document.querySelector("#uploadBtn");
const progressBar = document.querySelectorAll("[data-progressBar]");
const progressedBar = document.querySelector(".progress-bar");
const responsive = document.querySelector("[data-responsive]"); //for dynamic uploading text

fileInput.addEventListener("change", (e) => {
  const { name, size } = e.target.files[0];
  if (name.length == 0) {
    fileLabel.textContent = "Choose File";
  } else {
    var fileSize =
      size / 1024 < 1024
        ? `${parseFloat(size / 1024).toFixed(2)}K`
        : `${parseFloat(size / (1024 * 1024)).toFixed(2)}M`;
    fileLabel.textContent = name + `  (${fileSize})`;
  }
});

uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const selectedFile = fileInput.files[0];

  // if no file selected
  if (selectedFile == undefined) {
    alert("Please select a file");
    return;
  }

  // If file is selected
  uploadBtn.setAttribute("disabled", true);

  var payload = new FormData();
  payload.append("file_url", selectedFile);

  const request = new XMLHttpRequest();

  // get the paper_id from the url
  const url = new URL(window.location.href);
  const pathname = url.pathname;

  request.open("POST", `${pathname}`);

  progressBar.forEach((item) => {
    item.classList.remove("hidden");
  });

  var dotCount = 1;
  var interval = setInterval(() => {
    var str = "";
    for (var i = 0; i <= dotCount; i++) {
      str += ".";
    }
    dotCount++;
    if (dotCount == 3) {
      dotCount = 0;
    }
    responsive.textContent = "Uploading" + str;
  }, 400);

  request.upload.addEventListener("progress", (e) => {
    const uploadDone = parseInt((e.loaded / e.total) * 100);
    progressedBar.setAttribute("style", `width: ${uploadDone}%`);
    progressedBar.setAttribute("aria-valuenow", uploadDone);
    progressedBar.textContent = uploadDone + "%";

    if (uploadDone == 100) {
      clearInterval(interval);
    }
  });

  request.addEventListener("load", (e) => {
    const res = JSON.parse(request.response);
    if (request.status == 200) {
      responsive.textContent = res.message;
      responsive.classList.add("text-success");
      progressedBar.classList.add("bg-success");
      setTimeout(() => {
        window.location.href = "/track";
      }, 2000);
    } else {
      responsive.textContent = res.message;
      responsive.classList.add("text-danger");
      progressedBar.classList.add("bg-danger");
    }
  });
  request.send(payload);
});
