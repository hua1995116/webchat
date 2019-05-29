<template>
  <div class="chat-input-outer">
    <input v-bind="$attrs" ref="input" class="chat-input" :value="initValue" :type="type" @input="handleInput">
    <mu-icon @click="handleReset" v-show="cancel" size="24" value="cancel" class="chat-cancel"></mu-icon>
  </div>
</template>

<script>
export default {
  props: ['value', 'type'],
  components: {},
  data () {
    return {
      initValue: this.value,
      cancel: false
    };
  },

  computed: {},

  mounted() {},

  methods: {
    handleReset() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
      this.initValue = '';
      this.cancel = false;
    },
    handleInput(event) {
      if(event.target.value) {
        this.cancel = true;
      } else {
        this.cancel = false;
      }
      this.initValue = event.target.value;
      this.$emit('input', event.target.value);
    },
  }
}

</script>
<style lang='stylus' scoped>
.chat-input-outer {
  display: flex
  width: 100%;
  border-radius: 100px;
  padding: 5px;
  overflow: hidden;
  background: #f2f3f7;
  align-items: center;
  .chat-input {
    width 100%;
    background: #f2f3f7;
    height: 48px;
    font-style: inherit;
    font-variant: inherit;
    font-weight: inherit;
    font-stretch: inherit;
    font-size: 18px;
    color: rgba(0,0,0,.87);
    font-family: inherit;
    flex: 1;
    text-align: center;
    letter-spacing: 1px;
  }
  .chat-cancel {
    color: rgba(0,0,0,.54);
  }
}
</style>