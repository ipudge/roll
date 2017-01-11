<template>
  <div class="main-wrapper">
    <div class="main_bg">
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
    },
    data () {
      return {
        dialogVisible: false,
        drawDesc: '开始抽奖',
        awardList: [],
        selectedAward: '',
        numArr: [],
        drawTime: 0,
        data: {},
        results: [],
        topic: ''
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
        return this.activeAward.num;
      },
      subTitle () {
        if (this.activeAward) {
          return `${this.selectedAward}-${this.activeAward.prizeName}`;
        } else {
          return '';
        }
      },
      awardDesc () {
        return `共抽${this.totalTimes}次,当前${this.times}次,已中奖的号码是${this.awardedArr}`;
      },
      defaultLength () {
        return rollLength - (this.num + '').split('').length;
      },
      isOver () {
        return this.awardList.every((award) => {
          return award.disabled === true;
        });
      },
      resultNow () {
        let resultNow = {};
        this.results.forEach((result) => {
          if (result.value === this.selectedAward) {
            resultNow = result;
          }
        });
        return resultNow;
      },
      awardedArr () {
        return this.resultNow.numArr || [];
      },
      times () {
        return this.resultNow.times || 0;
      }
    },
    methods: {
      _init () {
        this.data = utils.fetch('roll') || {};
        if (this.data.prizeList && this.data.prizeList.length) {
          this.num = this.data.num;
          this.awardList = this.data.tableData;
          this.numArr = this.data.numArr;
          this.defaultActive = this.data.defaultActive;
          this.topic = this.data.topic;
          if (this.data.results) {
            this.selectedAward = this.data.lastSelectedAward;
            this.results = this.data.results;
          } else {
            this.selectedAward = this.awardList[0].value;
            this.results = [];
          }
        } else {
          this.dialogVisible = true;
        }
      },
      randomIndex: function () {
        return Math.floor(Math.random() * this.numArr.length);
      },
      getNumbers () {
        if (this.defaultActive) {
          return this.numArr[this.randomIndex()];
        } else {
          return this.numArr.splice(this.randomIndex(), 1)[0];
        }
      },
      saveInfo (number) {
        if (this.times === 0) {
          this.results.push({
            value: this.activeAward.value,
            prizeName: this.activeAward.prizeName,
            numArr: [number],
            times: 1
          });
        } else {
          this.results = this.results.map((e) => {
            if (e.value === this.selectedAward) {
              e.numArr.push(number);
              if (this.times === this.totalTimes) {
                e.disabled = true;
              }
              e.times++;
            }
            return e;
          });
        }
        this.data.results = this.results;
        this.data.numArr = this.numArr;
        this.data.lastSelectedAward = this.selectedAward;
        utils.save('roll', this.data);
      },
      gotoPlay () {
        this.$router.replace('try');
      },
      draw () {
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
      _shuffle () {
        this.numArr = _.shuffle(this.numArr);
      },
      reset () {
        this.$refs.rollControl.reset();
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
      box-sizing: border-box
      background: url('./index/bg.jpg') top center no-repeat
      height: 1000px
      padding-top: 80px
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
