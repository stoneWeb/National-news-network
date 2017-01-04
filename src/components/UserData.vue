<template lang="html">
<div style="height:100%; background-color:#f9f9f9">
  <div class="status-bg"></div>
  <div class="user-head user-data">
    <div class="main-h">
      <a class="user-back head-btn" @click="back()"><i class="ion-ios-arrow-left"></i></a>
      <h1>{{data.nickname.text}}</h1>
    </div>
    <div class="user-counter">
      <span v-if="avatar.value" class="user-face" :style="{'background-image':'url('+avatar.value+')'}"></span>
      <span v-if="!avatar.value" class="user-face" style="background-color:rgba(255,255,255,.6)"></span>
    </div>
    <p class="user-ed"><a href="javascript:;" @click="editAvatar()"><i class="ion-edit"></i>编辑头像</a><a v-link="{'path': '/change_password'}"><i class="ion-android-unlock"></i>修改密码</a></p>
  </div>
  <div class="scroll-view" style="top:210px; padding-bottom: 20px">
    <ul class="user-data-list">
      <li v-for="(key, item) in data" @click="openPopup(key)"><span>{{item.label}}</span><strong>{{item.text}}</strong></li>
    </ul>
  </div>
  <div class="set-user" transition="setuser" v-show="show">
    <div class="set-user-box" transition="setuserbox" v-show="show">
      <h3>{{editLabel}}</h3>
      <div class="set-user-wrap">
        <div class="inputview" v-if="editKey != 'sex' && editKey != 'region' && editKey != 'type'">
          <input type="text" class="edit-input" v-model="editData" @keyup.13="set_ok()">
        </div>
        <div class="select-view-box" v-if="editKey == 'sex'">
          <label class="select-view">男<input type="radio" v-model="editData" value="1" name="sex"><b></b></label>
          <label class="select-view">女<input type="radio" v-model="editData" value="2" name="sex"><b></b></label>
        </div>
        <div class="select-view-box" v-if="editKey == 'type'">
          <label class="select-view">电视台<input type="radio" v-model="editData" value="0" name="type"><b></b></label>
          <label class="select-view">非电视台<input type="radio" v-model="editData" value="1" name="type"><b></b></label>
          <label class="select-view">中央台驻地方记者站<input type="radio" v-model="editData" value="2" name="type"><b></b></label>
        </div>
        <div class="city-wrap" :style="{'max-height': cityHeight}" v-if="editKey == 'region'">
          <ul>
            <li v-for="(key, city) in citys" @click="clickCity(city.id, city.name)" :class="{'active': city.id == currCityId}">{{city.name}}</li>
          </ul>
        </div>
      </div>
      <div class="set-user-btn">
        <a href="javascript:;" @click="set_ok()"><i v-show="editLoading" class="ion-load-a loading"></i><span v-show="!editLoading">确定</span></a>
        <a href="javascript:;" @click="set_cancel()">取消</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { api } from '../service/request'
import { util, event } from '../service/'
import { setCfg } from "../service/cfg"
export default {
  data() {
    return {
      citys: {},
      currCityId: "",
      show: false,
      avatar:{label:"", value:null},
      data: {
        "nickname":{label:"昵称", value:null, text:"", reg: /^([\u4e00-\u9fa5]|\w){1,20}$/},
        "sex":{label:"性别", value:null, text:"", reg: /^[12]$/},
        "mobile":{label:"手机号", value:null, text:"", reg: /^1\d{10}$/},
        "email":{label:"电子邮件", value:null, text:"", reg: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/},
        "region":{label:"所属地区", value:null, text:""},
        "company":{label:"单位名称", value:null, text:"", reg: /^([\u4e00-\u9fa5]|\w|\s|[\(\)\.]){1,30}$/},
        "position":{label:"职务", value:null, text:"", reg: /^([\u4e00-\u9fa5]|\w){1,30}$/},
        "department":{label:"所在部门", value:null, text:"", reg: /^([\u4e00-\u9fa5]|\w){1,30}$/},
        "type":{label:"单位性质", value:null, text:"", reg: /^[012]$/}
      },
      uid: -1,
      editLabel: "",
      editData: "",
      editKey: "",
      cityHeight: 0,
      editLoading: false
    };
  },
  computed: {},
  ready() {
    this.cityHeight = window.innerHeight - 250 + "px"
    this.area = {}
    this.city = {}
    this.province = null
    this.editCity = null
    this.uploadIng = false
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
      this.loading = false
      this.uid = -1
      this.avatar.value = null;
      ["nickname","sex","mobile","email","region","company","position","department","type"].forEach((item) => {
        this.data[item].value = null
        this.data[item].text = ""
      })
    },
    checkData(){
      if(this.loading)return
      if(this.uid == -1){
        this.request()
      }
    },
    async request(){
      this.loading = true
      let data = await api.get("/User/info").catch(() => alert("请求失败"))
      this.loading = false
      if(data){
        if(data.status == 1){
          this.avatar.value = data.data.avatar
          this.uid = data.data.uid
          var region = [];
          for(var k in data.data){
            if(this.data[k]){
              if(k == "sex"){
                this.data[k].value = data.data[k]
                this.data[k].text = data.data[k]==2?"女":"男"
              }else if(k == "type"){
                this.data[k].value = data.data[k]
                this.data[k].text = {0:"电视台", 1:"非电视台", 2:"中央台驻地方记者站"}[data.data[k]] || ""
              }else{
                this.data[k].value = this.data[k].text = data.data[k]
              }
            }
            if(k == "province_cn"){
              region[0] = data.data[k]||""
            }
            if(k == "city_cn"){
              region[1] = data.data[k]||""
            }
            if(k == "area_cn"){
              region[2] = data.data[k]||""
            }
          }
          this.data.region.value = region
          this.data.region.text = region.join(",")
        }else{
          alert(data.info)
        }
      }
    },
    editAvatar(){
      if(this.uploadIng)return
      if(window.cordova){
        window.plugins.actionsheet.show({
          buttonLabels: ['从相册选择', '拍摄一张'],
          addCancelButtonWithLabel: '取消',
        }, (index) => {
          if(index <= 2){
            this.takeAndUploadAvatar(index-1)
          }
        });
      }else{
        util.getWebMedia({
          accept: "image/png,image/gif,image/jpeg",
          callback: (ev) => {
            ev.target.files[0] && this.handleWebFile(ev.target.files[0]);
          }
        })
      }
    },
    handleWebFile(file){
      if(!/\.(jpg|png|gif)$/i.test(file.name)){
        return alert("不支持的上传类型")
      }
      if(1024* 1024 * 10 < file.size){
        return alert("图片限制10M")
      }
      this.uploadIng = true
      api.uploadFormData({
        file,
        onprogress: this.avatarProgress,
        path: "/User/avatar",
        fileKey: "avatar"
      }).then((r) => {
        let data = r.response
        if(data.status == 1){
          this.avatar.value = data.data.avatar
          setCfg("avatar", data.data.avatar)
          api.user.avatar = data.data.avatar
          event.trigger("updateUserData", {avatar: data.data.avatar})
        }else{
          return Promise.reject({message: "上传失败"})
        }
        this.uploadIng = false
      }).catch((err) => {
        this.uploadIng = false
        alert(err.message || "上传错误！")
      })
    },
    avatarProgress(progress){
      console.log(progress);
    },
    takeAndUploadAvatar(sourceType){
      let delTmpFile;
      util.getMedia({
        quality: 40,
        sourceType
      })
      .then(util.getFileInfo)
      .then((file) => {
          if(!/(jpg|png|gif)/.test(file.ext)){
            return Promise.reject({message: "不支持的上传类型"})
          }
          if(1024* 1024 * 10 < file.size){
            return Promise.reject({message: "图片限制10M"})
          }
          delTmpFile = () => {
            util.removeLocalCache(file.uri)
          }
          this.uploadIng = true
          return api.upload({
            type: 1,
            uri: file.uri,
            onprogress: this.avatarProgress,
            path: "/User/avatar",
            fileKey: "avatar"
          })
      })
      .then((r) => {
          delTmpFile && delTmpFile()
          var data = r.response;
          if(r.responseCode == 200 && data.status == 1){
            this.avatar.value = data.data.avatar
            setCfg("avatar", data.data.avatar)
            api.user.avatar = data.data.avatar
            event.trigger("updateUserData", {avatar: data.data.avatar})
          }else{
            return Promise.reject({message: "上传失败"})
          }
          this.uploadIng = false
      })
      .catch((err) => {
        this.uploadIng = false
        delTmpFile && delTmpFile()
        if(err.message && err.message != "no image selected"){
          alert(err.message || "上传错误！")
        }
      })
    },
    findIdByName(obj, name){
      for(var k in obj){
        if(obj[k].name == name){
          return obj[k].id
        }
      }
      return null
    },
    clickCity(id, name){
      if(this.editLoading){
        return
      }
      this.currCityId = id
      this.editCity[this.editCity.length-1] = [
        id, name
      ]
    },
    openPopup(k){
      if(this.uid == 0)return
      this.editKey = k
      this.editLabel = this.data[k].label
      this.editData = this.data[k].value
      this.show = true
      if(k != "sex" && k != "region" && k != "type"){
        setTimeout(() => {
          this.$el.querySelector(".edit-input").select()
        }, 200)
      }else if(k == "region"){
        this.editData = ""
        this.editCity = []
        if(!this.province){
          this.editLoading = true
          api.get("/Public/public_getRegion", {parent: 0, type: 1})
            .then((data) => {
              this.editLoading = false
              if(data.status == 1){
                this.province = data.data
                this.citys = data.data
                if(this.data[k].value[0]){
                  this.editCity = [[this.findIdByName(data.data, this.data[k].value[0]), this.data[k].value[0]]]
                  this.currCityId = this.editCity[0][0]
                }
              }else{
                alert(data.info)
              }
            }, () => {alert("请求地区数据失败！"); this.editLoading = false})
        }else{
          this.citys = this.province
          if(this.data[k].value[0]){
            this.editCity = [[this.findIdByName(this.citys, this.data[k].value[0]), this.data[k].value[0]]]
            this.currCityId = this.editCity[0][0]
          }
        }
      }
    },
    set_ok(){
      if(this.editLoading){
        return
      }
      this.editData = this.editData.trim()
      if(this.editData == this.data[this.editKey].value){
        this.show = false
        return
      }
      if(this.editKey != "region"){
        if(!this.data[this.editKey].reg.test(this.editData)){
          alert("输入不合法！")
          return
        }
        this.editLoading = true
        api.post("/User/profile", {userid: this.uid, [this.editKey]: this.editData})
          .then((data) => {
            this.editLoading = false
            if(data.status == 1){
              this.data[this.editKey].value = this.editData
              if(this.editKey == "sex"){
                this.data[this.editKey].text = this.editData=="2"?"女":"男"
              }else if(this.editKey == "type"){
                this.data[this.editKey].text = {0:"电视台", 1:"非电视台", 2:"中央台驻地方记者站"}[this.editData] || ""
              }else{
                this.data[this.editKey].text = this.editData
              }
              if(this.editKey == "nickname"){
                setCfg("nickname", this.editData)
                api.user.nickname = this.editData
                event.trigger("updateUserData", {nickname: this.editData})
              }
              this.show = false
            }else{
              alert(data.info)
            }
          }, () => {alert("更新失败！"); this.editLoading = false})
      }else{
        let len = this.editCity.length - 1
        if(len != 2){
          let [id, name] = this.editCity[len]
          let key = len==0?"city":"area"
          if(this[key][id]){
            if(this[key][id] != []){
              if(this.data[this.editKey].value[len] == this.editCity[len][1]){
                this.citys = this[key][id]
                this.editCity[len+1] = [this.findIdByName(this.citys, this.data[this.editKey].value[len+1]), this.data[this.editKey].value[len+1]]
                this.currCityId = this.editCity[len+1][0]
              }else{
                this.editCity[len+1] = []
                this.currCityId = 0
              }
            }else{
              this.updateCity()
            }
          }else{
            this.editLoading = true
            api.get("/Public/public_getRegion", {parent: id, type: len+2})
              .then((data) => {
                if(data.status == 1){
                  if(!Array.isArray(data.data)){
                    this.editLoading = false
                    this[key][id] = data.data
                    this.citys = data.data
                    if(this.data[this.editKey].value[len] == this.editCity[len][1]){
                      this.editCity[len+1] = [this.findIdByName(this.citys, this.data[this.editKey].value[len+1]), this.data[this.editKey].value[len+1]]
                      this.currCityId = this.editCity[len+1][0]
                    }else{
                      this.editCity[len+1] = []
                      this.currCityId = 0
                    }
                  }else{
                    this[key][id] = []
                    this.updateCity()
                  }
                }else{
                  alert(data.info)
                }
              }, () => {alert("请求失败"); this.editLoading = false})
          }
        }else{
          this.editLoading = true
          this.updateCity()
        }
      }

    },
    updateCity(){
      var origin = this.data["region"].value, _ref = [], _id = [], check
      for(var i=0;i<3;i++){
        _ref.push(this.editCity[i]&&this.editCity[i][1]||"")
        _id.push(this.editCity[i]&&this.editCity[i][0]||"")
        if(_ref[i] != origin[i]){
          check = true
        }
      }
      if(!check){
        this.editLoading = false
        this.show = false
        this.editCity = null
      }else{
        let [province, city, district] = _id
        api.post("/User/profile", {province, city, district})
          .then((data) => {
            this.editLoading = false
            if(data.status == 1){
              this.show = false
              this.editCity = null
              this.data["region"].value = _ref
              this.data["region"].text = _ref.join(",").replace(/,+$/, "")
            }else{
              alert(data.info);
            }
          }, () => {
            alert("请求失败");
            this.editLoading = false
          })
      }
    },
    set_cancel(){
      if(this.editLoading){
        return
      }
      this.editCity = null
      this.show = false
    },
    back() {
      window.history.back()
    }
  },
  components: {}
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.user-data
  height 210px
  .user-back
    left 0
    right auto
  .user-ed
    text-align center
    padding-top 20px
    a
      margin 0 15px
      i
        margin-right 5px
  .user-counter
    margin-top 15px
    .user-face
      display block
      margin 0 auto
      width 80px
      height 80px
      border-radius 50%
      background-size cover
      background-repeat no-repeat
.user-data-list
  margin-top 15px
  li
    display -webkit-flex
    display flex
    justify-content space-between
    padding 14px 16px
    background-color #fff
    border-bottom 1px solid #eee
    span
      width 75px
    strong
      font-weight normal
      color #999
.user-data-list li:active
  background-color #f9f9f9
.user-data-list li:nth-child(5)
  margin-top 15px
.set-user
  position absolute
  display -webkit-flex
  display flex
  align-items center
  justify-content center
  left 0
  top 0
  bottom 0
  right 0
  z-index 101
  background-color rgba(0,0,0,.7)
  .inputview
    height: 37px
    position relative
    display: -webkit-flex;
    display: flex;
    align-items center
    input
      background none
      border 0
      flex 1
      font-size 16px
      height 100%
      color #666
      border-bottom 1px solid $red
  .inputview:after
    content ""
    position absolute
    right 0
    transform: rotate(45deg)
    right -6px
    bottom -6px
    border-color transparent transparent transparent $red
    border-width 6px
    border-style solid
  .set-user-box
    width 80%
    background-color #fff
    border-radius 4px
    overflow hidden
    .set-user-btn
      display -webkit-flex
      display flex
      margin-top 35px
      border-top 1px solid #eee
      a
        flex 1
        line-height 45px
        height 45px
        text-align center
        .loading
          font-size 2em
    .set-user-btn a:first-child
      background-color $red
      color #fff
    h3
      font-size 16px
      margin-top 20px
      text-align center
    .set-user-wrap
      padding 20px 18px 0 18px
  .select-view-box
    .select-view
      display -webkit-flex
      display flex
      margin-bottom 5px
      padding 10px 20px
      border-bottom 1px solid #eee
      justify-content space-between
    .select-view:last-child
      border 0 none
  .city-wrap
    overflow-x hidden
    overflow-y scroll
    .active
      background-color $red
      color #fff
    li
      display inline-block
      transition all 200ms
      border-radius 5px
      padding 3px 8px
      margin 3px
.setuser-transition
  opacity 1
  transition opacity 300ms
.setuser-enter,.setuser-leave
  opacity 0
.set-user .setuserbox-transition
  transform scale(1)
  transition transform 300ms
.set-user .setuserbox-enter,.set-user .setuserbox-leave
  transform scale(.4)
</style>
