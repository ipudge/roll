<template>
  <div class="results-wrapper">
    <h2 class="title">{{topicDesc}}</h2>
    <el-table
      :empty-text="emptyText"
      :data="results"
      border
      style="width: 100%">
      <el-table-column
        prop="value"
        label="奖项名称">
      </el-table-column>
      <el-table-column
        prop="prizeName"
        label="奖品名称">
      </el-table-column>
      <el-table-column
        prop="num"
        label="中奖人数">
      </el-table-column>
      <el-table-column
        label="中奖号码">
        <template scope="scope">
          <span class="el-tag" style="margin-left: 10px" v-for="num in scope.row.numArr" >{{num}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';

  export default {
    created () {
      let roll = utils.fetch('roll') || {};
      this.results = roll.results || [];
      this.topic = roll.topic;
    },
    data () {
      return {
        emptyText: '暂无中奖记录'
      };
    },
    computed: {
      topicDesc () {
        if (this.topic) {
          return `${this.topic}抽奖的中奖结果`;
        } else {
          return '本次抽奖的中奖结果';
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .results-wrapper
    position: absolute
    top: 100px
    left: 50%
    margin-left: -400px
    width: 800px
    .title
      font-size: 50px
      color: #555
      text-align: center
      margin-bottom: 80px
    .el-tag
      background-color: #8492a6
      display: inline-block
      padding: 0 5px
      height: 24px
      line-height: 22px
      font-size: 12px
      color: #fff
      border-radius: 4px
      box-sizing: border-box
      border: 1px solid transparent
      white-space: nowrap
</style>
