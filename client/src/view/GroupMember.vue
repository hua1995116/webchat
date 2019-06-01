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
        <Avatar v-for="(obj,index) in getUsers" class="list-avatar" :key="index" :src="obj.src"></Avatar>
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
      allUser: {}
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
    while(i < 180) {
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