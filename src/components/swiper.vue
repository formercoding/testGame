<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">slider1</div>
            <div class="swiper-slide">slider2</div>
            <div class="swiper-slide">slider3</div>
        </div>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper'
export default {
    mounted() {
        let mySwiper = new Swiper('.swiper-container', {
            allowSwipeToNext: false
        });
        setTimeout(function() {
            mySwiper.allowSwipeToNext = true;
            mySwiper.slideNext();
        }, 2000)
    }
}
</script>
<style>
.wrap {
    margin: 0 auto;
    background: pink;
}
.item {
    height: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 30px;
}
.swiper-slide {
    height: 100px;
    font-size: 30px;
    line-height: 100px;
    background: pink;
}
</style>


