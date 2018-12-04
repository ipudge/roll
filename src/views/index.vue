<template>
  <div class="main-wrapper">
    <transition name="move" mode="in-out">
      <div class="main_bg" v-show="contentShow || !!!highSettings.command">
        <div class="draw-topic">
          <h1 class="title">{{topic}}</h1>
          <p class="sub-title">{{subTitle}}</p>
          <p class="desc">{{awardDesc}}</p>
        </div>
        <div class="main">
          <roll-control :defaultLength="defaultLength" ref="rollControl"></roll-control>
        </div>
        <div class="btn" @click="draw">{{drawDesc}}</div>
        <div class="rest-wrapper">
          <el-select v-model="selectedAward" placeholder="请选择奖项" :disabled="isOver" @change="reset">
            <el-option
              v-for="award in awardList"
              :label="award.label"
              :value="award.value"
              :key="award.value"
              :disabled="award.disabled">
            </el-option>
          </el-select>
        </div>
      </div>
    </transition>
    <el-dialog title="提示" v-model="dialogVisible" @close="gotoPlay">
      <span>配置信息不足请先<router-link to="/settings" replace>配置</router-link></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gotoPlay">确 定</el-button>
      </span>
    </el-dialog>
    <em-shape-shifter :command="highSettings.command" :timer="highSettings.timer*1000" @close="handleClose"></em-shape-shifter>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';
  import rollControl from '../components/roll-control';
  import EmShapeShifter from '../components/shape-shifter/index';
  import _ from 'lodash';

  const rollLength = 4;

  export default {
    created() {
      this.defaultSettings = utils.fetch('default_setting') || {}
      this.highSettings = utils.fetch('high_setting') || {};
      this._init();
    },
    data() {
      return {
        dialogVisible: false,
        drawDesc: '开始抽奖',
        awardList: [],
        selectedAward: '',
        totalNumArr: [],
        drawTime: 0,
        defaultSettings: {},
        results: [],
        topic: '',
        contentShow: false,
        highSettings: {
          command: '',
          timer: 3
        }
      };
    },
    computed: {
      activeAward() {
        let activeAward = {};
        this.awardList.forEach((award) => {
          if (award.value === this.selectedAward) {
            activeAward = award;
          }
        });
        return activeAward;
      },
      totalTimes() {
        return this.activeAward.prizeCount;
      },
      subTitle() {
        if (this.totalTimes) {
          if (this.activeAward.prizeName) {
            return `${this.selectedAward}-${this.activeAward.prizeName}`;
          } else {
            return this.selectedAward;
          }
        } else {
          return '请先配置抽奖设置！';
        }
      },
      awardDesc() {
        if (this.totalTimes) {
          return `共抽${this.totalTimes}次,当前${this.times}次,已中奖的号码是${this.awardedArr}`;
        } else {
          return '';
        }
      },
      defaultLength() {
        return rollLength - (this.prizeCount + '').split('').length;
      },
      isOver() {
        return this.awardList.every((award) => {
          return award.disabled === true;
        });
      },
      resultNow() {
        let resultNow = {};
        this.results.forEach((result) => {
          if (result.value === this.selectedAward) {
            resultNow = result;
          }
        });
        return resultNow;
      },
      awardedArr() {
        return this.resultNow.totalNumArr || [];
      },
      times() {
        return this.resultNow.times || 0;
      },
      tmpTotalNumArr () {
        if (this.activeAward.banNumArr.length) {
          let banNumArr = this.activeAward.banNumArr.split(',').map((e) => {
            return parseInt(e);
          });
          return _.difference(this.totalNumArr, banNumArr);
        } else  {
          return this.totalNumArr;
        }
      }
    },
    methods: {
      handleClose() {
        this.contentShow = true;
      },
      _init() {
        if (this.defaultSettings.prizeList && this.defaultSettings.prizeList.length) {
          this.prizeCount = this.defaultSettings.prizeCount;
          this.awardList = this.defaultSettings.prizeListData;
          this.totalNumArr = this.defaultSettings.totalNumArr;
          this.isRepeatable = this.defaultSettings.isRepeatable;
          this.topic = this.defaultSettings.topic;
          if (this.defaultSettings.results) {
            this.selectedAward = this.defaultSettings.lastSelectedAward;
            this.results = this.defaultSettings.results;
          } else {
            this.selectedAward = this.awardList[0].value;
            this.results = [];
          }
        } else {
          this.dialogVisible = true;
        }
      },
      randomNumber () {
        return this.tmpTotalNumArr[Math.floor(Math.random() * this.tmpTotalNumArr.length)];
      },
      getNumbers() {
        if (this.isRepeatable) {
          return this.randomNumber();
        } else {
          let num = this.randomNumber();
          this.totalNumArr.splice((this.totalNumArr.indexOf(num)), 1);
          return num;
        }
      },
      saveInfo(number) {
        if (this.times === 0) {
          this.results.push({
            value: this.activeAward.value,
            prizeName: this.activeAward.prizeName,
            totalNumArr: [number],
            times: 1
          });
        } else {
          this.results = this.results.map((e) => {
            if (e.value === this.selectedAward) {
              e.totalNumArr.push(number);
              if (this.times === this.totalTimes) {
                e.disabled = true;
              }
              e.times++;
            }
            return e;
          });
        }
        this.defaultSettings.results = this.results;
        this.defaultSettings.totalNumArr = this.totalNumArr;
        this.defaultSettings.lastSelectedAward = this.selectedAward;
        utils.save('default_setting', this.defaultSettings);
      },
      draw() {
        if (this.isOver) {
          this.$message('本次抽奖已全部结束!');
          return;
        }
        if (this.times === this.totalTimes) {
          this.$message(`${this.selectedAward}已全部抽完!切换奖项继续抽取`);
          return;
        }
        this.drawTime++;
        if (this.drawTime % 2 === 0) {
          this._shuffle();
          let number = this.getNumbers();
          this.$refs.rollControl.stopAnimation(number);
          this.drawDesc = '开始抽奖';
          this.saveInfo(number);
          if (this.times === this.totalTimes) {
            this.$message(`${this.selectedAward}已全部抽完!切换奖项继续抽取`);
            this.$set(this.activeAward, 'disabled', true);
          }
        } else {
          this.$refs.rollControl.startAnimation();
          this.drawDesc = '停止抽奖';
        }
      },
      _shuffle() {
        this.totalNumArr = _.shuffle(this.totalNumArr);
      },
      reset() {
        this.$refs.rollControl.reset();
      }
    },
    components: {
      rollControl,
      EmShapeShifter
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .main-wrapper
    background: url('./index/body_bg.jpg') 0px 0px repeat-x #000
    height: 1000px
    overflow: hidden
    .main_bg
      box-sizing: border-box
      background: url('./index/bg.jpg') top center no-repeat
      height: 1000px
      padding-top: 80px
      z-index 2
      .main
        margin: 0 auto
        width: 1000px
      .draw-topic
        width: 1000px
        text-align: center
        color: #fff
        margin: 0 auto
        .title
          font-size: 50px
          margin: 0
        .sub-title
          font-size: 30px
        .desc
          font-size: 16px
      .rest-wrapper
        position: absolute
        right: 100px
        top: 0
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
      z-index 1

  @media screen and (max-width: 1366px)
    .main-wrapper
      background: url('./index/body_bg.jpg') 0px 0px repeat-x #000
      height: 1000px
      overflow: hidden
      .main_bg
        box-sizing: border-box
        background: url('./index/bg.jpg') top center no-repeat
        height: 1000px
        .main
          margin: 0 auto
          width: 1000px
        .draw-topic
          width: 1000px
          text-align: center
          color: #fff
          margin: 0 auto
          .title
            font-size: 35px
          .sub-title
            font-size: 20px
          .desc
            font-size: 16px
        .rest-wrapper
          position: absolute
          right: 100px
          top: 0
      .btn
        width: 200px
        height: 50px
        line-height: 50px
        position: absolute
        text-align: center
        left: 50%
        bottom: 50px
        margin-left: -100px
        cursor: pointer
        clear: both
        color: #fff
        font-size: 20px
        border: 2px solid #fff
        border-radius: 30px
</style>
