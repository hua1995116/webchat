<template>
    <transition name="fade">
        <div class="lg-preview-wrapper" v-show="preview.show" @click="leave" @touchmove.prevent>
            <div class="lg-preview-loading" v-show="preview.loading"><div></div></div>
            <img
                class="lg-preview-img"
                v-if="preview.current.src"
                :src="preview.current.src"
                :alt="preview.current.title"
                v-show="!preview.loading"
            >
            <div class="lg-preview-title" v-if="preview.isTitleEnable&&preview.current.title" v-show="!preview.loading">
                {{preview.current.title}}
            </div>
            <div class="lg-preview-nav-left" v-if="preview.isHorizontalNavEnable" v-show="!preview.loading">
                <span class="lg-preview-nav-arrow" @click="preAction" ></span>
            </div>
            <div class="lg-preview-nav-right" v-if="preview.isHorizontalNavEnable" v-show="!preview.loading">
                <span class="lg-preview-nav-arrow" @click="nextAction"></span>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: "Preview",
  computed: {
    preview() {
      return window.LOGIC_EVENT_BUS.LOGIC_PREVIEW;
    }
  },
  methods: {
    leave(e) {
      if (
        this.preview.show &&
        e.target.className.indexOf("lg-preview-nav-arrow") !== 0
      ) {
        this.close();
      }
    },
    close() {
      this.preview.show = false;
    },
    preAction() {
      this.preview.loading = true;
      var index = this.preview.list.indexOf(this.preview.current);
      if (index === 0) {
        this.preview.loading = false;
        return;
      }
      index--;
      this.preview.current = this.preview.list[index];
      const img = new window.Image();
      img.src = this.preview.current.src;
      img.onload = function() {
        setTimeout(function() {
          window.LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = false;
        }, 500);
      };
    },
    nextAction() {
      this.preview.loading = true;
      var index = this.preview.list.indexOf(this.preview.current);
      if (index === this.preview.list.length - 1) {
        this.preview.loading = false;
        return;
      }
      index++;
      this.preview.current = this.preview.list[index];
      const img = new window.Image();
      img.src = this.preview.current.src;
      img.onload = function() {
        setTimeout(function() {
          window.LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = false;
        }, 500);
      };
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.lg-preview-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
}
.lg-preview-loading {
  position: absolute;
  width: 30px;
  height: 35px;
  top: 50%;
  left: 50%;
  margin-top: -17.5px;
  margin-left: -15px;
}
.lg-preview-loading > div {
  display: inline-block;
  height: 25px;
  width: 25px;
  background: transparent;
  border-radius: 100%;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: rotate 0.75s 0s linear infinite;
  animation: rotate 0.75s 0s linear infinite;
}
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg) scale(1);
    transform: rotate(0deg) scale(1);
  }
  50% {
    -webkit-transform: rotate(180deg) scale(0.6);
    transform: rotate(180deg) scale(0.6);
  }
  100% {
    -webkit-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
  }
}
.lg-preview-img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.lg-preview-nav-arrow {
  position: absolute;
  top: 50%;
  margin-top: -15px;
  background: rgba(0, 0, 0, 0);
  line-height: 40px;
  width: 20px;
  height: 20px;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
}
.lg-preview-nav-left,
.lg-preview-nav-right {
  position: absolute;
  height: 100%;
  margin: 0 5px;
  width: 200px;
  top: 0;
  color: #fff;
  transition: opacity 0.2s;
}
.lg-preview-nav-left {
  left: 0;
}
.lg-preview-nav-left .lg-preview-nav-arrow {
  left: 0;
  margin-left: 40px;
  transform: rotate(-45deg);
}
.lg-preview-nav-right {
  right: 0;
}
.lg-preview-nav-right .lg-preview-nav-arrow {
  right: 0;
  margin-right: 40px;
  transform: rotate(135deg);
}
.lg-preview-title {
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: center;
  width: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}
@media all and (max-width: 768px) {
  .lg-preview-nav-left,
  .lg-preview-nav-right {
    width: 100px;
  }
  .lg-preview-nav-left .lg-preview-nav-arrow {
    margin-left: 20px;
  }
  .lg-preview-nav-right .lg-preview-nav-arrow {
    margin-right: 20px;
  }
}
</style>
