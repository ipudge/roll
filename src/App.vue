<template>
  <div id="app">
    <div class="nav" :class="{'active':navShow}">
      <el-menu  background-color="#324157" text-color="#bfcbd9" :default-active="onRoutes" router >
        <el-menu-item index="1" :index="router1"><i class="el-icon-setting"></i>
          抽奖设置
        </el-menu-item>
        <el-menu-item index="2" :index="router2"><i class="el-icon-menu"></i>
          去抽奖
        </el-menu-item>
        <el-menu-item index="3" :index="router3"><i class="el-icon-view"></i>
          抽奖结果
        </el-menu-item>
      </el-menu>
      <div class="toggleNav" @click="toggleNav">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <transition name="fade">
      <div class="mask" v-show="navShow" @click="hideNav"></div>
    </transition>
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        navShow: false,
        router1: {path: '/settings'},
        router2: {path: '/'},
        router3: {path: '/results'}
      };
    },
    computed : {
      onRoutes(){
        return this.$route.path;
      },
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
    background #000
  #app
    width: 100%
    height: 100%
    .move-enter-active,.move-leave-active
      transition opacity .5s
    .move-enter,.move-leave
      opacity 0
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
