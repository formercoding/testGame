<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <el-radio class="radio" v-model="radio" label="1">备选项</el-radio> -->
    <!-- <router-view></router-view> -->
    <div class="wrap">
      <!-- <img class="run" src="http://images2015.cnblogs.com/blog/1101002/201702/1101002-20170204172145136-1156792999.png"> -->
      <!-- <audio ref="btn" src='http://www.sunnyzhen.com/demo/audio/media/thunder.mp3' controls="controls" loop="loop" autoplay="autoplay">亲 您的浏览器不支持html5的audio标签</audio> -->
      <!-- <button @click="sound" >sound</button> -->
      <!-- <scrollbar></scrollbar> -->
      <!-- <swiper></swiper> -->
      <!-- <hammer></hammer> -->
      <router-view></router-view>
      <!-- <v-setgame></v-setgame> -->
    </div>
  </div>
</template>
<script>
import BUS from './assets/js/bus'
import scrollbar from './components/scrollbar'
import swiper from './components/swiper'
import hammer from './components/hammer'

import vSetgame from './components/setgame'

export default {
  data() {
    return {
      radio: 1
    }
  },
  methods: {
    sound() {
      if(!this.$refs.btn.paused) {
        this.$refs.btn.pause();
      } else {
        this.$refs.btn.play();
      }
    }
  },
  created() {
    console.log($(document));
    console.log('busname', BUS.name);
    console.log(this.$store.state.count);
    this.$http({
      method: 'post',
      url: '/user',
      data: {
        name: 'wise',
        info: 'wrong'
      }
    });
    // let posX = 0;
    // setInterval(() => {
    //   posX = posX + 2;
    //   document.getElementsByClassName('run')[0].style.left = posX + 'px';
    // }, 50)
  },
  components: {
    scrollbar,
    swiper,
    hammer,
    vSetgame
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.run {
  position: relative;
  left: 0;
}
.wrap {
  width: 1200px;
  margin: 0 auto;
}
</style>
