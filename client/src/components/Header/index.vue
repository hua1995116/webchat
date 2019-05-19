<template>
  <div class="header">
      <div class="title">
        <mu-appbar :color="color">
          <mu-button icon slot="left" @click="leftClick">
            <mu-icon :value="leftIcon"></mu-icon>
          </mu-button>
          <div class="center">
            {{content}}
          </div>
          <mu-button icon slot="right" @click="rightClick">
            <mu-icon :value="rightIcon"></mu-icon>
          </mu-button>
        </mu-appbar>
      </div>
  </div>
</template>

<script>
export default {
  props: ['content', 'leftIcon', 'rightIcon', 'color'],
  components: {},
  data() {
    return {};
  },

  computed: {},

  mounted() {
  },

  methods: {
    leftClick() {
      this.$emit('leftClick');
    },
    rightClick() {
      this.$emit('rightClick');
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.header {
  height: 56px;
}

.title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  .center {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding-left: 8px;
    padding-right: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 20px;
    font-weight: 400;
    line-height: 56px;
    text-align: center;
  }
}

.chat-inner {
  position: absolute;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  top: 56px;
  bottom: 80px;
}
</style>
