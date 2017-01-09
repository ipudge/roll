<template>
  <div class="main-wrapper">
    <div class="main">
      <div class="main_bg" :class="classList[activeNum]">

      </div>
      <div class="btn">{{drawDesc}}</div>
      <div class="rest-wrapper">
        <el-select v-model="selectedAward" placeholder="请选择奖项">
          <el-option
            v-for="award in awardList"
            :label="award.label"
            :value="award.value"
            :disabled="award.disabled">
          </el-option>
        </el-select>
      </div>
      <div class="awardDesc">
        <p class="text">{{awardDesc}}</p>
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny" @close="gotoPlay">
      <span>配置信息不足请先<router-link to="/settings" replace>配置</router-link>或者<router-link to="/try"
                                                                                       replace>试玩</router-link></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gotoPlay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';
  import rollControl from '../components/roll-control';

  export default{
    created () {
      this._init();
      this.classList = ['default', 'roll1-box', 'roll2-box', 'roll3-box', 'roll4-box', 'roll5-box'];
    },
    data () {
      return {
        dialogVisible: false,
        drawDesc: '开始抽奖',
        awardList: [],
        selectedAward: '',
        numArr: [],
        times: 1,
        awardedArr: []
      };
    },
    computed: {
      activeAward () {
        let activeAward = {};
        this.awardList.forEach((award) => {
          if (award.value === this.selectedAward) {
            activeAward = award;
          }
        });
        return activeAward;
      },
      totalTimes () {
        return this.activeAward.time;
      },
      drawArr () {
        let drawArr = [];
        let times = parseInt(this.activeAward.num / this.activeAward.time);
        let remainder = this.activeAward.num % this.activeAward.time;
        for (let i = 0; i < times; i++) {
          drawArr.push(this.activeAward.times);
        }
        drawArr.push(remainder);
        return drawArr;
      },
      awardDesc () {
        return `${this.selectedAward}共抽${this.totalTimes}次,当前${this.times}次,已中奖的号码是${this.awardedArr}`;
      },
      activeNum () {
        return this.drawArr[this.time];
      }
    },
    methods: {
      _init () {
        let data = utils.fetch('roll') || {};
        this.awardList = data.tableData;
        this.numArr = data.numArr;
        this.selectedAward = this.awardList[0].value;
      },
      getNumbers () {

      },
      saveInfo () {

      },
      gotoPlay () {
        this.$router.replace('try');
      }
    },
    components: {
      rollControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  body
    background: url(./index/body_bg.jpg) 0px 0px repeat-x #000

  .main_bg
    background: url(./index/bg.jpg) top center no-repeat
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
    color: #fff
    font-size: 24px
    border: 2px solid #fff
    border-radius: 45px

</style>
