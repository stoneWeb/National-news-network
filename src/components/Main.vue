<template lang="html">
<div style="height:100%; background-color:#d62217">
  <div class="status-bg"></div>
  <div class="scroll-view" style="bottom:50px; padding-bottom: 10px; background-color:#f9f9f9">
    <div class="main-head">
      <div class="main-head-bg">
        <div class="main-h">
          <h1>{{nickname}}</h1>
        </div>
        <div class="main-title">
          <span :class="{'active': active == 0}" @click="goPosition(0)">重要通知</span>
          <span :class="{'active': active == 1}" @click="goPosition(1)">策划约稿</span>
          <span :class="{'active': active == 2}" @click="goPosition(2)">业务交流</span>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="main-banner" style="background-image:url(static/img/banner.png)"></div>
      <div class="loading-box" v-show="loading">
        <i class="ion-load-a loading"></i>
      </div>
      <div class="main-box" id="main_pos0" v-if="zhongytz.length">
        <h2 class="tit1">重要通知</h2>
        <a v-link="{'name': 'news_detail', 'params':{'id': item.aid}}" v-for="item in zhongytz">
          <h3>{{item.title}}</h3>
          <p><time>{{item.postdate}}</time><i class="ion-ios-arrow-thin-right"></i></p>
        </a>
      </div>
      <div class="main-box" id="main_pos1" v-if="cehyg.length">
        <h2 class="tit2">策划约稿</h2>
        <a v-link="{'name': 'news_detail', 'params':{'id': item.aid}}" v-for="item in cehyg">
          <h3>{{item.title}}</h3>
          <p><time>{{item.postdate}}</time><i class="ion-ios-arrow-thin-right"></i></p>
        </a>
      </div>
      <div class="main-box" id="main_pos2" v-if="yewjl.length">
        <h2 class="tit3">业务交流</h2>
        <a v-link="{'name': 'news_detail', 'params':{'id': item.aid}}" v-for="item in yewjl">
          <h3>{{item.title}}</h3>
          <p><time>{{item.postdate}}</time><i class="ion-ios-arrow-thin-right"></i></p>
        </a>
      </div>
    </div>
  </div>
  <foot-menu active="1"></foot-menu>
</div>
</template>

<script>
import FootMenu from './FootMenu.vue'
import { util, event } from '../service/'
import { api } from '../service/request'
import { setCfg } from "../service/cfg"
export default {
  data() {
    return {
      active: 0,
      zhongytz: [],
      cehyg: [],
      yewjl: [],
      nickname: "",
      loading: false
    };
  },
  computed: {},
  ready() {
    // 阻止 keep-alive
    event.on("logout", this.resetData)
  },
  beforeDestroy(){
    event.off("logout", this.resetData)
  },
  attached() {
    if(window.cordova){
      StatusBar.styleLightContent();
    }
    this.checkData()
  },
  methods: {
    resetData(){
      this.zhongytz.length = this.cehyg.length = this.yewjl.length = 0
      this.nickname = ""
      this.loading = false
    },
    checkData(){
      if(this.loading)return
      if(!this.zhongytz.length || !this.cehyg.length || !this.yewjl.length){
        this.request()
      }
    },
    request(){
      this.loading = true
      api.get("")
        .then((data) => {
            this.loading = false
            this.zhongytz = data.data.zhongytz
            this.cehyg = data.data.cehyg
            this.yewjl = data.data.yewjl
            this.nickname = data.data.nickname
            setCfg("nickname", data.data.nickname)
            setCfg("avatar", data.data.avatar)
            api.user.nickname = data.data.nickname
            api.user.avatar = data.data.avatar
        }, (err) => {
            this.loading = false
            if(401 == err.status){
              this.$router.go("/login")
            }
            //alert("请求失败！")
        })
    },
    goPosition(index){
      if(index != this.active){
        this.active = index
      }
      util.scrollTop("main_pos"+index, this.$el.querySelector(".scroll-view"))
    }
  },
  components: {
    FootMenu
  }
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.main-head
  .main-head-bg
    position relative
    height 160px
    color #fff
    background -webkit-linear-gradient(-5deg, #ff7e4a, #d31b13)
    background: linear-gradient(-5deg, #ff7e4a, #d31b13)
  .main-h
    height 45px
    position relative
    line-height 45px
    width 100%
    h1
      height 45px
      font-size 1.6rem
      text-align center
      font-weight normal
    .head-btn
      width 40px
      height 40px
      position absolute
      z-index 1
      right 16px
      top 0
      text-align center
      font-size 2.5rem
  .main-title
    display -webkit-flex
    display flex
    line-height 2em
    justify-content center
    span
      padding 0 10px
      position relative
  .main-title .active:after
    content ""
    position absolute
    left 50%
    bottom -3px
    width 6px
    height 6px
    margin-left -3px
    border-radius 50%
    background-color #fff
  .main-head-bg:after, .main-head-bg:before
    content ""
    bottom -8px
    width 16px
    height 16px
    position absolute
    background-color #ff7e4a
  .main-head-bg:before
    left -8px
    transform rotate(45deg)
  .main-head-bg:after
    right -8px
    transform rotate(45deg)
.main-content
  position absolute
  top 100px
  left 10px
  right 10px
  .main-banner
    border 5px solid #fff
    border-radius 5px
    background-color #eee
    background-size cover
    background-repeat no-repeat
    box-shadow 0 1px 8px rgba(0,0,0,.08)
  .main-banner:after
    content ""
    display block
    padding-bottom 55%
.main-box
  padding 10px
  background-color #fff
  box-shadow 0 2px 8px rgba(0,0,0,.05)
  border-radius 3px
  margin-top 15px
  a
    border-bottom 1px solid #eee
    margin-top 18px
    padding-bottom 5px
    display block
    p
      color #aaa
      position relative
      line-height 2.5em
      i
        position absolute
        right 0
        font-size 2.5rem
  h2
    line-height 2rem
    padding 0 2rem
    display inline-block
    font-size 1.4rem
    color #fff
    border-radius 2rem
  h3
    font-weight normal
    font-size 1.6rem
    line-height 1.3em
  .tit1
    background-color #fe4342
    box-shadow 0 5px 10px rgba(214,70,70,.4)
  .tit2
    background-color #f36143
    box-shadow 0 5px 10px rgba(207,97,75,.4)
  .tit3
    background-color #429afe
    box-shadow 0 5px 10px rgba(87,133,180,.4)
.main-box a:last-child
  border 0 none
</style>
