<template>
    <div class="clear" :class="[isSelf ? 'right' : 'left']" ref="msg">
        <div class="item">
            <div class="name">
                <span v-if="mytime">{{getdate}}</span> &nbsp;&nbsp;{{name}}
            </div>
            <span class="head-place">
                <img :src="head" alt="" class="head">
            </span>
            <div v-if="img">
                <img 
                    :src="img" 
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
        props: ['name', 'img', 'msg', 'head', 'mytime', 'is-self'],
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
            }
        },
        mounted() {
            this.$refs.msg.scrollIntoView()
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .clear
        margin-top: 10px
        .item
            max-width: 100%
            position: relative
            clear: both
            display: inline-block
            padding: 16px 40px 16px 20px
            margin: 10px 10px 20px 10px
            border-radius: 10px
            background-color: rgba(25, 147, 147, 0.2)
            .img
                max-width: 200px
            .name
                position: absolute
                top: -20px
                width: 280px
                height: 20px
                overflow: hidden
                -ms-text-overflow: ellipsis
                text-overflow: ellipsis
                white-space: nowrap
            .msg 
                word-break: break-all

            .time
                position: absolute
                top: -40px
                width: 200px
                height: 20px
                right: -70px
            .head-place 
                display: block
                width: 50px
                height: 50px
                position: absolute
                top: 0
                background: #ddd
                border-radius: 50px
                overflow: hidden
            .head
                width: 50px
                height: 50px
                border-radius: 50px
            &:after
                position: absolute
                top: 15px
                content: ''
                width: 0
                height: 0
                
    .left
        .item
            animation: show-chat-even 0.25s 1 ease-in
            float: left
            margin-left: 80px
            color: #0EC879
            &:after
                left: -15px
                border-top: 15px solid rgba(25, 147, 147, 0.2)
                border-left: 15px solid transparent
        .name
            text-align: left
            left: -70px;
        .time
            text-align: left
        .head-place
            left: -70px;

    .right 
        .item 
            animation: show-chat-odd 0.25s 1 ease-in
            float: right
            margin-right: 80px
            color: #0AD5C1
            &:after
                right: -15px
                border-top: 15px solid rgba(25, 147, 147, 0.2)
                border-right: 15px solid transparent
        .name
            text-align: right
            right: -70px;
        .time
            text-align: right 
        .head-place
            right: -70px;

        @keyframes show-chat-odd {
            0% {
                margin-right: -480px;
            }

            100% {
                margin-right: 0;
            }
        } 
        @keyframes show-chat-even {
            0% {
                margin-left: -480px;
            }

            100% {
                margin-left: 0;
            }
        }
</style>
