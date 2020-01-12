<template>
  <div>
    <SearchBar disabled="true" @submit="handleSearch"></SearchBar>
    <div>
      <mu-sub-header>vvvvip</mu-sub-header>
      <mu-chip class="list-chip vip-chip" color="#282b2d" v-for="item in vipUserList" :key="item._id" @click="lookInfo({_id: item.name})">
        <!-- icon-huangguan -->
        <mu-avatar :size="32">
          <img :src="item.src">
        </mu-avatar>
        <img class="vip-img" src="https://s3.qiufengh.com/webchat/vvvip.png" />
        {{item.name > 10 ? `${item.name.slice(0,10)}...` : item.name}}
      </mu-chip>

      <mu-sub-header>热门用户</mu-sub-header>
      <mu-chip class="list-chip" :color="getColor()" v-for="item in hotUserList" :key="item._id" @click="lookInfo(item)">
        <mu-avatar :size="32">
          <img :src="item.user.src">
        </mu-avatar>
        {{item._id.length > 10 ? `${item._id.slice(0,10)}...` : item._id}}
      </mu-chip>
    </div>
    <div style="height:80px"></div>
    <Bottom></Bottom>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clear, removeItem } from "@utils/localStorage";
import Confirm from "@components/Confirm";
import Alert from "@components/Alert";
import Bottom from "@components/Bottom";
import UserHead from "@components/userHead";
import SearchBar from "@components/searchBar";
const randomColor = require('randomcolor');
import { sort } from '@utils/tools';

export default {
  data() {
    return {};
  },
  async mounted() {
    await this.$store.dispatch('getHostUserList');
    await this.$store.dispatch('getvipuser');
    console.log(this.vipUserList);
  },
  methods: {
    changeAvatar() {
      this.$router.push("/avatar");
    },
    getColor() {
      return randomColor();
    },
    lookInfo(item) {
      this.$router.push({ path: "/persionDetail", query: { id: item._id } });
    },
    handleSearch() {
      // Alert({
      //   content: '尽情期待'
      // })
      this.$router.push("/searchResult");
    }
  },
  computed: {
    ...mapState([
      'hotUserList',
      'userInfo',
      'vipUserList'
    ])
  },
  components: {
    Bottom,
    UserHead,
    SearchBar
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.logout {
  margin: 0 20px;
}
.demo-chip-wrapper {
  text-align: center;
}
.list-chip {
  margin: 8px;
  vertical-align: middle;
}
.vip-chip {
  position: relative;
  .vip-img {
    display: block;
    left: -8px;
    top: -17px;
    width: 28px;
    position: absolute;
  }
}
</style>
