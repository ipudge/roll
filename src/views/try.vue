<template>
  <div class="main-wrapper">
    <div class="main">
      <div id="res" style="text-align:center;color:#fff;padding-top:15px;"></div>
      <div class="num_mask"></div>
      <div class="num_box">
        <div class="num"></div>
        <div class="num"></div>
        <div class="num"></div>
        <div class="num"></div>
        <div class="btn" @click="draw">{{drawDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';

  const u = 265;

  export default{
    data () {
      return {
        drawDesc: '开始抽奖',
        isStart: false
      }
    },
    methods: {
      draw () {
        if (this.isStart) {
          $('.num').css('backgroundPositionY',0);
          let result = this.random();
          let num_arr = (result+'').split('');
          $('.num').each(function(index){
            let _num = $(this);
            setTimeout(function(){
              _num.animate({
                backgroundPositionY: (u*60) - (u*num_arr[index])
              },{
                duration: 6000+index*3000,
                easing: 'easeInOutCirc',
                complete: function(){
                  if(index==3) this.isStart = false;
                }
              });
            }, index * 300);
          });
        } else {
          let result = this.random();
          let num_arr = (result+'').split('');
          $('.num').each(function(index){
            let _num = $(this);
            setTimeout(function(){
              _num.animate({
                backgroundPositionY: (u*60) - (u*num_arr[index])
              },{
                duration: 6000+index*3000,
                easing: 'easeInOutCirc',
                complete: function(){
                  if(index==3) isBegin = false;
                }
              });
            }, index * 300);
          });
        }
      },
      random () {
        let num = 100;
        let rand = parseInt(Math.random() / num);
        return rand;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  body
    background: url(./index/body_bg.jpg) 0px 0px repeat-x #000

  .main_bg
    background: url(./index/main_bg.jpg) top center no-repeat
    height: 1000px

  .main
    width: 1000px
    height: 1000px
    position: relative
    margin: 0 auto

  .num_mask
    background: url(./index/num_mask.png) 0px 0px no-repeat
    height: 184px
    width: 740px
    position: absolute
    left: 50%
    top: 340px
    margin-left: -370px
    z-index: 9

  .num_box
    height: 450px
    width: 750px
    position: absolute
    left: 50%
    top: 340px
    margin-left: -370px
    z-index: 8
    overflow: hidden
    text-align: center

  .num
    background: url(./index/num.png) top center repeat-y
    width: 181px
    height: 265px
    float: left
    margin-right: 6px

  .btn
    width: 264px
    height: 89px
    line-height: 89px
    position: absolute
    text-align: center
    left: 50%
    bottom: 50px
    margin-left: -132px
    cursor: pointer
    clear: both

</style>
