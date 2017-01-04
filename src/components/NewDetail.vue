<template lang="html">
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a v-link="{'path': '/main'}"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">新闻详情</h1>
      <span class="head-right"><a v-link="{'path': '/setting'}"><i class="ion-android-more-vertical"></i></a></span>
    </header>
    <div class="scroll-view hastop" style="bottom:50px; padding-bottom: 10px">
      <div class="loading-box" v-show="loading">
        <i class="ion-load-a loading"></i>
      </div>
      <div class="news_detail" v-if="data">
        <h1>{{data.title}}</h1>
        <p class="news_detail_gray"><time>{{data.posttime}}</time></p>
        <div class="detiail_body">
          <img v-if="data.pic" :src="{{data.pic}}" alt="">
          <div class="detail_text">
            {{{data.content | clear-style}}}
          </div>
        </div>
        <div class="main-box" v-if="related.length">
          <h2 class="tit3">相关推荐</h2>
          <a v-link="{name: 'news_detail', params: {id: item.aid}}" v-for="item in related">
            <h3>{{item.title}}</h3>
            <p><time>{{item.posttime}}</time><i class="ion-ios-arrow-thin-right"></i></p>
          </a>
        </div>
      </div>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>

<script>
import FootMenu from './FootMenu.vue'
import { api } from '../service/request'
export default {
  data() {
    return {
      id: null,
      loading: false,
      data: null,
      related: []
    };
  },
  computed: {
  },
  ready() {},
  watch: {
    id(val){
      this.data = null
      this.related = []
      this.loading = true
      api.get("/Index/view", {id: val, page: 1})
        .then((data) => {
          if(val == this.id){
            if(data.status == 1){
              this.data = data.data
              this.related = data.related
            }else{
              this.data = null
              this.related = []
              alert(data.info)
            }
            this.loading = false;
          }

        }, (err) => {
          if(val == this.id){
            this.data = null
            this.related = []
            this.loading = false;
            alert("请求失败！")
          }
        })
    }
  },
  attached() {
    this.id = this.$route.params.id
  },
  methods: {},
  components: {
    FootMenu
  }
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.news_detail
  margin 0 15px
  h1
    font-size 18px
    line-height 1.5em
    margin-top 10px
  .news_detail_gray
    line-height 2em
    color #999
    text-align right
  .detiail_body
    background-color #fff
    .detail_text
      padding 10px
      p
        line-height 1.5em
        color #777
        margin-bottom 8px
</style>
