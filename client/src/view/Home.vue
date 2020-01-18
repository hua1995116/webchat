<template>
  <div>
    <UserHead
      :src="src"
      :username="username"
      ></UserHead>
    <div class="content">
      <mu-list>
        <mu-list-item button :ripple="true"  @click="changeAvatar">
          <mu-list-item-action>
            <mu-icon value="send"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>修改头像</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true"  @click="handleTips">
          <mu-list-item-action>
            <mu-icon value="inbox"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>赞助一下</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true" @click="handleGithub">
          <mu-list-item-action>
            <mu-icon value="grade"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title >github地址</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true" @click="rmLocalData">
          <mu-list-item-action>
            <mu-icon value="drafts"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>清除缓存</mu-list-item-title>
        </mu-list-item>
      </mu-list>
      <!--<mu-divider/>-->
    </div>
    <div class="logout">
      <mu-button full-width class="demo-raised-button" color="error" @click="logout">退出</mu-button>
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

export default {
  name: 'Home',
  data() {
    return {};
  },
  async mounted() {
    if (!this.username && !this.userid) {
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
        clear();
        this.$store.commit("setUserInfo", {
          type: "userid",
          value: ""
        });
        this.$store.commit("setUserInfo", {
          type: "src",
          value: ""
        });
        this.$store.commit("setUserInfo", {
          type: "id",
          value: ""
        });
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
