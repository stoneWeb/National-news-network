<template lang="html">
  <div class="footer-menu">
    <a v-link="{'path': '/main'}" class="foot-home" :class="{'active': active == 1}"><i class="ion-ios-home"></i>首页</a>
    <a v-link="{'path': '/add_report'}" class="foot-add"><i class="ion-ios-plus-empty"></i></a>
    <a v-link="{'path': '/user'}" class="foot-user" :class="{'active': active == 2}"><i class="ion-ios-person"></i>个人中心</a>
  </div>
</template>

<script>
export default {
  props: {
      active: { type: String, default: "0" }
  },
  data() {
    return {

    }
  },
  computed: {},
  ready() {
  },
  attached() {},
  methods: {},
  components: {}
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.footer-menu
  height 50px
  position absolute
  bottom 0
  left 0
  right 0
  padding 0 15px
  background-color #fff
  border-top 1px solid #eee
  box-shadow 0 -2px 8px rgba(0,0,0,.05)
  display -webkit-flex
  display flex
  .active
    color $red
  .foot-add
    width 55px
    height 55px
    padding 5px
    margin-top -15px
    background-color #fff
    border-radius 50%
    box-shadow 0 0 5px rgba(0,0,0,.08) inset, 0 -2px 5px rgba(0,0,0,.08)
    i
      height 45px
      width 45px
      background-color $red
      color #fff
      display block
      line-height 45px
      text-align center
      font-size 30px
      border-radius 50%
  .foot-home, .foot-user
    line-height 1.2em
    text-align center
    flex 1
    i
      font-size 20px
      margin-top 3px
      display block
</style>
