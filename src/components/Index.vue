<template>
    <div class="hello">
        <div>
            <mu-list>
                <mu-sub-header>最近聊天记录</mu-sub-header>
                <mu-list-item title="聊天室1" @click="chatwindow('room1')">
                    <mu-avatar src="./static/img/1.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="聊天室2" @click="chatwindow('room2')">
                    <mu-avatar src="./static/img/2.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="聊天室3">
                    <mu-avatar src="./static/img/3.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="聊天室4">
                    <mu-avatar src="./static/img/4.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="聊天室5">
                    <mu-avatar src="./static/img/5.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
            </mu-list>
            <mu-divider/>
            <mu-list>
                <mu-sub-header>历史聊天记录</mu-sub-header>
                <mu-list-item title="聊天室6">
                    <mu-avatar src="./static/img/6.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="聊天室7">
                    <mu-avatar src="./static/img/7.jpg" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
            </mu-list>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import io from 'socket.io-client'
    export default {
        name: 'hello',
        data () {
            return {
                socket: ''
            }
        },
        created() {
            var that = this
            this.$store.commit('setgetsocket', io.connect('localhost:8083/'))
            // this.socket = io.connect('localhost:8081')
            this.getsocket.on('login', function (obj) {
                console.log('member', obj)
                that.$store.commit('setusers', obj)
            })
            this.$nextTick(function () {
                if (this.getusername) {
                    this.$store.commit('closeregistertoggle')
                    this.$store.commit('closelogintoggle')
                }
            })
        },
        computed: {
            ...mapGetters([
                'getusername',
                'getusersrc',
                'getsocket'
            ])
        },
        methods: {
            chatwindow(roomID) {
                this.$store.commit('changechattoggle')
                var obj = {
                    name: this.getusername,
                    src: this.getusersrc,
                    roomid: roomID
                }
                this.$store.commit('setuserroom', roomID)
                this.getsocket.emit('login', obj)
                var data = {
                    roomid: roomID
                }
                this.$store.dispatch('getmesshistory', data)
                this.$store.commit('setroomdetailinfos')
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
