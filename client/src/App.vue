<template>
  <div id="app">
    <router-view></router-view>
    <lg-preview></lg-preview>
    <!--tab选项卡-->
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
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app {
  width: 100%;
  height: 100%;
}
</style>
