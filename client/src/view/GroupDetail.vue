<template>
  <div>
    <Header
      leftIcon="chevron_left"
      rightIcon=""
      content="聊天信息"
      color=""
      @leftClick="goback"
      ></Header>
    <div class="all-chat">
      <div class="group-avatar group-list">
        <Avatar v-for="(item,index) in Object.keys(getUsers).slice(0, 18)" class="list-avatar" :key="index" :src="getUsers[item].src"></Avatar>
        <div class="group-more" v-show="Object.keys(getUsers).length > 18" @click="gotoMore">查看更多群成员</div>
      </div>
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
    </div>
  </div>
</template>

<script>
import Header from "@components/Header";
import Avatar from "@components/Avatar";
import {mapGetters, mapState} from 'vuex';
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
      allUser: {
        '005': {
          src: 'static/files/825836avatar-hua1995116.jpeg'
        }
      }
    };
  },

  computed: {
    ...mapGetters([
        'getUsers'
      ]),
  },

  mounted() {
    const allUser = {}
    let i = 0;
    while(i < 18) {
      allUser[i] = {
        src: 'static/files/825836avatar-hua1995116.jpeg'
      }
      i++;
      console.log(i);
    }
    this.allUser = allUser;
  },

  methods: {
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