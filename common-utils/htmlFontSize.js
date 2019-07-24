/* 增加根元素fontsize为window的全局变量
 * px2rem 函数
 * */
function px2rem(px) {
  return px * 2 / 10 * window.rootFontSize + 'rem;'
}
(function setHtmlFontSize() {
  let rootEle = document.documentElement
  let fs = rootEle.clientWidth / 10 
  if (rootEle) {
    rootEle.style.fontSize = `${fs}px`
  }
  else {
    // copy from lib-flexible; might solve/cause unknown problem
    document.addEventListener('DOMContentLoaded', setHtmlFontSize)
  }
  window.rootFontSize = fs;
}())
