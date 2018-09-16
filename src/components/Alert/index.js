import Vue from 'vue'
import './index.css'

const root = window.document.body

export default function Alert(config) {
  const wrap = document.createElement('div');
  const div = document.createElement('div');
  wrap.style.position = 'absolute';
  wrap.style.width = '100%';
  wrap.style.height = '100%';
  wrap.style.left = '0';
  wrap.style.top = '0';

  root.appendChild(wrap)
  wrap.appendChild(div)

  config = config || {}

  return new Promise(resolve => new Vue({
    el: div,
    data: {
      title: config.title || '提示',
      content: config.content || '',
      btn: config.btn || '确定',
      html: config.html || ''
    },
    methods: {
      close() {
        root.removeChild(wrap)
        resolve(this)
      }
    },
    template: `
      <div class="wind-alert">
        <div class="wind-alert-bg"></div>
        <div class="wind-alert-dialog animate-scale">
          <div class="wind-alert-title">{{title}}</div>
          <div v-if="content" class="wind-alert-content">{{content}}</div>
          <div v-if="html" class="wind-alert-content" v-html="html"></div>
          <div class="wind-alert-btn" @click="close">{{btn}}</div>
        </div>
      </div>
    `
  }))
}
