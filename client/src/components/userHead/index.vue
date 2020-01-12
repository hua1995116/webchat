<template>
  <div class="user-header">
    <div class="head">
      <img :src="src" alt="">
    </div>
    <div class="name">
      {{username}}
    </div>
    <div class="background">
      <img :src="src" alt="">
    </div>
  </div>
</template>

<script>
export default {

  components: {},
  props: ['src', 'username'],
  data () {
    return {
    };
  },

  computed: {},

  mounted() {},

  methods: {}
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
.user-header {
  position: relative;
  width: 100%;
  height: 200px;
  display: inline-block;

  .head {
    width: 80px;
    margin: 20px auto 0;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }

  .name {
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200px;
    z-index: -1;
    filter: blur(10px);

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>