<template>
  <div id="app">
    <div class="wrap">
      <v-setgame></v-setgame>
    </div>
  </div>
</template>
<script>
import vSetgame from './../../components/setgame'
export default {
  data() {
    return {
      radio: 1
    }
  },
  mounted() {
      // 确认离开
      window.onbeforeunload =  function() {
          return "系统可能不会保存您所做的更改。";
      }
  },
  
  components: {
    vSetgame
  }
}
</script>

<style scoped>
#app {
  font-family: "Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif"
}
</style>
