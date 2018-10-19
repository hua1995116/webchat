// created by https://github.com/xLogic92/vue-picture-preview
import lgPreview from './vue-picture-preview.vue'

export default {
    install: function (Vue, options) {
        // 添加的内容写在这个函数里面
        const LOGIC_EVENT_BUS = new Vue({
            data() {
                return {
                    LOGIC_PREVIEW: {
                        isTitleEnable: true,
                        isHorizontalNavEnable: true,
                        show: false,
                        loading: true,
                        current: {
                            title: '',
                            src: ''
                        },
                        list: []
                    }
                }
            }
        })

        window.LOGIC_EVENT_BUS = LOGIC_EVENT_BUS

        Vue.component('lg-preview', lgPreview)

        const updateIndex = function (list) {
            list.forEach(function (item, index) {
                item.index = index + 1
            })
        }

        function getImage(src, previewItem) {
            return new Promise(function (resolve, reject) {
                const img = new window.Image()
                img.src = src
                img.onload = function () {
                    previewItem['naturalHeight'] = img.naturalHeight
                    previewItem['naturalWidth'] = img.naturalWidth
                    setTimeout(function () {
                        LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = false
                    }, 500)
                    resolve(img)
                }
                img.error = function (e) {
                    reject(e)
                }
            })
        }

        Vue.directive('preview', {
            bind: function (el) {
                var previewItem = {
                    title: '',
                    el: el,
                    index: 0,
                    src: ''
                }
                LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.push(previewItem)
                updateIndex(LOGIC_EVENT_BUS.LOGIC_PREVIEW.list)
                el.addEventListener('click', function (e) {
                    e.stopPropagation()
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.isTitleEnable = el.getAttribute('preview-title-enable');
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.isHorizontalNavEnable = el.getAttribute('preview-nav-enable');
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.show = true
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = true
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.current = previewItem
                    getImage(previewItem.src, previewItem)
                })
            },
            update: function (el, oldValue) {
                var previewItem = LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.find(function (item) {
                    return item.el === el
                })
                if (!previewItem) return
                previewItem.src = oldValue.value
                previewItem.title = el.alt
            },
            unbind: function (el) {
                if (el) {
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.forEach(function (item, index) {
                        if (el === item.el) {
                            LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.splice(index, 1)
                        }
                    })
                }
                updateIndex(LOGIC_EVENT_BUS.LOGIC_PREVIEW.list)
            }
        })
    }
};
