<template>
  <div class="settings-wrapper">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="默认配置" name="1">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="抽奖人数">
            <el-input-number v-model="num" :min="1" :max="9999"></el-input-number>
          </el-form-item>
          <el-form-item label="抽奖主题">
            <el-input v-model="topic"></el-input>
          </el-form-item>
          <el-form-item label="允许重复抽奖">
            <el-switch
              v-model="defaultActive"
              on-text=""
              off-text="">
            </el-switch>
          </el-form-item>
          <el-form-item label="中奖分类">
            <el-select
              v-model="prizeList"
              multiple
              filterable
              allow-create
              placeholder="请选择奖项名称或者自行编写奖项名称">
              <el-option
                v-for="item in options5"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖项设置">
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="value"
                label="奖项"
                width="120">
              </el-table-column>
              <el-table-column label="中奖人数">
                <template scope="scope">
                  <el-input-number v-model="scope.row.num" :min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="奖品名称">
                <template scope="scope">
                  <el-input v-model="scope.row.prizeName" placeholder="请输入奖品名称"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSettings">保存</el-button>
            <el-button @click="cancle">取消</el-button>
            <el-button @click="cleanSettings">全部清空</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="高级配置" name="2">
        <div>功能正在研究敬请期待</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';

  export default{
    created () {
      this._initSettings();
    },
    data () {
      return {
        activeNames: ['1'],
        options5: [{
          value: '特等奖',
          label: '特等奖'
        }, {
          value: '一等奖',
          label: '一等奖'
        }, {
          value: '二等奖',
          label: '二等奖'
        }, {
          value: '三等奖',
          label: '三等奖'
        }],
        prizeList: [],
        defaultActive: false,
        num: 1,
        topic: ''
      };
    },
    computed: {
      tableData () {
        let tableData = [];
        this.prizeList.forEach((prize) => {
          tableData.push({
            value: prize,
            num: 1,
            prizeName: '',
            label: prize
          });
        });
        return tableData;
      },
      numArr () {
        let numArr = [];
        for (let i = 1; i <= this.num; i++) {
          numArr.push(i);
        }
        return numArr;
      }
    },
    methods: {
      saveSettings () {
        let isOk = this._validate();
        if (!isOk.success) {
          this.$message({
            showClose: true,
            message: isOk.msg,
            type: 'error'
          });
          return;
        }
        let data = {
          prizeList: this.prizeList,
          defaultActive: this.defaultActive,
          num: this.num,
          topic: this.topic,
          tableData: this.tableData,
          numArr: this.numArr
        };
        utils.save('roll', data);
      },
      cancle () {
        this._initSettings();
      },
      _initSettings () {
        let data = utils.fetch('roll') || {};
        this.prizeList = data.prizeList || [];
        this.defaultActive = data.defaultActive || false;
        this.num = data.num || 1;
        this.topic = data.topic || '';
        this.tableData = data.tableData || [];
      },
      cleanSettings () {
        utils.clean('roll');
        this._initSettings();
      },
      _validate () {
        let isOk = {
          success: true
        };
        if (!this.prizeList.length) {
          isOk.success = false;
          isOk.msg = '请选择奖项名称或者自行编写奖项名称';
        }
        let count = 0;
        this.tableData.forEach((e) => {
          count += e.num;
        });
        if (count > this.num) {
          isOk.success = false;
          isOk.msg = '获奖总人数应当小于总人数';
        }
        return isOk;
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .settings-wrapper
    padding: 100px
    .el-select
      width: 600px
</style>
