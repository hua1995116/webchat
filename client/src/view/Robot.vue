<template>
  <div>
    <div class="container">
      <div class="title">
        <mu-appbar color="primary">
          <mu-button icon slot="left" @click="goback">
            <mu-icon value="chevron_left"></mu-icon>
          </mu-button>
          大白客服
          <mu-button icon slot="right">
            <mu-icon value="expand_more"></mu-icon>
          </mu-button>
        </mu-appbar>
      </div>
      <div class="chat-inner">
        <div class="message-list" v-show="ishow">
          <Message
            v-for="obj in getRobotMsg"
            :key="obj.id"
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
        <!-- <div class="input" @keyup.enter="sendmessage">
          <input type="text" id="msg">
        </div>
        <mu-button class="demo-raised-button" color="primary" @click="sendmessage">发送</mu-button> -->
        <InputSumbit @sumbit="sendmessage"></InputSumbit>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import { mapGetters, mapState } from "vuex";
import Alert from '@components/Alert';
import Message from "@components/Message";
import InputSumbit from "@components/input-sumbit";
import { HOSTER_URL, HOSTER_NAME } from "@const/index";

export default {
  name: 'Robot',
  data() {
    return {
      hoster: HOSTER_NAME,
      hosterImg: HOSTER_URL,
      ishow: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.ishow = true;
    }, 200);
  },
  methods: {
    goback() {
      this.$router.isBack = true;
      this.$router.goBack();
    },
    sendmessage(info) {
      if (info === '') {
        Alert({
          content: '内容不能为空'
        });
        return;
      }
      const id = this.userid;
      const data = {
        info,
        id
      };
      this.$store.commit("setRobotMsg", {
        id: (+new Date()).toString(16),
        msg: info,
        username: this.hoster,
        src: this.hosterImg
      });
      this.$store.dispatch("getRobatMess", data);
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
    Message,
    InputSumbit
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
