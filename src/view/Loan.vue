<template>
  <div class="hello">
    <div>
      <mu-list>
        <mu-sub-header>最近聊天记录</mu-sub-header>
        <mu-list-item title="聊天室1" @click="chatwindow('room1')">
          <mu-avatar src="//s3.qiufengh.com/images/house.png" slot="leftAvatar"/>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
        <mu-list-item title="聊天室2" @click="chatwindow('room2')">
          <mu-avatar src="//s3.qiufengh.com/images/house2.png" slot="leftAvatar"/>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
      </mu-list>
      <mu-divider/>
      <mu-list>
        <mu-sub-header>历史聊天记录</mu-sub-header>
        <mu-list-item title="聊天室1" @click="chatHistory('room1')">
          <mu-avatar src="//s3.qiufengh.com/images/house.png" slot="leftAvatar"/>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
        <mu-list-item title="聊天室2" @click="chatHistory('room2')">
          <mu-avatar src="//s3.qiufengh.com/images/house2.png" slot="leftAvatar"/>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
      </mu-list>
      <mu-list>
        <mu-sub-header>和小白聊天</mu-sub-header>
        <mu-list-item title="聊天室1" @click="chatRobot()">
          <mu-avatar src="./static/img/robot.jpg" slot="leftAvatar"/>
          <mu-icon value="chat_bubble" slot="right"/>
        </mu-list-item>
      </mu-list>
    </div>
  </div>
</template>

<script>
  import Confirm from '@components/Confirm';
  import {mapState} from 'vuex';
  import { getItem, setItem } from '@utils/localStorage';
  import Toast from '@components/Toast';

  export default {
    async mounted() {
      console.log(this.userid);
      const uerId = this.userid;
      if (!uerId) {
        await Confirm({
          title: '提示',
          content: '请先登录'
        })
        this.$router.push({ path: 'login' });
      } else {
        this.$store.commit('setTab', true);
        this.setUpdateLog();
      }
    },
    methods: {
      setUpdateLog() {
        const update = getItem('update-20180916');
        if (!update) {
          setItem('update-20180916', true);
          Toast({
            content: '修复消息滚至底部效果,重构部分组件~',
            timeout: 3000
          });
        }
      },
      chatHistory(roomID) {
        this.$store.commit('setTab', false);
        this.$router.push({path: '/chat-history', query: {roomId: roomID}});
      },
      chatwindow(roomID) {
        this.$store.commit('setTab', false);
        this.$router.push({path: '/chat', query: {roomId: roomID}});
      },
      chatRobot() {
        this.$store.commit('setTab', false);
        this.$router.push({path: '/robot'});
      }
    },
    computed: {
      ...mapState({
        userid: state => state.userInfo.userid,
        src: state => state.userInfo.src
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
