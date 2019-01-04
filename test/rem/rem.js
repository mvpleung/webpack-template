(function (document, window) {
  var docEl = document.documentElement,
    resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
  /**
   * 设置html标签的font-size.
   */
  var resetRootFontSize = function () {
    var clientWidth = docEl.clientWidth;

    if (!clientWidth) return;

    // docEl.style.fontSize = 100 * ( clientWidth / 750 ) + 'px';

    if (clientWidth >= 1080) {
      docEl.style.fontSize = '100px';
    } else {
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    }
  }

  /**
   * 设置html标签data-dpr/data-img属性.
   */
  // var resetDpr = function () {
  //   if (!window.devicePixelRatio) return;
  //   var imgType = window.devicePixelRatio > 2 ? 3 : 2;

  //   docEl.setAttribute('data-dpr', window.devicePixelRatio);
  //   docEl.setAttribute('data-img', imgType);
  // }

  resetRootFontSize()
  // resetDpr()
  if (!window.addEventListener) return;
  window.addEventListener(resizeEvent, function () {
    resetRootFontSize();
    // resetDpr();
  }, false)
})(document, window);