<template>
    <div>
        <div class="header">
            <div class="head">
                <img :src="getusersrc" alt="">
            </div>
            <div class="name">
                {{getusername}}

            </div>
            <div class="background">
                <img :src="getusersrc" alt="">
            </div>
        </div>
        <div class="content">
            <mu-list>
                <mu-list-item title="Inbox">
                    <mu-icon slot="left" value="inbox"/>
                </mu-list-item>
                <mu-list-item title="Starred">
                    <mu-icon slot="left" value="grade"/>
                </mu-list-item>
                <mu-list-item title="Sent mail">
                    <mu-icon slot="left" value="send"/>
                </mu-list-item>
                <mu-list-item title="Drafts">
                    <mu-icon slot="left" value="drafts"/>
                </mu-list-item>
            </mu-list>
            <mu-divider />
            <mu-list>
                <mu-list-item title="All mail">
                    <mu-icon slot="right" value="info"/>
                </mu-list-item>
                <mu-list-item title="Trash">
                    <mu-icon slot="right" value="info"/>
                </mu-list-item>
                <mu-list-item title="Spam">
                    <mu-icon slot="right" value="info"/>
                </mu-list-item>
                <mu-list-item title="Follow up">
                    <mu-icon slot="right" value="info"/>
                </mu-list-item>
            </mu-list>
        </div>
        <div class="logout">
            <mu-raised-button @click="logout" label="退出" class="demo-raised-button" fullWidth/>
        </div>
        <div style="height:80px"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'
    export default{
        computed: {
            ...mapGetters([
                'getusersrc',
                'getusername'
            ])
        },
        methods: {
            logout() {
                this.$store.commit('setusername', '')
                this.$store.commit('setusersrc', '')
                this.$store.commit('openlogintoggle')
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.header
    width:100%
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
        font-size:18px
        text-align:center
    .background
        position absolute
        top: 0
        left 0
        width 100%
        height: 200px
        z-index -1
        filter blur(10px)
        img
            width:100%
            height:100%
.logout
    width:200px
    margin: 0 auto
    .mu-raised-button
        background:#ff4081
        color:#fff
</style>
