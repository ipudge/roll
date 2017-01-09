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

  export default{
    props: ['defaultLength', 'num'],
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
      stopAnimation () {
        let that = this;
        let numArr = this._fomatNum(this.num).split('');
        $('.num').each(function (index) {
          if (numArr[index] === '0' && index < that.acitiveLength) {
            return;
          }
          let _num = $(this);
          _num.stop(true).css('backgroundPositionY', (u * 10) - u * numArr[index]);
        });
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
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
