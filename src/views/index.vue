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
        <div class="btn"></div>
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny" @close="gotoPlay">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gotoPlay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';

  export default{
    created () {
      this._init();
    },
    data () {
      return {
        dialogVisible: false
      }
    },
    methods: {
      _init () {
        let data = utils.fetch('roll') || {};
        if (!data.num) {
          this.dialogVisible = true;
        }
      },
      getNumbers () {

      },
      saveInfo () {

      },
      gotoPlay () {
        this.$router.push('try');
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
    background: url(./index/btn_start.png) 0px 0px no-repeat
    width: 264px
    height: 89px
    position: absolute
    left: 50%
    bottom: 50px
    margin-left: -132px
    cursor: pointer
    clear: both

</style>