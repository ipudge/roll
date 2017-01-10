<template>
  <div class="roll-control-wrapper" :class="classList[size]">
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
    created () {
      this.classList = ['roll-control-size0', 'roll-control-size1', 'roll-control-size2', 'roll-control-size3'];
    },
    props: {
      defaultLength: {
        type: Number,
        default: 0
      },
      size: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        index: 0
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
            setTimeout(function () {
              _num.animate({
                backgroundPositionY: u * 30
              }, {
                duration: 3000,
                easing: 'linear',
                complete: function () {
                  _num.css('backgroundPositionY', 0);
                  that.rowBack(_num);
                }
              });
            }, that.index * 300);
            that.index++;
          }
        });
      },
      stopAnimation (num) {
        let that = this;
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
      rowBack (obj) {
        let that = this;
        obj.animate({
          backgroundPositionY: u * 30
        }, {
          duration: 3000,
          easing: 'linear',
          complete: function () {
            obj.css('backgroundPositionY', 0);
            that.rowBack(obj);
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .roll-control-size1
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

  .roll-control-size2
    position: relative
    box-sizing: border-box
    background: url('./roll-control/bg_b.png') center no-repeat
    width: 335px
    height: 124px
    background-size: 335px 124px;
    .num_mask
      background: url('./roll-control/num_mask_b.png') 0px 0px no-repeat
      height: 60px
      width: 330px
      position: absolute
      left: 3px
      top: 0
      z-index: 9
    .num_box
      position: absolute
      top: 0px
      z-index: 8
      overflow: hidden
      text-align: center
      .num
        background: url('./roll-control/num_b.png') top center repeat-y
        width: 83px
        height: 110px
        float: left

  .roll-control-size3
    position: relative
    box-sizing: border-box
    background: url('./roll-control/bg.png') center no-repeat
    width: 335px
    height: 124px
    background-size: 335px 124px;
    .num_mask
      background: url('./roll-control/num_mask.png') 0px 0px no-repeat
      height: 184px
      width: 335px
      position: absolute
      left: 0
      top: 0
      z-index: 9
    .num_box
      position: absolute
      top: 0px
      z-index: 8
      overflow: hidden
      text-align: center
      .num
        background: url('./roll-control/num.png') top center repeat-y
        width: 181px
        height: 265px
        float: left
        margin-right: 6px
</style>
