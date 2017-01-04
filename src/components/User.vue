<template lang="html">
<div style="height:100%; background-color:#f9f9f9">
  <div class="status-bg"></div>
  <div class="user-head">
    <div class="main-h">
      <span class="user-logo" :style="{backgroundImage: 'url('+ avatar +')'}"></span>
      <h1>{{nickname}}</h1>
      <a class="head-btn" v-link="{'path': '/setting'}"><i class="ion-ios-gear-outline"></i></a>
    </div>
    <div class="user-counter">
      <h4>我的新闻</h4>
      <strong>{{new_count}}</strong>篇
    </div>
    <div class="user-hinfo">
      <a v-link="{'path': '/information'}" class="user-hinfo-item">
        <span>约稿信息</span>
        <strong>{{yueg_count}}</strong>
      </a>
      <a v-link="{'path': '/information'}" class="user-hinfo-item">
        <span>系统信息</span>
        <strong>{{xit_count}}</strong>
      </a>
    </div>
  </div>
  <div class="user-quickbtn">
    <a v-link="{'path': '/user_data'}">
      <i class="ion-ios-folder-outline"></i>
      <strong>我的资料</strong>
    </a>
    <a v-link="{'path': '/change_password'}">
      <i class="ion-ios-unlocked-outline"></i>
      <strong>修改密码</strong>
    </a>
    <a v-link="{'path': '/me_reports'}">
      <i class="ion-ios-cloud-upload-outline"></i>
      <strong>我的报题</strong>
    </a>
  </div>
  <foot-menu active="2"></foot-menu>
</div>
</template>

<script>
import FootMenu from './FootMenu.vue'
import { api } from '../service/request'
import { event } from '../service/'

export default {
  data() {
    return {
      new_count: "--",
      xit_count: "--",
      yueg_count: "--",
      avatar: api.user.avatar,
      nickname: api.user.nickname,
      loading: false
    };
  },
  computed: {},
  ready() {
    this.request()
    event.on("updateUserData", this.updateUserData)
    event.on("logout", this.resetData)
  },
  beforeDestroy(){
    event.off("updateUserData", this.updateUserData)
    event.off("logout", this.resetData)
  },
  attached() {
    this.checkData()
  },
  methods: {
    resetData(){
      this.new_count = this.xit_count = this.yueg_count = "--"
      this.loading = false
    },
    updateUserData(data){
      if(data.avatar){
        this.avatar = data.avatar
      }
      if(data.nickname){
        this.nickname = data.nickname
      }
    },
    request(){
      this.loading = true
      api.get("/User/userCount")
        .then((data) => {
          this.loading = false
          if(data.status == 1){
            this.new_count = data.data.new_count
            this.xit_count = data.data.xit_count
            this.yueg_count = data.data.yueg_count
          }else{
            alert(data.info)
          }
        }, () => {
            this.loading = false
            alert("请求失败")
        })
    },
    checkData(){
      if(this.loading)return
      if(this.new_count == "--" || this.xit_count == "--" || this.yueg_count == "--"){
        this.avatar = api.user.avatar
        this.nickname = api.user.nickname
        this.request()
      }
    }
  },
  components: {
    FootMenu
  }
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.user-quickbtn
  display -webkit-flex
  display flex
  height 100px
  margin-top 16px
  border-top 1px solid #eee
  border-bottom 1px solid #eee
  background-color #fff
  a:active
    background-color rgba(0,0,0,.05)
  a
    height 100%
    display -webkit-flex
    display flex
    align-items center
    border-right 1px solid #eee
    justify-content center
    flex-direction column
    flex 1
    i
      font-size 3rem
      color $red
    strong
      font-weight normal
.user-head
  color #fff
  height 255px
  position relative
  background -webkit-linear-gradient(-5deg, #ff7e4a, #d31b13)
  background: linear-gradient(-5deg, #ff7e4a, #d31b13)
  .user-hinfo
    position absolute
    bottom 0
    left 0
    right 0
    height 70px
    display -webkit-flex
    display flex
    align-items center
    border-top 1px solid rgba(255,255,255,.4)
    .user-hinfo-item
      flex 1
      padding-left 16px
      strong
        display block
        font-size 23px
        font-weight normal
  .user-counter
    margin-top 30px
    text-align center
    h4
      font-size 1.3rem
      font-weight normal
    strong
      font-size 5rem
      font-weight normal
  .main-h
    height 45px
    position relative
    line-height 45px
    width 100%
    .user-logo
      width 40px
      height 40px
      position absolute
      left 16px;
      top 3px
      border-radius 50%
      background-repeat no-repeat
      background-size cover
    h1
      font-size 1.6rem
      text-align center
      font-weight normal
      padding: 0 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    .head-btn
      width 40px
      height 40px
      position absolute
      right 0
      top 0
      text-align center
      font-size 2.5rem
</style>
