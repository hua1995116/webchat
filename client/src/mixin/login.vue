<template></template>

<script>
export default {
  name: "mixins-login",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    isLogin() {
      if (this.$store.state.userInfo.token) {
        return false;
      }
      return true;
    }
  },
  mounted() {}
};
</script>
