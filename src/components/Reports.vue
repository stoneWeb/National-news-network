<template lang="html">
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a href="javascript:;" @click="back()"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">我的报题</h1>
      <span class="head-right"></span>
    </header>
    <div class="scroll-view hastop" style="bottom:50px; padding-bottom: 30px;">
      <div class="search_report">
        <i class="ion-ios-search-strong"></i><input type="text" placeholder="标题关键词" v-model="kw" @keyup.13="search">
      </div>
      <a class="report_card" v-link="{'name': 'report_detail', 'params':{'id': item.id}}" v-for="item in reports">
        <div class="report_cover" v-if="item.img" :style="{backgroundImage: 'url('+ item.img +')'}"></div>
        <div class="report_content">
          <h3>{{item.title}}</h3>
          <time>{{item.dateline}}</time>
          <p>状态：<strong>{{item.is_read == 0?"未阅":"已读"}}</strong><i class="ion-ios-arrow-thin-right"></i></p>
        </div>
      </a>
      <infinite-loading :on-infinite="onInfinite"></infinite-loading>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import FootMenu from './FootMenu.vue'
import { api } from '../service/request'
import { event } from '../service/'
export default {
  data() {
    return {
      reports: [],
      loading: false,
      page: 0,
      kw: ""
    };
  },
  computed: {},
  ready() {
    this.isSearch = false
    let _this = this;
    let updateReport = () => {
      if(!_this.isSearch){
        _this.page = 0
        _this.reports = []
        _this.$nextTick(() => {
          _this.$broadcast('$InfiniteLoading:reset');
          _this.onInfinite()
        })
      }
    }
    this.offUpReport = () => {
      event.off("updateReport", updateReport)
    }
    event.on("updateReport", updateReport)
    event.on("logout", this.resetData)
  },
  beforeDestroy(){
    this.offUpReport()
    event.off("logout", this.resetData)
  },
  attached() {
    this.checkData()
  },
  methods: {
    back() {
      window.history.back()
    },
    checkData(){
      if(this.loading)return
      if(!this.reports.length){
        this.$nextTick(() => {
          this.pageSize = 20
          this.$broadcast('$InfiniteLoading:reset');
          this.onInfinite()
        })
      }
    },
    resetData(){
      this.page = 0
      this.reports = []
      this.isSearch = false
      this.loading = false
      this.kw = ""
      this.$nextTick(() => {
        this.$broadcast('$InfiniteLoading:reset');
      })
    },
    onInfinite(){
      if(this.loading)return
      this.loading = true
      let p = this.page+1,
          params = {page: p, size: this.pageSize || 20}
      if(this.isSearch){
        params.kw = this.kw.trim()
      }
      api.get("/Baoti/mybtxw", params)
        .then((data) => {
          if(data.status == 1){
            this.reports = this.reports.concat(data.data)
            if(data.data.length < 20){
              this.$broadcast('$InfiniteLoading:complete');
            }
            this.page+=1
          }else{
            alert(data.info)
          }
          this.loading = false
          this.$broadcast('$InfiniteLoading:loaded');
        }, (err) => {
          this.loading = false
          this.$broadcast('$InfiniteLoading:loaded');
        })
    },
    search(){
      if(this.kw.trim()){
        this.page = 0
        this.isSearch = true
        this.reports = []
        this.$nextTick(() => {
          this.$broadcast('$InfiniteLoading:reset');
        })
      }else if(this.isSearch){
        this.page = 0
        this.isSearch = false
        this.reports = []
        this.$nextTick(() => {
          this.$broadcast('$InfiniteLoading:reset');
        })
      }
    }
  },
  components: {
    FootMenu,
    InfiniteLoading
  }
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.search_report
  margin 16px
  background-color #fff
  height 35px
  border-radius 3px
  display -webkit-flex
  display flex
  color #777
  box-shadow 0 0 8px rgba(0,0,0,.06)
  i
    width 35px
    height 35px
    text-align center
    line-height 35px
    font-size 2.3rem
  input
    flex 1
    font-size 1.4rem
    background none
    border 0 none
.report_card:active
  background-color rgba(0,0,0,.03)
.report_card
  padding 10px
  margin 0 16px 16px 16px
  display -webkit-flex
  display flex
  border-radius 3px
  background-color #fff
  box-shadow 0 1px 6px rgba(0,0,0,.06)
  .report_cover
    width 85px
    height 85px
    border-radius 3px
    background-size cover
  .report_content
    padding-left 8px
    flex 1
    h3
      font-weight normal
      font-size 1.6rem
      line-height 1.2
      max-height 3.8rem
      overflow hidden
    time
      color #888
      line-height 2em
    strong
      color $orange
    p
      position relative
      i
        position absolute
        font-size 2.5rem
        bottom -7px
        right 0
        color #aaa
</style>
