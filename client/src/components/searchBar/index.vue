<template>
  <div class="search-container">
    <input type="text" id="search-bar" placeholder="快来搜索朋友吧">
    <a href="#">
      <mu-icon class="search-icon" size="32" value="search" @click="search"></mu-icon>
    </a>
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
    search() {
      this.$emit('submit');
    }
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
.search-container{
  width: 100%;
  display: block;
  margin: 0 auto;
}

input#search-bar{
  margin: 0 auto;
  width: 100%;
  height: 45px;
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

.search-icon{
  position: relative;
  float: right;
  width: 75px;
  height: 75px;
  top: -38px;
  right: 0;
}

</style>