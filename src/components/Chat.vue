<template>
    <transition name="fade">
        <div class="container" v-show="getchattoggle">
            <div class="title">
                <mu-appbar title="Title">
                    <mu-icon-button icon="chevron_left" slot="left" @click="closechat"/>
                    <div class="center">
                        聊天({{Object.keys(getusers).length}})
                    </div>
                    <mu-icon-button icon="expand_more" slot="right"/>
                </mu-appbar>
            </div>
            <div class="chat">
                <div style="height:70px"></div>
                <div>在线人员</div>
                <div v-for="obj in getusers" class="online">
                    <img :src="obj.src" alt="">
                </div>
                <div v-for="obj in getmesshistoryinfos">
                    <othermsg v-if="obj.username!=getusername" :name="obj.username" :img="obj.src" :msg="obj.msg"></othermsg>
                    <mymsg v-if="obj.username==getusername" :name="obj.username" :img="obj.src" :msg="obj.msg"></mymsg>
                </div>
                <div v-for="obj in getinfos">
                    <othermsg v-if="obj.username!=getusername" :name="obj.username" :img="obj.src" :msg="obj.msg"></othermsg>
                    <mymsg v-if="obj.username==getusername" :name="obj.username" :img="obj.src" :msg="obj.msg"></mymsg>
                </div>
                <div style="height:120px"></div>
            </div>
            <div class="bottom">
                <div class="input">
                    <input type="text" id="message">
                </div>
                <mu-raised-button label="发送" class="demo-raised-button" primary @click="submess"/>
            </div>
        </div >
    </transition>
</template>

<script type="text/ecmascript-6" scoped>
    import Mymsg from './Mymsg.vue'
    import Othermsg from './Othermsg.vue'
    import { mapGetters } from 'vuex'
    import io from 'socket.io-client'
    export default{
        data() {
          return {
              socket: ''
          }
        },
        created() {
            // socket内部，this指针指向问题
            const that = this
            // 连接websocket地址
            this.socket = io.connect('localhost:8081')
            this.socket.on('message', function(obj) {
                that.$store.commit('addroomdetailinfos', obj)
                window.scrollTo(0, 900000)
            })
            this.socket.on('logout', function (obj) {
                that.$store.commit('setusers', obj)
            })
        },
        methods: {
            closechat() {
                this.$store.commit('changechattoggle')
                this.socket.emit('logout', this.getusername)
            },
            submess() {
                // 判断发送信息是否为空
                if (document.getElementById('message').value !== '') {
                    let obj = {
                        username: this.getusername,
                        src: this.getusersrc,
                        msg: document.getElementById('message').value
                    }
                    // 传递消息信息
                    this.socket.emit('message', obj)
                    document.getElementById('message').value = ''
                } else {
                    this.$store.commit('changedialog')
                    this.$store.commit('changedialoginfo', '内容不能为空')
                }
            }
        },
        computed: {
            ...mapGetters([
                'getinfos',
                'getchattoggle',
                'getusername',
                'getusersrc',
                'getusers',
                'getmesshistoryinfos'
            ])
        },
        components: {
            Mymsg,
            Othermsg
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    &.fade-enter-active, &.fade-leave-active
        transition: all 0.2s linear
        transform translate3d(0, 0, 0)
    &.fade-enter, &.fade-leave-active
        opacity: 0
        transform translate3d(100%, 0, 0)
    .container
        position: absolute
        left:0
        top:0
        width:100%
        min-height:100%
        background: #ffffff
        .title
            position:fixed
            height:50px
            top:0
            width:100%
            z-index:1
            .center
                -webkit-box-flex: 1
                -webkit-flex: 1
                -ms-flex: 1
                flex: 1
                padding-left: 8px
                padding-right: 8px
                white-space: nowrap
                text-overflow: ellipsis
                overflow: hidden
                font-size: 20px
                font-weight: 400
                line-height: 56px
                text-align:center
        .chat
            .online
                display:inline-block
                margin:5px
                img
                    width: 40px
                    height: 40px
                    border-radius:100%
        .bottom
            position:fixed
            height:50px
            bottom:0
            display: flex
            .input
                flex:1
                background #ddd
                padding:4px
                input
                    width: 100%
                    height: 42px
                    box-sizing: border-box
                    border: 1px solid #ddd
                    color: #333333
                    font-size: 18px
                    padding-left: 5px
                .mu-text-field
                    width:100%
            .demo-raised-button
                height:50px
                background:#ddd

</style>
