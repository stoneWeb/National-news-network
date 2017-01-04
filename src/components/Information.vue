<template lang="html">
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a href="javascript:;" @click="back()"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">收件箱</h1>
      <span class="head-right"></span>
    </header>

      <div class="infom_head">
        <a href="javascript:;" @click="tab(0)" :class="{'active': index == 0}"><i class="ion-ios-email-outline"></i> 系统信息</a>
        <a href="javascript:;" @click="tab(1)" :class="{'active': index == 1}"><i class="ion-ios-email-outline"></i> 约稿信息</a>
      </div>
      <div class="infom_wrap">
        <div class="infom_wp" :class="{'swipe': index == 1}">

          <div class="infom_box">
            <div class="loading-box" v-show="load1">
              <i class="ion-load-a loading"></i>
            </div>
            <div style="padding-top:15px;text-align:center" v-if="!load1 && !data1.length">
              暂无数据
            </div>
            <div class="scroll-view" v-if="data1.length">
              <div class="infm-list" v-for="item in data1">
                <label class="select-view" @click="check($event, 1)"><input type="checkbox" v-model="item.checked"><b></b></label>
                <div class="infom_main">
                  <div class="infom_main_text">
                    <h3>{{item.from_name}}</h3>
                    <p>{{item.title}}</p>
                  </div>
                  <div class="infom_other">
                    <time>{{item.dateline}}</time>
                    <i class="ion-ios-arrow-right"></i>
                  </div>
                </div>
              </div>
              <infinite-loading :on-infinite="onInfinite"></infinite-loading>
            </div>
            <div class="infom_ctrl" v-if="data1.length">
              <div class="infom_cl">
                <label class="select-view"><input type="checkbox" v-model="check1" @click="checkAll($event, 1)"><b></b>全选</label>
              </div>
              <div class="infom_btns">
                <a href="javascript:;" @click="remMsg(1)">删除</a>
                <a href="javascript:;" @click="cancel(1)">取消</a>
              </div>
            </div>
          </div>
          <div class="infom_box">

            <div class="loading-box" v-show="load2">
              <i class="ion-load-a loading"></i>
            </div>
            <div style="padding-top:15px;text-align:center" v-if="!load2 && !data2.length">
              暂无数据
            </div>
            <div class="scroll-view" v-if="data2.length">
              <div class="infm-list" v-for="item in data2">
                <label class="select-view" @click="check($event, 2)"><input type="checkbox" v-model="item.checked"><b></b></label>
                <div class="infom_main">
                  <div class="infom_main_text">
                    <h3>{{item.from_name}}</h3>
                    <p>{{item.title}}</p>
                  </div>
                  <div class="infom_other">
                    <time>{{item.dateline}}</time>
                    <i class="ion-ios-arrow-right"></i>
                  </div>
                </div>
              </div>
              <infinite-loading :on-infinite="onInfinite"></infinite-loading>
            </div>
            <div class="infom_ctrl" v-if="data2.length">
              <div class="infom_cl">
                <label class="select-view"><input type="checkbox" v-model="check2" @click="checkAll($event, 2)"><b></b>全选</label>
              </div>
              <div class="infom_btns">
                <a href="javascript:;" @click="remMsg(2)">删除</a>
                <a href="javascript:;" @click="cancel(2)">取消</a>
              </div>
            </div>
          </div>
        </div>

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
      data1: [],
      data2: [],
      load1: false,
      load2: false,
      check1: false,
      check2: false,
      page1: 1,
      page2: 1,
      index: 0,
      loading: false
    };
  },
  computed: {},
  ready() {
    event.on("logout", this.resetData)
  },
  beforeDestroy(){
    event.off("logout", this.resetData)
  },
  attached() {
    this.checkData()
  },
  methods: {
    resetData(){
      this.load1 = this.load2 = this.loading = false
      this.data1.length = this.data2.length = 0
      this.page1 = this.page2 = 1
      this.index = 0
      this.check1 = this.check2 = false
    },
    async firstRequest(){
      const reject = (err) => {
        alert(err.info||"请求失败")
      }
      this.load1 = this.load2 = true
      let [msg1, msg2] = await Promise.all([
        api.get("/User/getMessage", {page: this.page1, size: this.pageSize})
          .catch(reject),
        api.get("/User/getMessage", {type: 3, page: this.page1, size: this.pageSize})
          .catch(reject)
      ])
      this.load1 = this.load2 = false
      if(msg1){
        if(msg1.status == 1){
          this.data1 = msg1.data.map((item) => {
            item.checked = false
            return item
          })
        }else{
          reject(msg1)
        }
      }
      if(msg2){
        if(msg2.status == 1){
          this.data2 = msg2.data.map((item) => {
            item.checked = false
            return item
          })
        }else{
          reject(msg2)
        }
      }
    },
    checkData(){
      if(this.load1 || this.load2)return
      if(!this.data1.length && !this.data2.length){
        this.pageSize = 20
        this.firstRequest()
      }
    },
    back() {
      window.history.back()
    },
    tab(n){
      if(n == this.index){
        return
      }
      this.index = n
    },
    check(ev, index){
      if(!ev.target.checked){
        this["check"+index] = false
      }
    },
    checkAll(ev, index){
      let data = this["data"+index]
      let checked = ev.target.checked
      data.forEach((item) => {
        item.checked = checked
      })
    },
    cancel(index){
      this["check"+index] = false
      this["data"+index].forEach((item) => {
        item.checked = false
      })
    },
    async remMsg(index){
      if(this.loading)return
      let ref = [], newList = []
      this["data"+index].forEach((item, i) => {
        if(item.checked){
          ref.push(item.msg_id)
        }else{
          newList.push(item)
        }
      })
      if(ref.length){
        this.loading = true
        let data = await api.post("/User/delMessage", {ids: ref}).catch(() => alert("请求失败"));
        this.loading = false
        if(data){
          if(data.status == 1){
            this["data"+index] = newList
          }else{
            alert(data.info)
          }
        }
      }
    },
    async onInfinite(){
      let active = this.index+1
      let p = this["page"+active];
      let params = {
        size: this.pageSize,
        page: p+1
      }
      if(active == 2){
        params.type = 3
      }
      let data = await api.get("/User/getMessage", params).catch(() => {alert("请求失败"); this.$broadcast('$InfiniteLoading:loaded')});
      if(data){
        if(data.status == 1){
          this["page"+active] = p+1
          let d = data.data.map((item) => {
            item.checked = false
            return item
          })
          this["data"+active] = this["data"+active].concat(d)
          if(data.data.length < 20){
            this.$broadcast('$InfiniteLoading:complete');
            return
          }
        }else{
          alert(data.info)
        }
        this.$broadcast('$InfiniteLoading:loaded');
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
.infom_head
  display flex
  margin 0 8px
  border-bottom 1px solid #ddd
  .active
    color $red
  a
    flex 1
    text-align center
    line-height 40px
    i
      font-size 1.3em
      vertical-align middle
.infom_head a:first-child
  border-right 1px solid #ddd
.infom_wrap
  position absolute
  left 0
  right 0
  bottom 55px
  overflow hidden
  .swipe.infom_wp
    transform translateX(-50%)
  .infom_wp
    display -webkit-flex
    display flex
    width 200%
    height 100%
    transition transform 200ms
    .infom_box
      width 50%
      height 100%
      position relative
      padding 0 3px
      .scroll-view
        bottom 50px
        padding 0 8px 20px 8px
  .infom_ctrl
    display flex
    width 100%
    box-shadow 0 -2px 10px rgba(0,0,0,.1)
    position absolute
    padding 10px
    padding-bottom 20px
    background-color #f9f9f9
    bottom 0
    .select-view
      padding 8px 0
    .infom_btns
      flex 1
      text-align right
      a
        display inline-block
        line-height 1.5em
        padding 0 8px
        border 1px solid $red
        border-radius 4px
        color $red
        margin-left 10px
  .infm-list
    display flex
    padding 12px 0
    align-items center
    border-bottom 1px solid #ddd
    label
      width 30px
      height 40px
      display flex
      justify-content center
      align-items center
      margin 0
    .infom_main
      display flex
      flex 1
      .infom_main_text
        height 58px
        overflow hidden
        flex 1
      .infom_other
        width 85px
        text-align right
        time
          color $red
          display block
          margin-bottom 10px
        i
          font-size 22px
          color #999
          margin-right 5px
      h3
        font-size 13px
        color #888
        margin-bottom 5px
      p
        line-height 1.4em


</style>
