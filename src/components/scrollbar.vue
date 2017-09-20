<template>
  <div>
    <vue-scrollbar class="my-scrollbar" ref="Scrollbar" :speed="speed">
      <div class="scroll-me">
        <div v-for="data in arr" class="kolom"></div>
        <div class="clearfix"></div>
      </div>
    </vue-scrollbar>
  </div>
</template>

<script>
// import 'vue2-scrollbar/dist/style/app.css'
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css'
import vueScrollbar from 'vue2-scrollbar'
export default {
  data() {
    return {
        speed: 10,
        arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  mounted() {
    let _this = this;
    setTimeout(() => {
        _this.arr.push(0);
        console.log(_this.arr)
    }, 500);

  },
  components: {
      vueScrollbar
  }
}
</script>
<style scoped>
/*The Wrapper*/
.my-scrollbar{
  width: 35%;
  max-height: 450px;
}

/*The Content*/
.scroll-me{
   width: 100%; 
   min-width: 100%;
}
.kolom {
    float: none;
}
.vue-scrollbar__scrollbar-vertical {
    width: 5px;
}
.vue-scrollbar__scrollbar-vertical .scrollbar {
    width: 5px;
    border-radius: 50px;
}
</style>


