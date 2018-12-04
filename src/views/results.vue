<template>
  <div class="results-wrapper">
    <div class="results-content">
      <h2 class="title">{{topicDesc}}</h2>
      <el-table
        :empty-text="emptyText"
        :data="results"
        bordern>
        <el-table-column
          prop="value"
          label="奖项名称">
        </el-table-column>
        <el-table-column
          prop="prizeName"
          label="奖品名称">
          <template slot-scope="scope">
            <el-tag>{{scope.row.prizeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="中奖人数">
          <template slot-scope="scope">
            {{scope.row.totalNumArr.length}}
          </template>
        </el-table-column>
        <el-table-column
          label="中奖号码">
          <template slot-scope="scope">
            <el-tag type="danger" :key="num" style="margin-left: 10px" v-for="num in scope.row.totalNumArr" >{{num}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from '../utils/store.js';

  export default {
    created () {
      let roll = utils.fetch('default_setting') || {};
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
    height 100%
    background: -webkit-linear-gradient(top,#cbebdb 0,#3794c0 120%);
    background: -moz-linear-gradient(top,#cbebdb 0,#3794c0 120%);
    background: -o-linear-gradient(top,#cbebdb 0,#3794c0 120%);
    background: -ms-linear-gradient(top,#cbebdb 0,#3794c0 120%);
    background: linear-gradient(top,#cbebdb 0,#3794c0 120%);
    .results-content
      width 60%
      margin 0 auto
      padding-top 8%
      .title
        font-size: 50px
        color: #555
        text-align: center
        margin: 0
</style>
