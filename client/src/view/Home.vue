<template>
  <div>
    <UserHead :src="src" :username="username"></UserHead>
    <div class="content">
      <mu-list>
        <mu-list-item button :ripple="true" @click="changeAvatar">
          <mu-list-item-action>
            <mu-icon value="send"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>修改头像</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true" @click="handleTips">
          <mu-list-item-action>
            <mu-icon value="inbox"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>赞助一下</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true" @click="handleGithub">
          <mu-list-item-action>
            <mu-icon value="grade"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>github地址</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true" @click="rmLocalData">
          <mu-list-item-action>
            <mu-icon value="drafts"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>清除缓存</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="checkNotice">
          <mu-list-item-action>
            <mu-icon value="email"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>检查通知</mu-list-item-title>
        </mu-list-item>
      </mu-list>
      <!--<mu-divider/>-->
    </div>
    <div class="logout">
      <mu-button
        full-width
        class="demo-raised-button"
        color="error"
        @click="logout"
        >退出</mu-button
      >
    </div>
    <div style="height:80px"></div>
    <Bottom></Bottom>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clear, removeItem } from "@utils/localStorage";
import Confirm from "@components/Confirm";
import Alert from "@components/Alert";
import Bottom from "@components/Bottom";
import UserHead from "@components/userHead";
import socket from "../socket";
import loginMixin from '../mixin/login';

export default {
  name: "Home",
  mixins: [loginMixin],
  data() {
    return {};
  },
  async mounted() {
    if (this.isLogin()) {
      const data = await Confirm({
        title: "提示",
        content: "需要登录后才能查看哦~",
        ok: "去登录",
        cancel: "返回首页"
      });
      if (data === "submit") {
        this.$router.push("/login");
        return;
      }
      this.$router.push("/");
    }
  },
  methods: {
    checkNotice() {

      if (!("Notification" in window)) {
        Alert({
          content: "您的浏览器暂不支持该功能"
        });
      }

      // 检查用户是否同意接受通知
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        Alert({
          content: "您已开启通知"
        });
      }

      // 否则我们需要向用户获取权限
      else if (Notification.permission !== "denied") {
        console.log('获取权限');
        Notification.requestPermission(function(permission) {
          // 如果用户同意，就可以向他们发送通知
          if (permission === "granted") {
            Alert({
              content: "开启权限成功"
            });
          } else {
            Alert({
              content: "开启权限拒绝"
            });
          }
        });
      } else {
        console.log(Notification.permission);
      }
    },
    changeAvatar() {
      this.$router.push("/avatar");
    },
    async rmLocalData() {
      const data = await Confirm({
        title: "提示",
        content: "清除缓存会导致更新历史再再次提醒，确定清除？"
      });
      if (data === "submit") {
        removeItem("update-20180916");
      }
    },
    async logout() {
      const data = await Confirm({
        title: "提示",
        content: "你忍心离开吗？"
      });
      if (data === "submit") {
        socket.emit('roomout');
        clear();
        this.$store.commit("setUserInfo", {});
        this.$store.commit("setUnread", {
          room1: 0,
          room2: 0
        });
        this.$router.push("/");
      }
    },
    handleGithub() {
      Alert({
        content: "https://github.com/hua1995116/webchat"
      });
    },
    handleTips() {
      Alert({
        title: "请我喝杯奶茶",
        html:
          '<div><img style="width: 200px" src="//s3.qiufengh.com/money/WechatIMG64.jpeg" /></div>'
      });
    }
  },
  computed: {
    ...mapState({
      username: state => state.userInfo.userid,
      userid: state => state.userInfo.id,
      src: state => state.userInfo.src
    })
  },
  components: {
    Bottom,
    UserHead
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.logout {
  margin: 0 20px;
}
</style>
