export default function () {
  const u = navigator.userAgent;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  const classList = 'input';
  [].forEach.call(document.querySelectorAll(classList), function(el) {
    el.addEventListener("blur", function(e) {
      if (isIOS) {
        blurAdjust();
      }
    });
  });

  // 解决苹果不回弹页面 https://blog.csdn.net/m0_37520980/article/details/86305488
  function blurAdjust(e) {
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      let result = 'pc';
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { // 判断iPhone|iPad|iPod|iOS
        result = 'ios';
      } else if (/(Android)/i.test(navigator.userAgent)) { // 判断Android
        result = 'android';
      }

      if (result === 'ios') {
        document.activeElement.scrollIntoViewIfNeeded(true);
      }
    }, 100);
  }
}
