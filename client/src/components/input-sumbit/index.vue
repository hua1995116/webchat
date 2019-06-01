<template>
  <div class="chat">
    <div class="input" @keyup.enter="submess">
      <input type="text" v-model="chatValue">
    </div>
    <mu-button class="demo-raised-button" color="primary" @click="submess">发送</mu-button>
  </div>
</template>

<script>
export default {

  components: {},
  data () {
    return {
    };
  },

  computed: {},

  mounted() {},

  methods: {
    handleSubmit() {
      this.$emit('sumbit');
    }
  }
}

</script>
<style lang='stylus' scoped>
.chat {
  width: 100%;
  display: flex;

  .input {
    flex: 1;
    padding: 0 4px 4px 4px;

    input {
      width: 100%;
      height: 42px;
      box-sizing: border-box;
      border: 1px solid #e8e7ea;
      border-radius: 3px;
      color: #333333;
      font-size: 19px;
      padding-left: 5px;
    }

    .mu-text-field {
      width: 100%;
    }
  }

  .demo-raised-button {
    margin-right: 8px;
  }
}
</style>