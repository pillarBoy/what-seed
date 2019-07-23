function px2rem(px) {
  return px * 2 / 10 * window.rem + 'rem;'
}
(function setHtmlFontSize() {
  let fs = document.documentElement.clientWidth / 10;
  window.rem = fs;
  document.querySelector('html').style = `font-size:${fs}px`;
}())