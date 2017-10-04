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
        transitionName: 'slide-left'
      }
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
      next()
    }
  }
</script>

<style>
  .webview {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 0 15px 0px #d0cece;
  }
  .child-view {
    position: absolute;
    z-index: 100;
    height: 100%;
    width: 100%;
    overflow: hidden;
    transition: all .4s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter{
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
  .slide-left-leave-active {
    -webkit-transform: translate(-100px, 0);
    transform: translate(-100px, 0);
  }
  .slide-right-enter {
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }
  .slide-right-leave-active {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
</style>
