<template>
  <div class="container">
    <div class="chat-inner">
      <div v-for="(obj, index) in getRobotMsg" :key="index" class="">
        <othermsg v-if="obj.user!=username" :name="obj.user" head="./static/img/robot.jpg"
                  :msg="obj.message"></othermsg>
        <mymsg v-if="obj.user==username" :name="username" :head="src" :msg="obj.message"></mymsg>
      </div>
    </div>
    <!-- <div style="height:250px"></div> -->
    <div class="con-input">
      <div class="input" @keyup.enter="sendmessage">
        <input type="text" id="msg">
      </div>
      <mu-raised-button label="发送" class="demo-raised-button" primary @click="sendmessage"/>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import Mymsg from '../components/Mymsg.vue'
  import Othermsg from '../components/Othermsg.vue'
  import {mapGetters} from 'vuex'
  import { getItem } from '../utils/localStorage'

  export default{
    data() {
      return {
        username: '',
        src: ''
      }
    },
    methods: {
      sendmessage() {
        if (!getItem('userid')) {
          this.$router.push({path: '/login'})
        }
        this.username = getItem('userid')
        this.src = getItem('src')
        const info = document.getElementById('msg').value
        const id = this.username
        const data = {
          'info': info,
          'id': id
        }
        this.$store.commit('setRobotMsg', {
          message: info,
          user: this.username
        })
        this.$store.dispatch('getRobatMess', data)
        document.getElementById('msg').value = ''
        setTimeout(() => {
          document.querySelector('.chat-inner').scrollTop = 10000
        })
      }
    },
    computed: {
      ...mapGetters([
        'getRobotMsg'
      ])
    },
    components: {
      Mymsg,
      Othermsg
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
      background: #ddd
</style>
