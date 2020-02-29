<template>
  <span>
    <i v-if="status === 'loading' " class="icon iconfont icon-loading circle-loading"></i>

    <i v-if="status === 'error' " class="icon iconfont icon-error" @click="error"></i>

  </span>
</template>

<script>
export default {
  props: ['status'],
  components: {},
  data() {
    return {};
  },

  computed: {},

  methods: {
    error() {
      this.$emit('error');
    }
  }
};
</script>
<style lang="stylus">
.circle-loading {
  color: #d0d0d0;
  display: block;
  animation: right-spin1 1000ms infinite both;
}

.icon-error {
  color: rgb(232, 22, 22);
}

@keyframes right-spin1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
