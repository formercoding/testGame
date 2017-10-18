<template>
    <div id="app">
        <setgame></setgame>
    </div>
</template>

<script>
import setgame from './../../components/SetGame'

export default {
    mounted() {
        // 确认离开
        window.onbeforeunload = function() {
            return "系统可能不会保存您所做的更改。";
        }
    },

    components: {
        setgame
    }
}
</script>

<style scoped>
#app {
    font-family: "Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif"
}
</style>
