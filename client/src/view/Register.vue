<template>
  <div class="login">
    <div class="content">
      <form action="" name="form2">
        <div class="context-logo">
          <img src="https://s3.qiufengh.com/webchat/webchat-logo-160.png" alt="">
          <!-- <SvgModal></SvgModal> -->
        </div>
        <Input v-model="username" type="text" placeholder="注册账号"/>
        <br/>
        <Input v-model="password" type="password" placeholder="输入密码"/>
        <br/>
        <div class="box box2" @click="submit">
          <Arrow></Arrow>
        </div>
      </form>
      <div class="bottom-wraper">
        <mu-flex align-items="center">
          <mu-flex justify-content="center" fill><div @click="login" class="tip-user">去登录</div></mu-flex>
          <mu-flex justify-content="center">|</mu-flex>
          <mu-flex justify-content="center" fill><div class="tip-user">忘记密码</div></mu-flex>
        </mu-flex>
        <div class="bottom-arguemnt">
          登录即可代表同意协议
        </div>
        <p style="text-align: center">浙ICP备16040413号-1</p>
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
import Arrow from '@components/arrow';
import Input from '@components/input';

export default {
  components: {
    Arrow,
    SvgModal,
    Input
  },
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
          this.$store.commit("setUserInfo", {
            type: "id",
            value: res.data.id
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
      this.username = '';
      this.password = '';
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
