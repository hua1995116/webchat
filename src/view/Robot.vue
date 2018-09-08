<template>
  <div class="container">
    <div class="chat-inner">
      <div v-for="(obj, index) in getRobotMsg" :key="index" class="">
        <Message
              :is-self="obj.username === username" 
              :name="obj.username" 
              :head="obj.src" 
              :msg="obj.msg"
              :img="obj.img" 
              :mytime="obj.time"
            ></Message>
      </div>
    </div>
    <div class="con-input">
      <div class="input" @keyup.enter="sendmessage">
        <input type="text" id="msg">
      </div>
      <mu-raised-button label="发送" class="demo-raised-button" primary @click="sendmessage"/>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import Message from '../components/Message'
  import {mapGetters} from 'vuex'
  import { getItem } from '../utils/localStorage'

  export default{
    data() {
      return {
        username: '',
        src: ''
      }
    },
    created() {
      this.username = getItem('userid')
      this.src = getItem('src')
    },
    methods: {
      sendmessage() {
        if (!getItem('userid')) {
          this.$router.push({path: '/login'})
        }
        const info = document.getElementById('msg').value
        const id = this.username
        const data = {
          'info': info,
          'id': id
        }
        this.$store.commit('setRobotMsg', {
          msg: info,
          username: this.username,
          src: this.src
        })
        this.$store.dispatch('getRobatMess', data)
        document.getElementById('msg').value = ''
      }
    },
    computed: {
      ...mapGetters([
        'getRobotMsg'
      ])
    },
    components: {
      Message
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  .chat-inner {
    position: absolute;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    top: 0;
    bottom: 100px;
  }
}
  .con-input
    width: 100%
    position: fixed
    height: 50px
    bottom: 55px
    display: flex
    .input
      flex: 1
      background #ddd
      padding: 4px
      input
        width: 100%
        height: 42px
        box-sizing: border-box
        border: 1px solid #ddd
        color: #333333
        font-size: 18px
        padding-left: 5px
      .mu-text-field
        width: 100%
    .demo-raised-button
      height: 50px
</style>
