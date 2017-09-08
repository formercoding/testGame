<template>
  <div id="app">
    <img src="./assets/logo.png">
    <el-radio class="radio" v-model="radio" label="1">备选项</el-radio>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: 1
    }
  },
  created() {
    console.log(this.$store.state.count);
    this.$ajax({
      method: 'post',
      url: '/user',
      data: {
        name: 'wise',
        info: 'wrong'
      }
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
