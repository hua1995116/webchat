export default {
  install: function(Vue, options) {
    Vue.directive("imgSize", {
      bind: function(el, binding) {
        const img = new window.Image();
        img.src = binding.value;
        img.onload = function() {
          el.src = binding.value;
          if(el.getAttribute('data-item') === 'last') {
            console.log('scrollIntoView');
            el.scrollIntoView();
          }
        };
        img.error = function(e) {
          reject(e);
        };
      },
      update: function(el, oldValue) {

      },
      unbind: function(el) {

      }
    });
  }
};
