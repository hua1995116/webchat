<template>
  <div class="webview">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'slide-top'
      };
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack;
      if (isBack) {
        this.transitionName = 'slide-bottom';
      } else {
        this.transitionName = 'slide-top';
      }
      this.$router.isBack = false;
      next();
    }
  };
</script>

<style>
  .webview {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 0 15px 0px #dbdada;
  }
  .child-view {
    position: absolute;
    z-index: 100;
    height: 100%;
    width: 100%;
    overflow: hidden;
    will-change: transform;
    transition: transform 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .slide-top-enter{
    opacity: 0;
    -webkit-transform: translate(0, 50%);
    transform: translate(0, 50%);
  }
  .slide-top-leave-active {
    opacity: 0;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
  }
  .slide-bottom-enter {
    opacity: 0;
    /* -webkit-transform: translate(0, -20%); */
    /* transform: translate(0, -20%); */
  }
  .slide-bottom-leave-active {
    opacity: 0;
    /* -webkit-transform: translate(0, 20%); */
    /* transform: translate(0, 20%); */
  }
</style>
