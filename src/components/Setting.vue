<template lang="html">
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a href="javascript:;" @click="back()"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">设 置</h1>
      <span class="head-right"></span>
    </header>
    <div class="scroll-view hastop">
      <div class="set-tip">
        系统设置
      </div>
      <div class="set-wrap">
        <a href="javascript:;"><strong>栏目插件设置</strong></a>
        <div>
          <strong>非Wi-Fi网络不下载图片</strong>
          <label class="btn-toggle">
            <input type="checkbox" checked="checked">
            <span></span>
          </label>
        </div>
        <a href="javascript:;" style="display:none"><strong>手动清理缓存</strong><span>25.92M <i class="ion-ios-arrow-right"></i></span></a>
        <div>
          <strong>要闻推送</strong>
          <label class="btn-toggle">
            <input type="checkbox">
            <span></span>
          </label>
        </div>
        <a href="javascript:;" @click="logout()"><strong>退出登录</strong></a>
      </div>

    </div>
  </div>
</template>

<script>
import { rmCfg } from "../service/cfg"
import { api } from '../service/request'
import { event } from '../service/'
export default {
  data() {
    return {
    };
  },
  computed: {},
  ready() {
  },
  attached() {},
  methods: {
    back() {
      window.history.back()
    },
    logout(){
      rmCfg("token")
      api.token = null
      event.trigger("logout", true)
      this.$router.go("/login")
    }
  },
  components: {}
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.set-tip
  padding-left 16px
  line-height 3em
  opacity .8
.set-wrap
  a, div
    display -webkit-flex
    display flex
    padding 10px 25px
    margin-bottom 8px
    justify-content space-between
    strong
      font-weight normal
      line-height 24px
</style>
