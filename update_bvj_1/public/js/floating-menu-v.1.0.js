const container1 = document.getElementById('floating1');
const container2 = document.getElementById('floating2');
const container3 = document.getElementById('floating3');
const menuType = document.querySelectorAll('[data-floating-menu]');
const closeBtn = document.querySelectorAll('[data-close-btn]');

const showContainer = (menu_no) => {
  const menu_noInt = parseInt(menu_no);
  switch(menu_noInt){
    case 1: {
      container1.classList.remove('pointer-events-none');
      container1.classList.remove('opacity-0');
      break;
    }
    case 2: {
      container2.classList.remove('pointer-events-none');
      container2.classList.remove('opacity-0');
      break;
    }
    case 3: {
      container3.classList.remove('pointer-events-none');
      container3.classList.remove('opacity-0');
      break;
    }
  }
  
}

const hideContainer = (menu_no) => {
  const menu_noInt = parseInt(menu_no);
  switch(menu_noInt){
    case 1: {
      container1.classList.add('pointer-events-none');
      container1.classList.add('opacity-0');
      break;
    }
    case 2: {
      container2.classList.add('pointer-events-none');
      container2.classList.add('opacity-0');
      break;
    }
    case 3: {
      container3.classList.add('pointer-events-none');
      container3.classList.add('opacity-0');
      break;
    }
  }
}


menuType?.forEach(item => {
  item.addEventListener('click', (e) => {
    const index = item.getAttribute('aria-colindex');
    showContainer(index);
  })
});


closeBtn.forEach(item => {
  item.addEventListener('click', () => {
    const index = item.getAttribute('aria-colindex');
    hideContainer(index);
  })
})