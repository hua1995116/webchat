<template>
  <div>
    <div class="header">
      <div class="head">
        <img :src="src" alt="">
      </div>
      <div class="name">
        {{username}}
      </div>
      <div class="background">
        <img :src="src" alt="">
      </div>
    </div>
    <div class="content">
      <mu-list>
        <mu-list-item title="个人中心">
          <mu-icon slot="left" value="inbox"/>
        </mu-list-item>
        <mu-list-item title="我的好友">
          <mu-icon slot="left" value="grade"/>
        </mu-list-item>
        <mu-list-item title="我的动态">
          <mu-icon slot="left" value="send"/>
        </mu-list-item>
        <mu-list-item title="设置">
          <mu-icon slot="left" value="drafts"/>
        </mu-list-item>
      </mu-list>
      <!--<mu-divider/>-->
    </div>
    <div class="logout">
      <mu-raised-button @click="logout" label="退出" class="demo-raised-button" fullWidth/>
    </div>
    <div style="height:80px"></div>
  </div>
</template>

<script>
  import {clear, getItem} from '../utils/localStorage'
  export default{
    data() {
      return {
        username: '',
        src: ''
      }
    },
    mounted() {
      if (!getItem('userid')) {
        this.$router.push('/login')
      }
      this.username = getItem('userid')
      this.src = getItem('src')
    },
    methods: {
      logout() {
        clear()
        this.$router.push('/login')
        this.$store.commit('setTab', false)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .header
    position: relative
    width: 100%
    height: 200px
    .head
      width: 80px
      margin: 20px auto 0
      img
        width: 80px
        height: 80px
        border-radius: 50%
    .name
      height: 50px
      line-height: 50px
      color: #ffffff
      font-size: 18px
      text-align: center
    .background
      position absolute
      top: 0
      left 0
      width 100%
      height: 200px
      z-index -1
      filter blur(10px)
      img
        width: 100%
        height: 100%

  .logout
    width: 200px
    margin: 0 auto
    .mu-raised-button
      background: #ff4081
      color: #fff
</style>
