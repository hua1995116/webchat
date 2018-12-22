<template>
    <div class="clear" :class="[isSelf ? 'right' : 'left']" ref="msg">
        <div class="item">
            <div class="name">
                <span v-if="mytime">{{getdate}}</span> &nbsp;&nbsp;{{name}}
            </div>
            <span class="head-place">
                <img :src="avatar" alt="" class="head">
            </span>
            <div v-if="img">
                <img 
                    :src="pic"
                    alt="" 
                    v-preview="img"
                    class="img"
                    preview-title-enable="true"
                    preview-nav-enable="true">
            </div>
            <span v-if="msg">
                <span v-html="linkMsg" class="msg"></span>
                <!-- {{msg | link}} -->
            </span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import dateFormat from '../../utils/date'
    import {inHTMLData, uriInUnQuotedAttr} from 'xss-filters-es6';
    export default{
        props: ['name', 'img', 'msg', 'head', 'mytime', 'is-self', 'container'],
        computed: {
            getdate() {
                return dateFormat(new Date(this.mytime), 'yyyy-MM-dd HH:mm:ss')
            },
            linkMsg() {
                // 防止xss
                const filterValue = inHTMLData(this.msg);
                return filterValue.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g, function($0, $1) {
                    const url = $0;
                    return `<a style="color: #b374ff" href="${uriInUnQuotedAttr(url)}" target="_blank">${uriInUnQuotedAttr(url)}</a>`;
                });
            },
            avatar() {
                let avatar = this.head;
                const reg = /\.\/static\/img\/(\d+)\.jpg/;
                const matches = this.head.match(reg);
                if (matches) {
                    avatar = `//s3.qiufengh.com/avatar/${matches[1]}.jpeg`;
                }
                return `${avatar}?imageView2/2/w/120/h/120`;
            },
            pic() {
                let pic = this.img;
                if (pic.indexOf('data:image') > -1) {
                    return pic;
                }
                return `${pic}?imageView2/2/w/360`
            }
        },
        mounted() {
            this.$refs.msg.scrollIntoView();
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped src="./index.styl"></style>
