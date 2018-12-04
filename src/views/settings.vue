<template>
  <div class="settings-wrapper">
    <div class="settings-content">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="默认配置" name="default" style="padding: 25px">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="抽奖主题">
              <el-input v-model="topic" placeholder="请输入抽奖主题" style="width: 350px"></el-input>
            </el-form-item>
            <el-form-item label="抽奖人数">
              <el-input-number v-model="totalNum" :min="1" :max="9999"></el-input-number>
            </el-form-item>
            <el-form-item label="禁用号码">
              <el-input v-model="banNumArr" placeholder="数字以英文逗号分割如禁用1号和4号，则填写1,4" style="width: 350px"></el-input>
            </el-form-item>
            <el-form-item label="允许重复抽奖">
              <el-switch
                v-model="isRepeatable">
              </el-switch>
            </el-form-item>
            <el-form-item label="中奖分类">
              <el-tag
                :key="prize"
                v-for="prize in prizeList"
                closable
                :disable-transitions="false"
                @close="handleClose(prize)">
                {{prize}}
              </el-tag>
              <el-input
                class="inpPrize"
                v-if="inputVisible"
                v-model="inputValue"
                ref="savePrizeInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="addPrize" size="small" @click="showInput">+ 新增奖项</el-button>
            </el-form-item>
            <el-form-item label="奖项设置">
              <el-table
                :data="prizeListData"
                border
                style="width: 100%">
                <el-table-column
                  prop="value"
                  label="奖项"
                  width="120">
                </el-table-column>
                <el-table-column label="中奖人数" min-width="200">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.prizeCount" :min="1"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="奖品名称" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.prizeName" placeholder="请输入奖品名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="禁用号码" min-width="400">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.banNumArr" placeholder="数字以英文逗号分割如禁用1号和4号，则填写1,4"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveDefaultSettings">保存</el-button>
              <el-button @click="cancleDefaultSettings">取消</el-button>
              <el-button @click="cleanDefaultSettings">全部清空</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="高级配置" name="high" style="padding: 25px">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="开场动画">
              <el-input v-model="highSettings.command" placeholder="请输入抽奖主题" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="結束時間">
              <el-input-number v-model="highSettings.timer" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="开启全屏模式">
              <el-switch
                v-model="highSettings.isFullscreen" @change="handleChange">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveHighSettings">保存</el-button>
              <el-button @click="cancleHighSettings">取消</el-button>
              <el-button @click="cleanHighSettings">全部清空</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';
  import screenfull from 'screenfull';
  import _ from 'lodash';

  export default {
    created() {
      this.activeName = this.$route.query.activeName || 'default'
      this.initDefaultSettings();
      this.initHighSettings();
    },
    data() {
      return {
        isRepeatable: false,
        totalNum: 1,
        topic: '',
        banNumArr: '',
        activeName: 'default',
        highSettings: {
          command: 'test',
          timer: 1,
          isFullscreen: true
        },
        prizeList: [],
        inputVisible: false,
        inputValue: '',
        prizeListData: []
      };
    },
    computed: {
      totalNumArr() {
        let totalNumArr = [];
        for (let i = 1; i <= this.totalNum; i++) {
          totalNumArr.push(i);
        }
        return totalNumArr;
      }
    },
    methods: {
      handleClose(prize) {
        let index = this.prizeList.indexOf(prize);
        this.prizeList.splice(index, 1);
        this.prizeListData.splice(index, 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.savePrizeInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue && this.prizeList.indexOf(inputValue) === -1) {
          this.prizeList.push(inputValue);
          this.prizeListData.push({
            value: inputValue,
            prizeCount: 1,
            prizeName: '',
            label: inputValue,
            banNumArr: ''
          })
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleChange(val) {
        if (!screenfull.enabled) {
          this.$message({
            message: '您的浏览器不支持全屏',
            type: 'warning'
          });
          return false;
        }
        if (val) {
          screenfull.request();
        } else {
          screenfull.exit();
        }
      },
      handleTabClick(tab) {
        this.$router.replace(`${this.$route.path}?activeName=${tab.name}`)
      },
      saveDefaultSettings() {
        let isOk = this._validate();
        if (!isOk.success) {
          this.$message({
            showClose: true,
            message: isOk.msg,
            type: 'error'
          });
          return;
        }
        let totalNumArr = this.getTotalNumArr();
        let data = {
          prizeList: this.prizeList,
          isRepeatable: this.isRepeatable,
          totalNum: this.totalNum,
          topic: this.topic,
          prizeListData: this.prizeListData,
          totalNumArr: totalNumArr,
          banNumArr: this.banNumArr
        };
        utils.save('default_setting', data);
      },
      cancleDefaultSettings() {
        this.initDefaultSettings();
      },
      initDefaultSettings() {
        let data = utils.fetch('default_setting') || {};
        this.prizeList = data.prizeList || [];
        this.isRepeatable = data.isRepeatable || false;
        this.totalNum = data.totalNum || 1;
        this.topic = data.topic || '';
        this.prizeListData = data.prizeListData || [];
        this.banNumArr = data.banNumArr || '';
      },
      cleanDefaultSettings() {
        utils.clean('default_setting');
        this.initDefaultSettings();
      },
      cancleHighSettings() {
        this.initHighSettings();
      },
      initHighSettings() {
        this.highSettings = utils.fetch('high_setting') || {};
      },
      cleanHighSettings() {
        utils.clean('high_setting');
        this.initHighSettings();
      },
      saveHighSettings() {
        utils.save('high_setting', this.highSettings);
      },
      _validate() {
        let isOk = {
          success: true
        };
        if (!this.prizeList.length) {
          isOk.success = false;
          isOk.msg = '请选择奖项名称或者自行编写奖项名称';
        }
        let count = 0;
        this.prizeListData.forEach((e) => {
          count += e.prizeCount;
        });
        if (count > this.totalNum) {
          isOk.success = false;
          isOk.msg = '获奖总人数应当小于总人数';
        }
        return isOk;
      },
      getTotalNumArr() {
        let banNumArr = this.banNumArr.split(',').map((e) => {
          return parseInt(e);
        });
        return _.difference(this.totalNumArr, banNumArr);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .settings-wrapper
    background #e9eef4
    min-width 1170px
    box-sizing border-box
    padding 10px
    min-height 100%
    .settings-content
      box-shadow 0 0 4px rgba(0, 0, 0, 0.1)
      background #fff
      padding 13px 0 15px
      .el-tag + .el-tag
        margin-left: 10px
      .addPrize
        margin-left: 10px
        height: 32px
        line-height: 30px
        padding-top: 0
        padding-bottom: 0
      .inpPrize
        width: 90px
        margin-left: 10px
        vertical-align: bottom
      .el-tabs__header
        padding-left 25px
        border-bottom 1px solid #ccc
      .el-tabs__item
        height 47px
        line-height 47px
      .el-tabs__nav-wrap::after
        height 0
</style>
