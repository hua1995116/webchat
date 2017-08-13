<template>
    <div class="login" v-if="getlogintoggle">
        <div class="header">
            <mu-appbar title="Title">
                <mu-flat-button label="登录" slot="default"/>
            </mu-appbar>
        </div>
        <div class="content">
            <form action="" name="form2">
                <mu-text-field label="帐号" labelFloat name="username"/>
                <br/>
                <mu-text-field label="密码" type="password" labelFloat name="password"/>
                <br/>
                <div class="btn-radius" @click="submit">登录</div>
            </form>
            <div @click="register" class="tip-user">
                注册帐号
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'
    export default{
        data() {
            return {
                loading: ''
            }
        },
        methods: {
            submit() {
                var name = document.form2.username.value.trim()
                var password = document.form2.password.value.trim()
                if (name !== '' && password !== '') {
                    var data = {
                        name: name,
                        password: password
                    }
                    //                this.loading = 'loading'
                    this.$store.dispatch('loginsubmit', data)
                    document.form2.reset()
                    this.$store.commit('setIsLogin', true)
                    this.getSvgModal.$root.$options.clear()
                } else {
                    this.$store.commit('changedialog')
                    this.$store.commit('changedialoginfo', '帐号密码不能为空')
                }
            },
            register() {
                this.$store.commit('openregistertoggle')
                this.$store.commit('closelogintoggle')
            }
        },
        computed: {
            ...mapGetters([
                'getlogintoggle'
            ]),
            getSvgModal() {
              return this.$store.state.svgmodal
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .login
        position: absolute
        left: 0
        right: 0
        top: 0
        bottom: 0
        background-image : url(../assets/bg.jpg)
        background-size: 100% 100%
        background-position : center center
        .mu-appbar
            text-align: center
            .mu-flat-button-label
                font-size: 20px
        .content
            width: 80%
            margin: 70px auto 20px
            .mu-text-field
                width: 100%
            .mu-raised-button
                min-width: 80px
                display: block
                width: 100%
                margin: 0 auto
                transition: all 0.375s
                &.loading
                    width: 80px
                    height: 80px
                    border-radius: 50%
</style>
