<template lang="html">
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a href="javascript:;" @click="back()"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">报送新闻</h1>
      <span class="head-right"></span>
    </header>
    <div class="scroll-view hastop" :style="{'padding-bottom': paddingBottom}">
      <div class="art-wrap">
        <h2 @click="blurInput()"><i class="ion-flag"></i>标题</h2>
        <input type="text" v-model="title" :disabled="isRelease" placeholder="请输入新闻标题">
      </div>
      <div class="art-wrap">
        <h2 @click="blurInput()"><i class="ion-document-text"></i>正文</h2>
        <textarea v-model="content" :disabled="isRelease" placeholder="请输入新闻正文"></textarea>
      </div>
      <div class="art-wrap">
        <h2 @click="blurInput()"><i class="ion-document-text"></i>上传视频</h2>
        <p @click="blurInput()" class="art-tip">注意：视频只支持wmv,mp4格式  大小为1G以下，码流为4M以上。</p>
        <div class="upload-card" v-for="item in videos">
          <div class="up-view"><i class="ion-ios-play"></i></div>
          <div class="up-info">
            <time>{{formatDate(item.lastModifiedDate)}}</time>
            <div class="up-prog-info">
              <span class="up-progress"><strong :style="{'width': item.progress+'%'}"></strong></span>
              <span class="up-progress-text">{{item.progress}}%</span>
              <span class="up-progress-status">{{item.state}}</span>
            </div>
            <p class="up-liul"><i class="ion-android-bulb"></i>消耗流量：{{formatSize(item.size)}}</p>
            <p class="up-ctrl"><a href="javascript:;" @click="removeMedia(1,$index)"><i class="ion-android-delete"></i></a></p>
          </div>
        </div>
        <div class="up-btn" @click="getMedia(1)">
          <i class="ion-ios-plus-outline"></i>
        </div>
      </div>

      <div class="art-wrap">
        <h2><i class="ion-document-text"></i>上传图片</h2>
        <div class="upload-card" v-for="item in pics">
          <div class="up-view"></div>
          <div class="up-info">
            <time>{{formatDate(item.lastModifiedDate)}}</time>
            <div class="up-prog-info">
              <span class="up-progress"><strong :style="{'width': item.progress+'%'}"></strong></span>
              <span class="up-progress-text">{{item.progress}}%</span>
              <span class="up-progress-status">{{item.state}}</span>
            </div>
            <p class="up-liul"><i class="ion-android-bulb"></i>消耗流量：{{formatSize(item.size)}}</p>
            <p class="up-ctrl"><a href="javascript:;" @click="removeMedia(2,$index)"><i class="ion-android-delete"></i></a></p>
          </div>
        </div>
        <div class="up-btn" @click="getMedia(2)">
          <i class="ion-ios-plus-outline"></i>
        </div>
      </div>
      <div class="art-wrap">
        <h2 @click="blurInput()">推荐理由</h2>
        <textarea v-model="result" :disabled="isRelease" placeholder="可不填"></textarea>
      </div>
      <a href="javascript:;" @click="submit()" :style="{'opacity': isRelease?'.7':'1'}" class="submit-btn short">{{isRelease?'发布中...':'发 布'}}</a>
      <br/><br/><br/>
    </div>
  </div>
</template>

<script>
import { api } from '../service/request'
import { util, event } from '../service/'
export default {
  data() {
    return {
      title: "",
      content: "",
      videos: [],
      pics: [],
      result: "",
      isRelease: false,
      paddingBottom: "0px"
    }
  },
  computed: {},
  ready() {
    this.offKeyboardEvent = () => {}
    if(window.cordova){
      if(device.platform === "iOS"){
        let _this = this
        let showKeyboard = (e) => {
          if(_this.$route.path == '/add_report'){
            _this.paddingBottom = e.keyboardHeight + "px"
          }
        }
        let hideKeyboard = () => {
          _this.paddingBottom = "0px"
        }
        this.offKeyboardEvent = () => {
          event.off("keyboardshow", showKeyboard)
          event.off("keyboardhide", hideKeyboard)
        }
        event.on("keyboardshow", showKeyboard)
        event.on("keyboardhide", hideKeyboard)
      }
    }
  },
  beforeDestroy () {
    this.offKeyboardEvent()
  },
  attached() {},
  methods: {
    back() {
      window.history.back()
    },
    progress(fid, progress){
      var id = (fid||"").split("-"), target;
      if(id.length == 2){
        let o = this[id[0]]
        for(var i=0,item;item=o[i];i++){
          if(item.id==id[1]){
            target = item
            break
          }
        }
      }
      if(target){
        target.progress = progress
      }
    },
    release(){
      let video = [], pic = [], check;
      this.videos.forEach((item) => {
        if("undefined" != typeof item.fileId){
          video.push(item.fileId)
        }else{
          check = true
        }
      })
      this.pics.forEach((item) => {
        if("undefined" != typeof item.fileId){
          pic.push(item.fileId)
        }else{
          check = true
        }
      })

      let send = async () => {
        video = video.join(",")
        pic = pic.join(",")
        let {title, content, result} = this
        let data = await api.post("/Baoti/add", {title, content, video, pic, result})
          .catch(() => alert("请求失败"))
        this.isRelease = false
        if(data){
          if(data.status == 1){
            this.title = this.content = this.result = ""
            this.videos = []
            this.pics = []
            event.trigger("updateReport", true)
            alert("新闻发布成功！")
          }else{
            alert(data.info||"发布新闻失败！")
          }
        }
      }
      if(check){
        window.confirm("有文件上传失败，是否继续发布？", (index) => {
          if(index == 1){
            send()
          }else{
            this.isRelease = false
          }
        })
      }else{
        send()
      }
    },
    submit(){
      if(this.isRelease)return
      if(!this.title.trim() || !this.content.trim()){
        alert("请填完整")
        return
      }
      if(!this.videos.length && !this.pics.length){
        this.isRelease = true;
        this.release()
        return
      }
      let max = 0, succ = 0, fail = 0;
      let resolve = (r) => {
        var data = r.response
        ++succ
        let success = r.responseCode == 200 && data.status == 1
        let id = (r.id||"").split("-");
        if(id.length == 2){
          for(var i=0,item;item=this[id[0]][i];i++){
            if(item.id==id[1]){
              item.progress = success?100:0
              item.state = success?"已上传":"上传失败",
              success&&(item.fileId = data.data.fileid)
              if(success){
                util.removeLocalCache(item.uri)
              }
              break
            }
          }
        }

        if(succ+fail == max)this.release()
      }
      let reject = (err) => {
        ++fail
        var id = (err.id||"").split("-");
        if(id.length == 2){
          for(var i=0,item;item=this[id[0]][i];i++){
            if(item.id==id[1]){
              item.progress = 0
              item.state = "上传失败"
              break
            }
          }
        }

        if(succ+fail == max)this.release()
      }
      this.videos.forEach((item) => {
        if(item.progress == 0){
          ++max
          item.state = "上传中"
          var params = {
            onprogress: this.progress.bind(this),
            id: "videos-"+item.id
          }
          if(window.cordova){
            params.uri = item.uri
            params.type = 2
          }else{
            params.file = item.file
            params.params = {
              type: 2,
              time: util.format(new Date(), 'yyyyMMddhhmmss')
            }
          }
          api[window.cordova?"upload":"uploadFormData"](params).then(resolve, reject)
        }
      })
      this.pics.forEach((item) => {
        if(item.progress == 0){
          ++max
          item.state = "上传中"
          var params = {
            onprogress: this.progress.bind(this),
            id: "pics-"+item.id
          }
          if(window.cordova){
            params.uri = item.uri
            params.type = 1
          }else{
            params.file = item.file
            params.params = {
              type: 1,
              time: util.format(new Date(), 'yyyyMMddhhmmss')
            }
          }
          api[window.cordova?"upload":"uploadFormData"](params).then(resolve, reject)
        }
      })
      this.isRelease = true
    },
    getMedia(index){
      if(this.isRelease)return
      const key = index==2?"pics":"videos"
      if(window.cordova){
        util.getMedia({
          quality: 80,
          sourceType: 0,
          mediaType: index==2?0:1
        })
        .then(util.getFileInfo)
        .then((file) => {
            let invalid = (message) => {
              util.removeLocalCache(file.uri)
              return Promise.reject({message})
            }

            if(this[key].length == 10){
              return invalid((index==2?"图片":"视频")+"最多上传10个")
            }
            for(var i=0,item;item=this[key][i];i++){
              if(file.name == item.name && file.size == item.size && file.lastModifiedDate == item.lastModifiedDate){
                return invalid("文件已存在")
              }
            }
            if(!/(jpg|png|gif|mp4|wmv|mov)/i.test(file.ext)){
              return invalid("不支持的上传类型")
            }
            if(1024* 1024 * 100 < file.size && index == 1){
              return invalid("视频限制100M")
            }
            if(1024* 1024 * 20 < file.size && index == 2){
              return invalid("图片限制20M")
            }
            file.progress = 0
            file.state = "待发布"
            file.id = util.hs(file.lastModifiedDate+file.size+file.name)
            this[key].push(file)
        })
        .catch((err) => {
          if(err.message && err.message != "no image selected" && err.message != "Selection cancelled"){
            alert(err.message)
          }else{
            alert("未知错误")
          }
        })
      }else{
        util.getWebMedia({
          accept: index==2?"image/png,image/gif,image/jpeg":"video/quicktime,audio/mp4,video/x-ms-wmv,audio/webm",
          callback: (ev) => {
            var file = ev.target.files[0], d = {};
            if(!file)return;
            ["name", "size", "lastModifiedDate"].forEach((k) => {
              d[k] = file[k]
            })
            d.progress = 0
            d.state = "待发布"
            d.id = util.hs(file.lastModified+file.size+file.name)
            d.file = file
            for(var i=0,len=this[key].length;i<len;i++){
              if(this[key][i].id == d.id){
                alert("文件已存在！")
                return
              }
            }
            this[key].push(d)
          }
        })
      }
    },
    removeMedia(index, i){
      if(this.isRelease)return
      let file = this[index==2?"pics":"videos"][i]
      if(file){
        util.removeLocalCache(file.uri)
        this[index==2?"pics":"videos"].splice(i, 1)
      }
    },
    blurInput(){
      if(document.activeElement.tagName.toLowerCase() == "input"){
        document.activeElement.blur()
      }
    },
    formatDate(time){
      return util.format(new Date(time), "yyyy/MM/dd hh:mm:ss")
    },
    formatSize(size){
      return util.sizeFormat(size)
    }
  },
  components: {}
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.art-wrap
  padding $card-padding
  .up-btn
    width 80px
    height 80px
    padding 10px
    margin-top 15px
    background-color #fff
    box-shadow 0 1px 6px rgba(0,0,0,.03)
    i
      display block
      font-size 25px
      color #aaa
      background-color #f1f1f1
      width 100%
      height 100%
      text-align center
      line-height 60px
  .upload-card
    background-color #fff
    border-radius 4px
    padding 10px
    display -webkit-flex
    display flex
    margin-top 15px
    box-shadow 0 1px 6px rgba(0,0,0,.03)
    .up-view
      width 100px
      height 100px
      border-radius 4px
      display -webkit-flex
      display flex
      justify-content center
      align-items center
      background-size cover
      background-position center
      background-color #f1f1f1
      display none
      i
        width 30px
        height 30px
        line-height 30px
        font-size 20px
        text-align center
        border-radius 50%
        color #fff
        border 1px solid #fff
    .up-info
      flex 1
      time
        font-size 1.2rem
        line-height 1.8em
      .up-ctrl
        font-size 1.8rem
        text-align right
      .up-prog-info
        padding 10px 0
        border-top 1px solid #eee
        border-bottom 1px solid #eee
        display -webkit-flex
        display flex
        align-items center
        .up-progress
          flex 1
          height 10px
          border-radius 10px
          margin 0 7px
          background-color #eee
          strong
            position relative
            display block
            height 100%
            width 0
            -webkit-transition width 200ms
            transition width 200ms
            border-radius 10px
            background -webkit-linear-gradient(90deg, #ff7e4a, #d31b13)
            background: linear-gradient(90deg, #ff7e4a, #d31b13)
          strong:after
            content ""
            width 14px
            height 14px
            position absolute
            right -7px
            top -2px
            border-radius 10px
            background-color #fff
            border 2px solid #d31b13
        .up-progress-text
          width 38px
          color #999
          margin-left 2px
          font-size 1.2rem
          text-align right
        .up-progress-status
          width 52px
          color $orange
          text-align center
          font-size 1.2rem
      .up-liul
        color $orange
        font-size 1.2rem
        line-height 1.8em
  h2
    margin-bottom 10px
    font-size 1.4rem
    color $red
    font-weight normal
    i
      width 16px
      height 16px
      color #fff
      background-color $red
      border-radius 50%
      display inline-block
      vertical-align middle
      margin-right 8px
      text-align center
      line-height 16px
      font-size .8em
  .art-tip
    padding-left 24px
    color #aaa
  input, textarea
    border 0 none
    background-color #fff
    width 100%
    padding 3px 5px
    font-size 1.6rem
    resize none
    line-height 1.5em
    border 1px solid #f1f1f1
    border-radius 4px
    box-shadow 0 1px 6px rgba(0,0,0,.03)
  input:focus, textarea:focus
    border-color #ddd
  input
    height 35px
  textarea
    height 120px
</style>
