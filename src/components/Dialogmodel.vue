<template>
    <div>
        <mu-dialog :open="getdialog" title="提示" @close="close">
            {{getdialoginfo}}
            <mu-flat-button slot="actions" @click="close" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="close" label="确定"/>
        </mu-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex'
    export default {
        methods: {
            open () {
                this.$store.commit('changedialog')
            },
            close () {
                this.$store.commit('changedialog')
            }
        },
        computed: {
            ...mapGetters([
                'getdialog',
                'getdialoginfo'
            ])
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
