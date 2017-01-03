<template>
  <div id="app">
    <div class="nav" :class="{'active':navShow}">
      <el-menu default-active="1" theme="dark">
        <el-menu-item index="1"><i class="el-icon-setting"></i><router-link :to="{ path: '/settings'}">抽奖设置</router-link></el-menu-item>
        <el-menu-item index="2"><i class="el-icon-menu"></i><router-link :to="{ path: '/'}">去抽奖</router-link></el-menu-item>
        <el-menu-item index="3"><i class="el-icon-document"></i><router-link :to="{ path: '/'}">抽奖结果</router-link></el-menu-item>
      </el-menu>
      <div class="toggleNav" @click="toggleNav">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <transition name="fade">
      <div class="mask" v-show="navShow" @click="hideNav"></div>
    </transition>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        navShow: false
      };
    },
    methods: {
      hideNav () {
        this.navShow = false;
      },
      toggleNav () {
        this.navShow = !this.navShow;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  html, body
    height: 100%

  #app
    width: 100%
    height: 100%
    .nav
      position: fixed
      left: 0
      top: 0
      width: 200px
      height: 100%
      background: #324057
      transition: all 0.5s
      transform: translate3d(-200px, 0, 0)
      z-index: 999
      .router-link-active
        color: #20a0ff
        text-decoration: none
      &.active
        transform: translate3d(0, 0, 0)
        .toggleNav
          .el-icon-plus
            transform: rotate(315deg)
      .toggleNav
        position: absolute
        top: 0
        left: 100%
        background: #324057
        padding: 10px
        cursor: pointer
        &:hover
          background: rgb(71, 86, 105)
        .el-icon-plus
          color: #fff
          font-size: 20px
          transition: all 0.5s
          transform: rotate(0)
    .mask
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      background: rgba(0, 0, 0, 0.5)
      z-index: 998
      transition: opacity .5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
</style>
