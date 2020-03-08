<template>
  <div class="hello">
    <div class="">
      <mu-appbar>
        <mu-button icon slot="left" >
        </mu-button>
        <div class="title">webchat</div>
        <mu-button icon slot="right">
          <mu-icon value="expand_more"></mu-icon>
        </mu-button>
      </mu-appbar>
    </div>
    <div class="chat-list">
      <mu-paper>
        <mu-list>
          <mu-sub-header>最近聊天记录</mu-sub-header>
          <mu-list-item avatar button :ripple="true" @click="chatwindow('room1')">
            <mu-list-item-action>
              <div class="avatar">
                <span class="tip" v-if="unRead1!==0">{{unRead1 > 99 ? '99+' : unRead1}}</span>
                <Avatar :src="house1" size="small"></Avatar>
              </div>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>聊天室1</mu-list-item-title>
              <mu-list-item-sub-title>{{getTailMsg('room1')}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item avatar button :ripple="true" @click="chatwindow('room2')">
            <mu-list-item-action>
              <div class="avatar">
                <span class="tip" v-if="unRead2!==0">{{unRead2 > 99 ? '99+' : unRead2}}</span>
                <Avatar :src="house2" size="small"></Avatar>
              </div>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>聊天室2</mu-list-item-title>
              <mu-list-item-sub-title>{{getTailMsg('room2')}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
        <mu-divider/>
        <mu-list>
          <mu-sub-header>客服</mu-sub-header>
          <mu-list-item avatar button :ripple="true" @click="chatRobot('')">
            <mu-list-item-action>
              <mu-avatar class="avatar">
                <img :src="robot">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-title>客服大白(微信群，作者联系方式，找我)</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
        <mu-list>
          <mu-sub-header>好友</mu-sub-header>
          <mu-list-item avatar button :ripple="true" @click="chatSingle(item.friendId._id, item.friendId.name)" v-for="item in friendList" :key="item._id">
            <mu-list-item-action>
              <mu-avatar class="avatar">
                <img :src="item.friendId.src">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{item.friendId.name}}</mu-list-item-title>
              <mu-list-item-sub-title>{{getSingleTailMsg(item.friendId._id)}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </mu-paper>
    </div>
    <Bottom></Bottom>
     <p style="text-align: center;position: absolute; bottom:0;width: 100%;">©2020 蓝色的秋风&nbsp&nbsp&nbsp<a href="http://beian.miit.gov.cn" target="_blank">浙ICP备16040413号-1</a></p>
  </div>
</template>

<script>
import Confirm from "@components/Confirm";
import Bottom from "@components/Bottom";
import Avatar from "@components/Avatar";
import { mapState } from "vuex";
import env from '@utils/env';
import { sort } from '@utils/tools';
import { ROBOT_URL, HOST_URL1, HOST_URL2 } from "@const/index";
import socket from "../socket";

export default {
  name: 'Loan',
  data() {
    return {
      house1: HOST_URL1,
      house2: HOST_URL2,
      robot: ROBOT_URL
    };
  },
  async mounted() {
    // 只全局监听一次
    if(this.userInfo.id) {
      this.$store.dispatch('postListFriend', {selfId: this.userInfo.id})
    }
  },
  methods: {
    getSingleTailMsg(friendId) {
      const userId = this.userInfo.id;
      const roomID = sort(userId, friendId);
      return this.getTailMsg(roomID);
    },
    getTailMsg(roomid) {
      const roomData = this.roomdetail[roomid] || [];
      if(roomData.length === 0) {
        return '暂无消息';
      }
      const lastMsg = roomData[roomData.length-1];
      const { username, msg, img } = lastMsg;

      if(img) {
        return `${username}说: [图片]`;
      } else {
        const content = `${username}说: ${msg}`;
        if(content.length > 15) {
          return `${username}说: ${msg.slice(0, 7)}...`;
        }
        return content;
      }
    },
    async chatwindow(roomID) {
      if (!this.userInfo.token) {
        const res = await Confirm({
          title: "提示",
          content: "聊天请先登录，但是你可以查看聊天记录哦~"
        });
        if (res === "submit") {
          this.$router.push({ path: "login" });
        }
        return;
      }
      this.$router.push({ path: "/chat", query: { roomId: roomID, type: 'group' } });
    },
    async chatSingle(friendId, friendName) {
      const userId = this.userInfo.id;
      const roomID = sort(userId, friendId);
      this.$router.push({ path: "/chat", query: { roomId: roomID, from: userId,to: friendId, type: 'single', friendName } });
    },
    chatRobot() {
      this.$router.push({ path: "/robot" });
    }
  },
  computed: {
    ...mapState({
      roomdetail: state => state.roomdetail,
      username: state => state.userInfo.userid,
      userid: state => state.userInfo.id,
      src: state => state.userInfo.src,
      isLogin: state => state.isLogin,
      unRead1: state => state.unRead.room1,
      unRead2: state => state.unRead.room2,
      userInfo: state => state.userInfo,
      friendList: state => state.friendList
    })
  },
  components: {
    Bottom,
    Avatar
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.title {
  text-align: center;
}
.chat-list {
  overflow-y: scroll;
  height: calc(100% - 133px);
}
.avatar {
  position: relative;

  .tip {
    position: absolute;
    right: -5px;
    top: -8px;
    padding: 0px 5px;
    border-radius: 10px;
    line-height: 20px;
    text-align: center;
    background: #ff2a2a;
    color: #fff;
    font-size: 12px;
  }

  .mu-avatar {
    img {
      border-radius: 5px;
    }
  }
}
</style>
