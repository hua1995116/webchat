<template>
  <div>
    <Header
      leftIcon="chevron_left"
      rightIcon=""
      content="个人信息"
      color=""
      @leftClick="goback"
      ></Header>
    <div class="all-chat">
      <UserHead :src="lookUserInfo.src" :username="lookUserInfo.name"></UserHead>
      <div class="group-list">
        <mu-list>
          <mu-sub-header>信息</mu-sub-header>
          <mu-list-item button :ripple="false" @click="events = !events">
            <mu-list-item-title>
              注册时间
            </mu-list-item-title>
            <mu-list-item-action class="group-info-detail">
              <!-- <mu-switch v-model="events" readonly></mu-switch> -->
              2019-10-23
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="calls = !calls">
            <mu-list-item-title>
              电话
            </mu-list-item-title>
            <mu-list-item-action>
              <!-- <mu-switch v-model="calls" readonly></mu-switch> -->
              12393213312
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="messages = !messages">
            <mu-list-item-title>
              性别
            </mu-list-item-title>
            <mu-list-item-action>
              <Gender sex=""></Gender>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </div>
      <mu-row gutter class="user-tools">
        <mu-col span="6">
          <mu-button class="op" @click="letchat">发起聊天</mu-button>
        </mu-col>
        <mu-col span="6">
          <mu-button class="op" color="primary" @click="handelAddFriend">添加好友</mu-button>
        </mu-col>
      </mu-row>

    </div>
  </div>
</template>

<script>
import Header from "@components/Header";
import Avatar from "@components/Avatar";
import UserHead from "@components/userHead";
import Gender from "@components/Gender";
import {queryString} from '@utils/queryString';
import {mapGetters, mapState} from 'vuex';
import Alert from '@components/Alert';
export default {

  components: {
    Header,
    Avatar,
    UserHead,
    Gender
  },
  data () {
    return {
      events: false,
      calls: false,
      messages: false,
      notifications: false,
      sounds: false,
      videoSounds: false,
    };
  },

  computed: {
    ...mapState([
        'lookUserInfo',
        'userInfo'
      ]),
  },

  async mounted() {
    const id = queryString(window.location.href, 'id');
    await this.$store.dispatch('getUserInfo', {
      id,
    });
  },

  methods: {
    letchat() {
      Alert({
        content: '尽情期待'
      })
    },
    async handelAddFriend() {
      const res = await this.$store.dispatch('addFriend', {
        selfId: this.userInfo.id,
        friendId: this.lookUserInfo.id
      });
      if(res.data.errno === 0) {
        console.log('1111');
        Alert({
          content: res.data.data
        })
      } else {
        Alert({
          content: res.data.data
        })
      }
    },
    goback() {
      this.$router.isBack = true;
      this.$router.goBack();
    },
    gotoMore() {
      this.$router.push({ path: "/groupMember" });
    }
  }
}

</script>
<style lang='stylus' scoped>
.all-chat {
  overflow: scroll;
  height: calc(100vh - 50px);
  // background: #ddd;
}
.group-avatar {
  padding: 10px 0;
}
.list-avatar {
  margin-left: 10px;
}
.group-more {
  text-align: center;
}
.group-list {
  margin-bottom: 10px;
  background: #fff;
  .group-info-detail {
    min-width: 80px;
  }
}

.user-tools {
  width: 90%;
  margin: 0 auto;
  left:0;
  right: 0;
  position: absolute;
  bottom: 10px;
  .op {
    width 100%;
  }
}
</style>