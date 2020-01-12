<template>
  <div class="search-container">
    <div v-if="disabled" class="search-bar" @click="search">快来搜索朋友吧</div>
    <input v-else type="text" class="search-bar" placeholder="快来搜索朋友吧" @input="change" v-focus>
    <mu-icon v-if="disabled" class="search-icon" size="32" value="search" @click="search"></mu-icon>
    <span v-else class="search-text" @click="cancel">取消</span>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
export default {

  components: {},
  props: ['disabled', 'timeout'],
  data () {
    return {
    };
  },

  computed: {},

  mounted() {},

  methods: {
    search() {
      this.$emit('submit');
    },
    change: debounce(function(e) {
      this.$emit('change', e.target.value);
    }, 500),
    cancel() {
      this.$emit('cancel');
    }
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
.search-container{
  width: 100%;
  display: block;
  margin: 0 auto;
  .search-bar {
    margin: 0 auto;
    width: 100%;
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    font-size: 1rem;
    border: 1px solid #D0CFCE;
    outline: none;
    &:focus{
      border: 1px solid #008ABF;
      transition: 0.35s ease;
      color: #008ABF;
      &::-webkit-input-placeholder{
        transition: opacity 0.45s ease;
        opacity: 0;
      }
      &::-moz-placeholder {
        transition: opacity 0.45s ease;
        opacity: 0;
      }
      &:-ms-placeholder {
      transition: opacity 0.45s ease;
      opacity: 0;
      }
    }
  }
}

.search-icon{
  position: relative;
  float: right;
  top: -38px;
  right: 0;
}

.search-text{
  position: absolute;
  line-height: 45px;
  right: 10px;
  font-size: 16px;
  color: #2196f3;
  padding-left: 10px;
  border-left: 1px solid #d0cfce;
}



</style>