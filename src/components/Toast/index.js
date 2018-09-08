import Vue from 'vue'
import './index.css'

const root = window.document.body

export default function Toast(config) {
  const wrap = document.createElement('div')
  const div = document.createElement('div')

  root.appendChild(wrap)
  wrap.appendChild(div)

  config = config || {}

  return new Promise(resolve => new Vue({
    el: div,
    data: {
      content: config.content || '',
      timeout: config.timeout || 1500,
      background: config.background || 'rgba(0, 0, 0, 0.7)',
      toast: false
    },
    methods: {
      close() {
        root.removeChild(wrap)
        resolve(this)
      }
    },
    mounted() {
      setTimeout(() => {
        this.toast = true
      }, this.timeout)
      setTimeout(() => {
        this.close()
      }, this.timeout + 1000)
    },
    template: `
      <div class="wind-toast" :class="{'opacity0': toast}" :style="{'background-color': background}">
        <div class="wind-toast-content">
          {{content}}
        </div>
      </div>
    `
  }))
}
