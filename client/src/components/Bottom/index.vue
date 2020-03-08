<template>
  <div class="app-bottom">
    <mu-paper>
      <mu-bottom-nav :value="bottomNav" v-if="bottomNav">
        <mu-bottom-nav-item value="#/" title="主页" icon="restore" to="/"/>
        <mu-bottom-nav-item value="#/search" title="搜索" icon="search" to="/search"/>
        <mu-bottom-nav-item value="#/home" title="我的" icon="location_on" to="/home"/>
      </mu-bottom-nav>
    </mu-paper>
  </div>
</template>

<script>
export default {

  components: {},
  data () {
    return {
      bottomNav: '',
    };
  },

  computed: {},

  mounted() {
    const hash = location.hash;
    this.bottomNav = hash;
  },

  methods: {}
}

</script>
<style lang='stylus' scoped>
.app-bottom {
  position: fixed;
  bottom: 21px;
  z-index: 102;
  width: 100%;
}
</style>