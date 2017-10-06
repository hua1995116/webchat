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
      }, 1000)
      setTimeout(() => {
        this.close()
      }, 1500)
    },
    template: `
      <div class="wind-toast" :class="{'opacity0': toast}">
        <div class="wind-toast-content">
          {{content}}
        </div>
      </div>
    `
  }))
}
