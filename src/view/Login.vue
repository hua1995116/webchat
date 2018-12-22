<template>
  <div class="login">
    <div class="header">
    </div>
    <div class="content">
      <form action="" name="form2">
        <mu-text-field label="帐号" labelFloat name="username"/>
        <br/>
        <mu-text-field label="密码" type="password" labelFloat name="password"/>
        <br/>
        <div class="btn-radius" @click="submit">登录</div>
      </form>
      <div @click="register" class="tip-user">注册帐号</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SvgModal from "@components/svg-modal";
import Alert from "@components/Alert";
import Toast from "@components/Toast";
import socket from "../socket";
//  import Loading from '../components/loading/loading'

export default {
  data() {
    return {
      loading: ""
    };
  },
  methods: {
    async submit() {
      const name = document.form2.username.value.trim();
      const password = document.form2.password.value.trim();
      if (name !== "" && password !== "") {
        const data = {
          name: name,
          password: password
        };
        const res = await this.$store.dispatch("loginSubmit", data);
        if (res.status === "success") {
          Toast({
            content: res.data.data,
            timeout: 1000,
            background: "#2196f3"
          });
          this.$store.commit("setUserInfo", {
            type: "userid",
            value: res.data.name
          });
          this.$store.commit("setUserInfo", {
            type: "src",
            value: res.data.src
          });
          this.getSvgModal.$root.$options.clear();
          this.$store.commit("setSvgModal", null);
          this.$router.push({ path: "/" });
          socket.emit("login", { name });
        } else {
          Alert({
            content: res.data.data
          });
        }
        document.form2.reset();
      } else {
        Alert({
          content: "用户名和密码不能为空"
        });
      }
    },
    register() {
      this.$router.push({ path: "register" });
    }
  },
  mounted() {
    this.$store.commit("setTab", false);
    if (!this.getSvgModal) {
      const svg = SvgModal();
      this.$store.commit("setSvgModal", svg);
    }
    //      Loading.show()
  },
  computed: {
    getSvgModal() {
      return this.$store.state.svgmodal;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url('//s3.qiufengh.com/webchat/bg.jpg');
  background-size: 100% 100%;
  background-position: center center;

  .mu-appbar {
    text-align: center;

    .mu-flat-button-label {
      font-size: 20px;
    }
  }

  .content {
    width: 80%;
    margin: 70px auto 20px;

    .mu-text-field {
      width: 100%;
    }

    .mu-raised-button {
      min-width: 80px;
      display: block;
      width: 100%;
      margin: 0 auto;
      transition: all 0.375s;

      &.loading {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
  }
}
</style>
