<template>
  <div class="login">
    <div class="content">
      <form action="" name="form2">
        <div class="context-logo">
          <img src="https://s3.qiufengh.com/webchat/webchat-logo-160.png" alt="">
          <!-- <SvgModal></SvgModal> -->
        </div>
        <Input v-model="username" type="text" placeholder="输入账号"/>
        <br/>
        <Input v-model="password" type="password" placeholder="输入密码"/>
        <br/>
        <div class="box box2" @click="submit">
          <Arrow></Arrow>
        </div>
      </form>
      <div class="bottom-wraper">
        <mu-flex align-items="center">
          <mu-flex justify-content="center" fill><div @click="register" class="tip-user">注册帐号</div></mu-flex>
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

<script type="text/ecmascript-6">
import SvgModal from "@components/svg-modal/index.vue";
import Alert from "@components/Alert";
import Toast from "@components/Toast";
import socket from "../socket";
import ios from '@utils/ios';
import Arrow from '@components/arrow';
import Input from '@components/input';

export default {
  name: 'Login',
  components: {
    Arrow,
    SvgModal,
    Input
  },
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
          this.$store.commit("setUserInfo", {
            type: "id",
            value: res.data.id
          });
          this.$router.push({ path: "/" });
          socket.emit("login", { name });
        } else {
          Alert({
            content: res.data.data
          });
        }

        // document.form2.reset();
      } else {
        Alert({
          content: "用户名和密码不能为空"
        });
      }
      this.password = '';
    },
    register() {
      this.$router.push({ path: "register" });
    }
  },
  mounted() {
    // 微信 回弹 bug
    ios();
  },
  computed: {
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
  background: #eaeaea;
  background-size: 100% 100%;
  background-position: center center;
  .content {
    width: 80vw;
    margin: 60px auto 20px;
    .context-logo {
      width: 70vw;
      margin: 0 auto 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .mu-input {
      width: 100%;
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
}

.bottom-wraper {
  position: absolute;
  bottom: 50px;
  left:0;
  right: 0;
  margin: 0 auto;
  width: 60vw;
  .bottom-arguemnt {
    margin-top: 5px;
    text-align: center;
  }
}

.box {
  width: 80px;
  height: 80px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(120deg, #2196f3 0%, #8fd3f4 100%);
}

.box2 {
  border-radius: 55% 45% 73% 27% / 70% 58% 42% 30%;
  animation: morph1 4s infinite;
}
// @keyframes morph {
//   0% {
//     border-radius: 26% 74% 49% 51% / 21% 51% 49% 79%;
//   }
//   25% {
//     border-radius: 74% 26% 50% 50% / 53% 29% 71% 47%;
//   }
//   50% {
//     border-radius: 48% 52% 28% 72% / 45% 71% 29% 55%;
//   }
//   75% {
//     border-radius: 48% 52% 76% 24% / 70% 49% 51% 30%;
//   }
//   100% {
//     border-radius: 26% 74% 49% 51% / 21% 51% 49% 79%;
//   }
// }
@keyframes morph1 {
  0% {
    border-radius: 26% 74% 49% 51% / 21% 51% 49% 79%;
  }
  25% {
    border-radius: 74% 26% 50% 50% / 53% 29% 71% 47%;
  }
  50% {
    border-radius: 48% 52% 28% 72% / 45% 71% 29% 55%;
  }
  75% {
    border-radius: 48% 52% 76% 24% / 70% 49% 51% 30%;
  }
  100% {
    border-radius: 26% 74% 49% 51% / 21% 51% 49% 79%;
  }
}
</style>
