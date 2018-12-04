<template>
  <div class="em-shape-shifter">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script type="text/ecmascript-6">
  import shapeShifter from  './shape-shifter';
  export default {
    name: 'EmShapeShifter',
    data () {
      return {
        resizeTimer: ''
      }
    },
    props: ['command','timer'],
    mounted () {
      let that = this;
      shapeShifter.init(this.$refs.canvas, this.command)
      this.resizeTimer = setTimeout(() => {
        shapeShifter.UI.reset()
        that.$emit('close')
        this.$refs.canvas.parentElement.removeChild(this.$refs.canvas)
      }, this.timer || 2000)
    },
    beforeDestroy () {
      clearTimeout(this.resizeTimer)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .em-shape-shifter canvas
    position: absolute
    top: 0
    bottom 0
    right 0
    left: 0
</style>
