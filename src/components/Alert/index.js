import Vue from 'vue'
import './index.css'

const root = window.document.body

export default function Alert(config) {
  const wrap = document.createElement('div')
  const div = document.createElement('div')

  root.appendChild(wrap)
  wrap.appendChild(div)

  config = config || {}

  return new Promise(resolve => new Vue({
    el: div,
    data: {
      title: config.title || '提示',
      content: config.content || '',
      btn: config.btn || '确定'
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
          <div class="wind-alert-content">{{content}}</div>
          <div class="wind-alert-btn" @click="close">{{btn}}</div>
        </div>
      </div>
    `
  }))
}
