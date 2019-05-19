<template>
  <div class="login">
    <div class="header">
    </div>
    <div class="content">
      <form action="" name="form1">
         <mu-text-field class="field-input-login" label="帐号" v-model="username" name="username"></mu-text-field>
        <br/>
        <mu-text-field class="field-input-login" label="密码" v-model="password" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'" name="password"></mu-text-field>
        <br/>
        <div class="btn-radius" @click="submit">注册</div>
      </form>
      <div @click="login" class="tip-user">
        我已有帐号
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6" scoped>
import { mapState } from "vuex";
import SvgModal from "@components/svg-modal";
import Alert from "@components/Alert";
import Toast from "@components/Toast";
import socket from "../socket";
import ios from '@utils/ios';

export default {
  data() {
    return {
      username: "",
      password: "",
      visibility: false
    }
  },
  methods: {
    async submit() {
      const name = this.username.trim();
      const password = this.password.trim();
      const src = `//s3.qiufengh.com/avatar/${Math.ceil(
        Math.random() * 272
      )}.jpeg`;
      if (name !== "" && password !== "") {
        const data = {
          name: name,
          password: password,
          src: src
        };
        const res = await this.$store.dispatch("registerSubmit", data);
        if (res.status === "success") {
          Toast({
            content: res.data.data,
            timeout: 1000,
            background: "#2196f3"
          });
          this.$store.commit("setUserInfo", {
            type: "userid",
            value: data.name
          });
          this.$store.commit("setUserInfo", {
            type: "src",
            value: data.src
          });
          this.getSvgModal.$root.$options.clear();
          this.$store.commit("setSvgModal", null);
          this.$router.push({ path: "/" });
          socket.emit("login", { name });
        } else {
          await Alert({
            content: res.data.data
          });
        }
      } else {
        Alert({
          content: "账号密码不能为空"
        });
      }
    },
    login() {
      this.$router.push({ path: "login" });
    }
  },
  mounted() {
    // 微信 回弹 bug
    ios();
    if (!this.svgmodal) {
      const svg = SvgModal();
      this.$store.commit("setSvgModal", svg);
    }
  },
  computed: {
    ...mapState(["svgmodal"]),
    getSvgModal() {
      return this.$store.state.svgmodal;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
