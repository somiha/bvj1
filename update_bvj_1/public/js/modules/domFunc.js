const $ = (selector) => {
  const dom = document.querySelectorAll(selector);
  if(dom.length === 1){
    return dom[0];
  }else {
    return dom;
  }
}

export default $;