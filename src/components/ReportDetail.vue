<template lang="html">
  <div>
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a href="javascript:;" @click="back()"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">详 情</h1>
      <span class="head-right"></span>
    </header>
    <div class="scroll-view hastop" style="padding-bottom: 20px">
      <div class="loading-box" v-show="loading">
        <i class="ion-load-a loading"></i>
      </div>
      <div v-if="!loading && data">
        <div class="rt-card">

          <h3>视频 <i class="ion-ios-videocam-outline"></i></h3>
          <div class="rt-info">约稿：{{data.tags}}</div>
          <div class="rt-info">发布时间：{{data.dateline}}</div>
          <div class="rt-info">分类：{{data.typetitle}}</div>
          <div class="rt-info">发布单位：{{data.tv_name}}</div>
          <div class="rt-video-wrap" v-for="item in data.videos">
            <div class="rt-video" v-if="item.videoOptions">
              <video-player v-if="item.videoOptions" :options="item.videoOptions"></video-player>
            </div>
            <div class="rt-info" v-if="!item.videoOptions">没有获取到视频文件</div>
            <div class="rt-info">文件大小：{{item.size}}KB</div>
            <div class="rt-info">上传时间：{{item.itime}}s</div>
            <div class="rt-info">上传速度：{{item.files}}KB/s</div>
            <div class="rt-info">视频格式：{{item.ext}}</div>
          </div>

        </div>
        <div class="rt-card" v-if="data.pics && data.pics.length">
          <h3>图片 <i class="ion-images"></i></h3>
          <div class="rf-image" v-for="item in data.pics">
            <img :src="item.savepath" alt="">
          </div>
        </div>
        <div class="rt-card" v-if="data.title && data.content">
          <h3>正文</h3>
          <div class="rf-text">
            <h4>{{data.title}}</h4>
            <p>{{data.content}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { api } from '../service/request'
import { videoPlayer } from 'vue-video-player'
export default {
  data() {
    return {
      id: null,
      loading: false,
      data: null
    }
  },
  watch: {
    id(val){
      this.data = null
      this.loading = true
      api.get("/Baoti/view", {id: val})
        .then((data) => {
          if(val == this.id){
            if(data.status == 1){
              if(data.data.videos && data.data.videos.length){
                data.data.videos = data.data.videos.map((item) => {
                    if(item.app_savepath){
                      item.videoOptions = {
                        source: {
                          //type: "video/mp4"+item.ext,
                          //src: item.app_savepath
                          src: item.app_savepath,
                          type: "video/mp4"
                        },
                        width: "100%",
                        autoplay: false,
                        playsinline: true,
                        language: 'zh-CN'
                      }
                    }
                    return item
                })
              }
              this.data = data.data
            }else{
              this.data = null
              alert(data.info)
            }
            this.loading = false;
          }

        }, (err) => {
          if(val == this.id){
            this.data = null
            this.loading = false;
            alert("请求失败！")
          }
        })
    }
  },
  ready() {
  },
  attached() {
    this.id = this.$route.params.id
  },
  methods: {
    back() {
      window.history.back()
    }
  },
  components: {
    videoPlayer
  }
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.rt-card
  margin $card-margin $card-margin 0 $card-margin
  padding $card-padding
  background-color #fff
  border-radius 3px
  box-shadow 0 1px 6px rgba(0,0,0,.03)
  h3
    color $red
    font-size 1.6rem
    font-weight normal
    display -webkit-flex
    display flex
    margin-bottom 10px
    align-items center
    justify-content space-between
    i
      font-size 1.4em
  .rt-info
    font-size 1.3rem
    line-height 1.5em
    color #999
  .rt-video-wrap
    margin 15px 0
    overflow hidden
  .rt-video
    height 200px
    margin 6px 0
    display -webkit-flex
    display flex
    align-items center
    justify-content center
    background-color #ddd
    .video-player, .video-js
      width 100%
      height 100%
      .vjs-big-play-button
        height 2em
        width 2em
        margin-left -1em
        border-radius 50%
    i
      width 50px
      height 50px
      line-height 50px
      font-size 40px
      text-align center
      border-radius 50%
      padding-left 6px
      color #fff
      border 1px solid #fff
  .rf-image
    margin-bottom 15px
    img
      display block
  .rf-text
    padding-bottom 20px
    line-height 1.6em
    h4
      font-size 1.6rem
      margin-bottom 6px
    p
      font-size 1.3rem
      color #999
</style>
