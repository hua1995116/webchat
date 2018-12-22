<template>
  <div>
    <div class="header">
      <div class="head">
        <img :src="src" alt="">
      </div>
      <div class="name">
        {{userid}}
      </div>
      <div class="background">
        <img :src="src" alt="">
      </div>
    </div>
    <div class="content">
      <mu-list>
        <mu-list-item title="修改头像" @click="changeAvatar">
          <mu-icon slot="left" value="send"/>
        </mu-list-item>
        <mu-list-item title="赞助一下" @click="handleTips">
          <mu-icon slot="left" value="inbox"/>
        </mu-list-item>
        <mu-list-item title="github地址" @click="handleGithub">
          <mu-icon slot="left" value="grade"/>
        </mu-list-item>
        <mu-list-item title="清除缓存" @click="rmLocalData">
          <mu-icon slot="left" value="drafts"/>
        </mu-list-item>
      </mu-list>
      <!--<mu-divider/>-->
    </div>
    <div class="logout">
      <mu-raised-button @click="logout" label="退出" class="demo-raised-button" fullWidth/>
    </div>
    <div style="height:80px"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clear, removeItem } from "@utils/localStorage";
import Confirm from "@components/Confirm";
import Alert from "@components/Alert";
export default {
  data() {
    return {};
  },
  async mounted() {
    this.$store.commit("setTab", true);
    if (!this.userid) {
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
      this.$store.commit("setTab", false);
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
        this.$store.commit("setUnread", {
          room1: 0,
          room2: 0
        });
        this.$router.push("/");
        this.$store.commit("setTab", false);
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
      userid: state => state.userInfo.userid,
      src: state => state.userInfo.src
    })
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.header {
  position: relative;
  width: 100%;
  height: 200px;
  display: inline-block;

  .head {
    width: 80px;
    margin: 20px auto 0;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }

  .name {
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200px;
    z-index: -1;
    filter: blur(10px);

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.logout {
  width: 200px;
  margin: 0 auto;

  .mu-raised-button {
    background: #ff4081;
    color: #fff;
  }
}
</style>
