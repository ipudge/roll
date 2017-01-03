<template>
  <div class="settings">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="默认配置" name="1">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="抽奖人数">
            <el-input-number v-model="num" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="抽奖主题">
            <el-input v-model="topic"></el-input>
          </el-form-item>
          <el-form-item label="是否启用非重复抽奖">
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
              placeholder="请选择奖项或者自行编写奖项">
              <el-option
                v-for="item in options5"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="高级配置" name="2">
        <div>功能正在研究</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        activeNames: ['1', '2'],
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
        defaultActive: true,
        num: '',
        topic: '',
        tableData: []
      };
    },
    watch: {
      prizeList: {
        deep: true,
        handler (oldval, newval) {
          debugger;
          if (oldval.length < newval.length) {
            this.tableData.push({
              name: newval.pop(),
              num: 1,
              time: 1
            });
          } else {
            this.tableData = this.tableData.map((e) => {
              return e;
            });
          }
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .settings
    padding: 100px
</style>
