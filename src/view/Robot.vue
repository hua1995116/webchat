<template>
  <div class="container">
    <div class="title">
      <mu-appbar title="Title">
        <mu-icon-button icon="chevron_left" slot="left" @click="goback"/>
        <div class="center">
        </div>
        <mu-icon-button icon="expand_more" slot="right"/>
      </mu-appbar>
    </div>
    <div class="chat-inner">
      <div v-for="(obj, index) in getRobotMsg" :key="index" class="">
        <Message
              :is-self="obj.username === hoster" 
              :name="obj.username" 
              :head="obj.src" 
              :msg="obj.msg"
              :img="obj.img" 
              :mytime="obj.time"
            ></Message>
      </div>
    </div>
    <div class="con-input">
      <div class="input" @keyup.enter="sendmessage">
        <input type="text" id="msg">
      </div>
      <mu-raised-button label="发送" class="demo-raised-button" primary @click="sendmessage"/>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import { mapGetters, mapState } from "vuex";
import Message from "@components/Message";
import { HOSTER_URL, HOSTER_NAME } from "@const/index";

export default {
  data() {
    return {
      hoster: HOSTER_NAME,
      hosterImg: HOSTER_URL
    };
  },
  mounted() {
    // this.$store.commit('setTab', true);
  },
  methods: {
    goback() {
      this.$router.goBack();
      this.$store.commit("setTab", true);
    },
    sendmessage() {
      const info = document.getElementById("msg").value;
      const id = this.userid;
      const data = {
        info,
        id
      };
      this.$store.commit("setRobotMsg", {
        msg: info,
        username: this.hoster,
        src: this.hosterImg
      });
      this.$store.dispatch("getRobatMess", data);
      document.getElementById("msg").value = "";
    }
  },
  computed: {
    ...mapGetters(["getRobotMsg"]),
    ...mapState({
      userid: state => state.userInfo.userid,
      src: state => state.userInfo.src
    })
  },
  components: {
    Message
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f1f5f8;

  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;

    .center {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      padding-left: 8px;
      padding-right: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 20px;
      font-weight: 400;
      line-height: 56px;
      text-align: center;
    }
  }

  .chat-inner {
    position: absolute;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    top: 56px;
    bottom: 80px;
  }

  .con-input {
    width: 100%;
    position: fixed;
    height: 50px;
    bottom: 0px;
    display: flex;

    .input {
      flex: 1;
      background: #ddd;
      padding: 4px;

      input {
        width: 100%;
        height: 42px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        color: #333333;
        font-size: 18px;
        padding-left: 5px;
      }

      .mu-text-field {
        width: 100%;
      }
    }

    .demo-raised-button {
      height: 50px;
    }
  }
}
</style>
