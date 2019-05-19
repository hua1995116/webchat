<template>
  <div class="login">
    <div class="header">
    </div>
    <div class="content">
      <form action="" name="form2">
        <mu-text-field class="field-input-login" label="帐号" v-model="username" name="username"></mu-text-field>
        <br/>
        <mu-text-field class="field-input-login" label="密码" v-model="password" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'" name="password"></mu-text-field>
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
import ios from '@utils/ios';
//  import Loading from '../components/loading/loading'

export default {
  data() {
    return {
      loading: "",
      username: "",
      password: "",
      visibility: false
    };
  },
  methods: {
    async submit() {
      const name = this.username.trim();
      const password = this.password.trim();
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
    // 微信 回弹 bug
    ios();
    if (!this.getSvgModal) {
      const svg = SvgModal();
      this.$store.commit("setSvgModal", svg);
    }
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
  .header {
    height: 50px;
  }
  .content {
    width: 80%;
    margin: 70px auto 20px;
    .field-input-login {
      .mu-input-label {
        color: rgba(254, 244, 244, 0.74)
      }
      .mu-input-line {
        background-color: rgba(254, 244, 244, 0.74)
      }
    }
    .mu-input {
      color: rgba(254, 244, 244, 0.74);
      width: 100%;
    }
    .mu-text-field-input {
      color: #fff;
    }
  }
}
.btn-radius {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.02);
  color: #fff;
  line-height: 40px;
  text-align: center;
  border-radius: 50px;
}
.tip-user {
  width 100%;
  text-align:center;
  margin-top: 20px;
  color:#fff;
}
</style>
