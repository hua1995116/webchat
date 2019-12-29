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
      {{lookUserInfo.name}}
      <div class="group-list">
        <mu-list>
          <mu-sub-header>声音开启设置</mu-sub-header>
          <mu-list-item button :ripple="false" @click="events = !events">
            <mu-list-item-title>
              事件和提醒
            </mu-list-item-title>
            <mu-list-item-action>
              <mu-switch v-model="events" readonly></mu-switch>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="calls = !calls">
            <mu-list-item-title>
              电话
            </mu-list-item-title>
            <mu-list-item-action>
              <mu-switch v-model="calls" readonly></mu-switch>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="messages = !messages">
            <mu-list-item-title>
              信息
            </mu-list-item-title>
            <mu-list-item-action>
              <mu-switch v-model="messages" readonly></mu-switch>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </div>
      <div class="group-list">
        <mu-list>
          <mu-sub-header>通知设置</mu-sub-header>
          <mu-list-item button :ripple="false" @click="notifications = !notifications">
            <mu-list-item-action>
              <mu-checkbox v-model="notifications" readonly></mu-checkbox>
            </mu-list-item-action>
            <mu-list-item-title>
              通知
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="sounds = !sounds">
            <mu-list-item-action>
              <mu-checkbox v-model="sounds" readonly></mu-checkbox>
            </mu-list-item-action>
            <mu-list-item-title>
              声音
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="videoSounds = !videoSounds">
            <mu-list-item-action>
              <mu-checkbox v-model="videoSounds" readonly></mu-checkbox>
            </mu-list-item-action>
            <mu-list-item-title>
              视频的声音
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </div>
      <mu-button color="primary" @click="handelAddFriend">添加好友</mu-button>
    </div>
  </div>
</template>

<script>
import Header from "@components/Header";
import Avatar from "@components/Avatar";
import {queryString} from '@utils/queryString';
import {mapGetters, mapState} from 'vuex';
import Alert from '@components/Alert';
export default {

  components: {
    Header,
    Avatar
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
    console.log(id);
    await this.$store.dispatch('getUserInfo', {
      id,
    });
    console.log(this.lookUserInfo);
    console.log(this.userInfo);
  },

  methods: {
    async handelAddFriend() {
      const res = await this.$store.dispatch('addFriend', {
        selfId: this.userInfo.id,
        friendId: this.lookUserInfo.id
      });
      if(res.data.errno === 0) {
        Alert({
          content: '添加成功'
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
  background: #ddd;
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
}
</style>