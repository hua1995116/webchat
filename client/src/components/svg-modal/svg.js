import Vue from 'vue';
import './index.css';
import Vivus from 'vivus';

const root = window.document.body;

export default function svg () {
  const wrap = window.document.createElement('div');
  const div = window.document.createElement('div');

  root.appendChild(wrap);
  wrap.appendChild(div);

  return new Vue({
    el: div,
    data: {
      timer: null
    },
    clear() {
      clearInterval(this.timer);
      root.removeChild(wrap);
    },
    mounted() {
      const vivus = new Vivus('my-svg');
      this.timer = setInterval(function () {
        vivus.stop()
          .reset()
          .play(2);
      }, 5000);
    },
    template: `
      
    `
  });
}


