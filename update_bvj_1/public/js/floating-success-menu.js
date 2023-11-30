const successMenu = document.getElementById('success');
const provokeBtn = document.querySelectorAll('[data-success]');

const newDiv = document.createElement('div');

export const showSuccessMessage = (message) => {
  successMenu.innerHTML = ``;
  newDiv.className = `relative bg-white border border-gray-300 rounded w-72 h-auto py-8 flex flex-col justify-center items-center`;
  newDiv.innerHTML = `<div class="success-checkmark">
                      <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                      </div>
                    </div>
                    <div>
                      <span class="message">${message}</span>
                    </div>`;
  successMenu.appendChild(newDiv);
  setTimeout(() => {
    hideSuccessMenu();
  }, 2000)
}

export const showErrorMessage = (message) => {
  successMenu.innerHTML = ``;
  newDiv.className = `relative bg-white border border-gray-300 rounded w-72 h-auto py-8 flex flex-col justify-center items-center`;
  newDiv.innerHTML = `<div class="swal2-icon swal2-error swal2-animate-error-icon" style="display: flex;"><span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span></div>
                      <div>
                        <span class="error-message">${message}</span>
                      </div>`;
  successMenu.appendChild(newDiv);
  setTimeout(() => {
    hideSuccessMenu();
  }, 2000)
}



export const showSuccessMenu = () => {
  successMenu.classList.remove('opacity-0');
  successMenu.classList.remove('pointer-events-none');
}

const hideSuccessMenu = () => {
  successMenu.classList.add('opacity-0');
  successMenu.classList.add('pointer-events-none');
}

provokeBtn.forEach(item => {
  item.addEventListener('click', () => {
    const message = item.getAttribute('aria-details');
    showSuccessMenu();
    showSuccessMessage(message);
  })
})
