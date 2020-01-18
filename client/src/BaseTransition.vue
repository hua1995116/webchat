<template>
  <div class="webview">
    <transition :name="transitionName">
      <!-- <keep-alive include="Chat"> -->
          <router-view class="child-view"></router-view>
      <!-- </keep-alive> -->
      <!-- <router-view class="child-view"></router-view> -->
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'BaseTransition',
    data () {
      return {
        transitionName: 'slide-left'
      };
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack;
      if (isBack) {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = 'slide-left';
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
  .slide-left-enter{
    opacity: 0;
    -webkit-transform: translate(70%, 0);
    transform: translate(70%, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    -webkit-transform: translate(-70%, 0);
    transform: translate(-70%, 0);
  }
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-70%, 0);
    transform: translate(-70%, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(70%, 0);
    transform: translate(70%, 0);
  }
</style>
