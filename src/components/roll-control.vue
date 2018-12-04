<template>
  <div class="roll-control-wrapper">
    <div class="num_mask"></div>
    <div class="num_box">
      <div class="num"></div>
      <div class="num"></div>
      <div class="num"></div>
      <div class="num"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery';

  const u = 265;
  const rollLength = 4;

  export default{
    props: ['defaultLength'],
    data () {
      return {
        index: 0,
        timerArr: []
      };
    },
    computed: {
      acitiveLength () {
        return rollLength - this.index;
      }
    },
    methods: {
      startAnimation () {
        let that = this;
        $('.num').css('backgroundPositionY', 0).each(function (index) {
          let _num = $(this);
          if (index >= that.defaultLength) {
            that.timerArr[index] = setTimeout(function () {
              _num.animate({
                backgroundPositionY: u * 30
              }, {
                duration: 3000,
                easing: 'linear',
                complete: function () {
                  that.rowBack(_num, 1);
                }
              });
            }, that.index * 200);
            that.index++;
          }
        });
      },
      stopAnimation (num) {
        let that = this;
        this.timerArr.forEach((timer) => {
          clearTimeout(timer);
        })
        let numArr = this._fomatNum(num).split('');
        $('.num').each(function (index) {
          if (numArr[index] === '0' && index < that.acitiveLength) {
            return;
          }
          let _num = $(this);
          _num.stop(true).css('backgroundPositionY', (u * 60) - u * numArr[index]);
        });
        this.index = 0;
      },
      _fomatNum (num) {
        num += '';
        let length = num.length;
        if (length === 1) {
          num = '000' + num;
        }
        if (length === 2) {
          num = '00' + num;
        }
        if (length === 3) {
          num = '0' + num;
        }
        return num;
      },
      rowBack (obj, index) {
        let that = this;
        obj.animate({
          backgroundPositionY: u * 30 * (1 + index)
        }, {
          duration: 3000,
          easing: 'linear',
          complete: function () {
            that.rowBack(obj, ++index);
          }
        });
      },
      reset () {
        $('.num').css('backgroundPositionY', 0);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .roll-control-wrapper
    position: relative
    margin: 0 auto
    box-sizing: border-box
    background: url('./roll-control/bg_sb.png') center no-repeat
    width: 752px
    height: 278px
    background-size: 752px 278px;
    .num_mask
      position: absolute
      left: 6px
      top: 0
      background: url('./roll-control/num_mask_sb.png') 0px 0px no-repeat
      height: 184px
      width: 740px
      z-index: 9
    .num_box
      position: absolute
      top: 0px
      z-index: 8
      overflow: hidden
      text-align: center
      .num
        background: url('./roll-control/num_sb.png') top center repeat-y
        width: 181px
        height: 265px
        float: left
        margin-right: 6px
</style>
