<template>
    <div class="wrap">
        <div>slider1</div>
        <div>slider2</div>
        <div>slider3</div>
    </div>
</template>
<script>
import Hammer from 'hammerjs'
export default {
  mounted() {
      console.log(document.getElementsByClassName('wrap')[0]);
      let ham = new Hammer(document.getElementsByClassName('wrap')[0], {});
      ham.on('swipeleft', () => {
          document.getElementsByClassName('wrap')[0].style.transform = 'translateX(200px)'
      })
  }
}
</script>
<style>
    body {
        margin: 0;
    }
    .wrap {
        width: 300%;
        display: flex;
        position: relative;
        overflow: hidden;
        -webkit-transition: all 2s;
        -moz-transition: all 2s;
        transition: all 2s;
    }
    .wrap div {
        flex-basis: 100%;
        height: 200px;
        font-size: 30px;
        line-height: 200px;
        background: pink;
        box-sizing: border-box;
    }
    
</style>


