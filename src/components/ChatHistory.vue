<template>
  <transition name="fade">
    <div class="container" v-show="getchattoggle">
      <div class="title">
        <mu-appbar title="Title">
          <mu-icon-button icon="chevron_left" slot="left" @click="closechat"/>
          <div class="center">
            聊天记录
          </div>
          <mu-icon-button icon="expand_more" slot="right" />
        </mu-appbar>
      </div>
      <div class="all-chat">
        <div style="height:70px"></div>

      <div class="chat">
        <div v-for="obj in getmesshistoryinfos">
          <othermsg v-if="obj.username!=getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
                    :img="obj.img" :mytime="obj.time"></othermsg>
          <mymsg v-if="obj.username==getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
                 :img="obj.img" :mytime="obj.time"></mymsg>
        </div>
        <div v-for="obj in getinfos">
          <othermsg v-if="obj.username!=getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
                    :img="obj.img" :mytime="obj.time"></othermsg>
          <mymsg v-if="obj.username==getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
                 :img="obj.img" :mytime="obj.time"></mymsg>
        </div>
        <div style="height:120px"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6" scoped>
  import Mymsg from './Mymsg.vue'
  import Othermsg from './Othermsg.vue'
  import {mapGetters} from 'vuex'
  // import io from 'socket.io-client'
  export default{
    data() {
      return {
        socket: ''
      }
    },
    created() {
      // socket内部，this指针指向问题
    },
    mounted() {
      window.scroll(0, 10000)
    },
    methods: {
      closechat() {
        this.$store.commit('changechattoggle')
        var obj = {
          name: this.getusername,
          roomid: this.getuserroom
        }
        this.getsocket.emit('logout', obj)
        this.$store.commit('setchat', false)
      },
    },
    computed: {
      ...mapGetters([
        'getsocket',
        'getinfos',
        'getchattoggle',
        'getusername',
        'getusersrc',
        'getuserroom',
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
    opacity: 1
    transform translate3d(100%, 0, 0)

  .container
    position: absolute
    left: 0
    top: 0
    width: 100%
    min-height: 100%
    background: #ffffff
    .title
      position: fixed
      height: 50px
      top: 0
      width: 100%
      z-index: 1
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
        text-align: center
    .chat
    .all-chat
      .online
        display: inline-block
        margin: 5px
        img
          width: 40px
          height: 40px
          border-radius: 100%
</style>
