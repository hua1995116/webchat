<template>
    <div id="app">
        <router-view></router-view>
        <div class="bottom">
            <mu-paper>
                <mu-bottom-nav :value="bottomNav" @change="handleChange">
                    <mu-bottom-nav-item value="recents" title="主页" icon="restore" to="/"/>
                    <mu-bottom-nav-item value="favorites" title="机器人" icon="favorite" to="/robot"/>
                    <mu-bottom-nav-item value="nearby" title="我的" icon="location_on" to="/home"/>
                </mu-bottom-nav>
            </mu-paper>
        </div>
        <chat></chat>
        <register></register>
        <login></login>
        <dialogmodel></dialogmodel>
    </div>

</template>

<script>
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Dialogmodel from './components/Dialogmodel.vue'
export default {
    data () {
        return {
            bottomNav: 'recents'
        }
    },
    methods: {
        handleChange (val) {
            this.bottomNav = val
        }
    },
    components: {
        Chat,
        Login,
        Register,
        Dialogmodel
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app
    width:100%
    min-height:100%
    .bottom
        position:fixed
        bottom:0
        width:100%


</style>
