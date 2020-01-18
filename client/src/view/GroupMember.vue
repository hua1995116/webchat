<template>
  <div>
    <Header
      leftIcon="chevron_left"
      rightIcon=""
      content="所有成员"
      color=""
      @leftClick="goback"
      ></Header>
    <div class="all-chat">
      <div class="group-avatar">
        <Avatar v-for="(obj,index) in roomUsers[roomid]" class="list-avatar" :key="index" :src="obj.src"></Avatar>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@components/Header";
import Avatar from "@components/Avatar";
import {queryString} from '@utils/queryString';
import {mapGetters, mapState} from 'vuex';
export default {
  name: 'GroupMember',

  components: {
    Header,
    Avatar
  },
  data () {
    return {
      roomid: '',
    };
  },

  computed: {
   ...mapState([
      'roomUsers'
    ]),
  },

  mounted() {
    const roomId = queryString(window.location.href, 'roomId');
    this.roomid = roomId;
  },

  methods: {
    goback() {
      this.$router.isBack = true;
      this.$router.goBack();
    },
  }
}

</script>
<style lang='stylus' scoped>
.all-chat {
  overflow: scroll;
  height: calc(100vh - 50px);
}
.group-avatar {
  padding: 10px 0;
}
.list-avatar {
  margin-left: 10px;
}
</style>