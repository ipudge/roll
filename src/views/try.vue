<template>
  <div class="main-wrapper">
    <div class="main_bg">
      <div class="main">
        <div class="num_wrapper">
          <h2>填写抽奖人数</h2>
          <el-input-number v-model="nums" :min="1" :max="9999" :disabled="isDisabled"></el-input-number>
        </div>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery';

  const u = 265;
  const rollLength = 4;

  export default{
    data () {
      return {
        nums: 1,
        drawDesc: '开始抽奖',
        drawTime: 0,
        isFinished: true,
        index: 0
      };
    },
    computed: {
      defaultLength () {
        return rollLength - (this.nums + '').split('').length;
      },
      isDisabled () {
        return !this.isFinished;
      },
      acitiveLength () {
        return rollLength - this.index;
      }
    },
    methods: {
      draw () {
        this.drawTime++;
        if (this.drawTime % 2 === 0) {
          let that = this;
          let numArr = this.getNumArr();
          $('.num').each(function (index) {
            if (numArr[index] === '0' && index < that.acitiveLength) {
              return;
            }
            let _num = $(this);
            _num.stop(true).css('backgroundPositionY', (u * 10) - u * numArr[index]);
          });
          this.isFinished = true;
          this.drawDesc = '开始抽奖';
          this.index = 0;
        } else {
          this.drawDesc = '停止抽奖';
          this.isFinished = false;
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
        }
      },
      getNumArr () {
        let rand = parseInt(Math.random() * this.nums + 1);
        rand = this._fomatNum(rand);
        let numArr = rand.split('');
        return numArr;
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
  .main-wrapper
    background: url(./index/body_bg.jpg) 0px 0px repeat-x #000

  .main_bg
    background: url(./index/main_bg.jpg) top center no-repeat
    height: 1000px

  .main
    width: 1000px
    height: 1000px
    position: relative
    margin: 0 auto
    .num_wrapper
      position: absolute
      left: 50%
      margin-left: -90px
      top: 750px
      color: #fff

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
    color: #fff
    font-size: 24px
    border: 2px solid #fff
    border-radius: 45px

</style>
