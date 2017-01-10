<template>
  <div class="main-wrapper">
    <div class="main_bg">
      <div class="draw-topic">
        <h1 class="title">{{topic}}</h1>
        <p class="sub-title">{{selectedAward}}</p>
        <p class="desc">{{awardDesc}}</p>
      </div>
      <div class="main" :class="classList[activeNum]">
        <roll-control v-for="drawNum in activeNum" :defaultLength="defaultLength"
                      :ref="'rollControl' + drawNum" :size="size"></roll-control>
      </div>
      <div class="btn" @click="draw">{{drawDesc}}</div>
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
    </div>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny" @close="gotoPlay">
      <span>配置信息不足请先<router-link to="/settings" replace>配置</router-link>或者<router-link to="/try"
                                                                                       replace>试玩一下</router-link></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gotoPlay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';
  import rollControl from '../components/roll-control';
  import _ from 'lodash';

  const rollLength = 4;

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
        times: 0,
        awardedArr: [],
        drawTime: 0,
        data: {}
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
        let count = Math.floor(this.activeAward.num / this.activeAward.time);
        let remainder = this.activeAward.num % this.activeAward.time;
        for (let i = 0; i < this.activeAward.time - 1; i++) {
          drawArr.push(count);
        }
        drawArr.push(count + remainder);
        return drawArr;
      },
      awardDesc () {
        return `共抽${this.totalTimes}次,当前${this.times}次,已中奖的号码是${this.awardedArr}`;
      },
      activeNum () {
        return this.drawArr[this.times];
      },
      defaultLength () {
        return rollLength - (this.num + '').split('').length;
      },
      size () {
        if (this.activeNum === 1) {
          return 1;
        }
        if (this.activeNum === 2 || this.activeNum === 4) {
          return 2;
        }
        if (this.activeNum === 3 || this.activeNum === 5) {
          return 2;
        }
      }
    },
    methods: {
      _init () {
        let data = utils.fetch('roll') || {};
        this.data = data;
        if (data.prizeList && data.prizeList.length) {
          this.num = data.num;
          this.awardList = data.tableData;
          this.numArr = data.numArr;
          this.selectedAward = this.awardList[0].value;
          this.results = data.results || [];
          this.awardedArr = this.results.numArr || [];
          this.times = data.times || 0;
          this.topic = data.topic;
        } else {
          this.dialogVisible = true;
        }
      },
      getNumbers () {
        return this.numArr.splice(0, this.activeNum);
      },
      saveInfo () {
        debugger;
        if (!this.times) {
          this.results.push({
            value: this.activeAward.value,
            prizeName: this.activeAward.prizeName,
            num: this.awardedArr.length,
            numArr: this.awardedArr
          });
        } else {
          this.results = this.results.map((e) => {
            if (e.value === this.selectedAward) {
              e.numArr = this.awardedArr;
            }
            return e;
          });
        }
        this.data.times = this.times;
        this.data.results = this.results;
        this.data.numArr = this.numArr;
        utils.save('roll', this.data);
      },
      gotoPlay () {
        this.$router.replace('try');
      },
      draw () {
        this.drawTime++;
        if (this.drawTime % 2 === 0) {
          this._shuffle();
          let awardedArrNow = this.getNumbers();
          this.awardedArr = this.awardedArr.concat(awardedArrNow);
          for (let i = 1; i <= this.activeNum; i++) {
            this.$refs['rollControl' + i][0].stopAnimation(awardedArrNow[i - 1]);
          }
          this.times++;
          this.saveInfo();
        } else {
          for (let i = 1; i <= this.activeNum; i++) {
            this.$refs['rollControl' + i][0].startAnimation();
          }
        }
      },
      _shuffle () {
        this.numArr = _.shuffle(this.numArr);
      }
    },
    components: {
      rollControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .main-wrapper
    background: url('./index/body_bg.jpg') 0px 0px repeat-x #000
    height: 1000px
    overflow: hidden
    .main_bg
      background: url('./index/bg.jpg') top center no-repeat
      height: 1000px
      .main
        margin: 0 auto
        width: 1000px
      .roll1-box
        margin-top: 100px
      .draw-topic
        width: 1000px
        text-align: center
        color: #fff
        margin: 0 auto
        .title
          font-size: 50px
        .sub-title
          font-size: 30px
        .desc
          font-size: 16px
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
