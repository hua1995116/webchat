import '../loading-over/loading.css';

const doc = window.document;
const $body = doc.body || doc.head;
const $loading = doc.createElement('div');
$loading.classList.add('loader');
$loading.innerHTML = `<div class="logo">
                          <div class="white"></div>
                          <div class="orange"></div>
                          <div class="red"></div>
                      </div>`;

const Loading = {
  show(style) {
    try {
      $loading.style.opacity = 1;
      Object.keys(style).map(item => ($loading.style[item] = style[item]));
      $body.appendChild($loading);
    } catch (e) {
    }
  },
  hide() {
    try {
      if ($loading.parentNode === $body) {
        $loading.style.opacity = 0;
        setTimeout(() => {
          $body.removeChild($loading);
        }, 200);
      }
    } catch (e) {
    }
  }
};

export default Loading;
