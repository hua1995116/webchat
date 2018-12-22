<template>
  <div id="app">
    <router-view></router-view>
    <lg-preview></lg-preview>
    <!--tab选项卡-->
    <div class="app-bottom" v-if="istab">
      <mu-paper>
        <mu-bottom-nav :value="bottomNav" @change="handleChange">
          <mu-bottom-nav-item value="recents" title="主页" icon="restore" to="/"/>
          <mu-bottom-nav-item value="nearby" title="我的" icon="location_on" to="/home"/>
        </mu-bottom-nav>
      </mu-paper>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      bottomNav: "recents"
    };
  },
  methods: {
    handleChange(val) {
      this.bottomNav = val;
    }
  },
  computed: {
    ...mapState(["istab"])
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app {
  width: 100%;
  height: 100%;

  .app-bottom {
    position: fixed;
    bottom: 0;
    z-index: 102;
    width: 100%;
  }
}
</style>
