<template lang="html">
  <div style="height:100%">
    <header class="header">
      <span class="head-left"><a href="javascript:;" v-link="{'path': '/login'}"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">注 册</h1>
      <span class="head-right"></span>
    </header>
    <div class="page-content hastop" :style="{'padding-bottom': paddingBottom}">
      <label class="input-view">
        <i class="ion-ios-person-outline"></i>
        <input type="text" v-model="username" placeholder="用户名">
      </label>
      <label class="input-view">
        <i class="ion-ios-unlocked-outline"></i>
        <input type="password" v-model="password" placeholder="密码">
      </label>
      <label class="input-view">
        <i class="ion-ios-unlocked-outline"></i>
        <input type="password" v-model="cpassword" placeholder="确认密码">
      </label>
      <label class="input-view">
        <i class="ion-ios-person-outline"></i>
        <input type="text" v-model="name" placeholder="姓名">
      </label>
      <p class="input-tip"><i class="ion-ios-information"></i>请填写真实姓名</p>
      <label class="input-view">
        <i class="ion-iphone"></i>
        <input type="text" v-model="mobile" placeholder="手机号">
      </label>
      <div class="input-view">
        <span>性别</span>
        <div class="input-view-main">
          <label class="select-view"><input type="radio" v-model="sex" value="1" name="sex"><b></b>男</label>
          <label class="select-view"><input type="radio" v-model="sex" value="2" name="sex"><b></b>女</label>
        </div>
      </div>
      <div class="input-view nomargin">
        <span>所属地区</span>
        <div class="input-view-main" @click="openPopup()">
          {{region.text || '请选择省／城市'}}
          <b class="ion-ios-arrow-right"></b>
        </div>
      </div>
      <div class="input-view nomargin">
        <span>单位性质</span>
        <div class="input-view-main">
          <label class="select-view"><input v-model="type" value="0" type="radio" name="type"><b></b>电视台</label>
          <label class="select-view"><input v-model="type" value="1" type="radio" name="type"><b></b>非电视台</label><br/><br/>
          <label class="select-view"><input v-model="type" value="2" type="radio" name="type"><b></b>中央台驻地方台记者站</label>
        </div>
      </div>
      <div class="input-view nomargin column">
        <span>电视台（单位）名称（省份＋台简称)</span>
        <input type="text" v-model="company" placeholder="请填写电视台（单位）名称">
      </div>
      <div class="infotip">
        <p>此处请填写 省份 + 台简称</p>
        <p>规则：地市台 请填写 XXX台；县级台 请填写 XXX广电。请根据地区填写，不要出现 电视台 和 广播电视台 等全称</p>
        <p>例如：山东省淄博市电视台 应填写 山东淄博台；</p>
        <p>山西省乡宁县广播电视台 应填写 山西乡宁广电；</p>
      </div>
      <div class="input-view">
        <span>部门</span>
        <input type="text" v-model="department" placeholder="请填写所属部门">
      </div>
      <div class="input-view">
        <span>职务</span>
        <input type="text" v-model="position" placeholder="请填写您的职务">
      </div>
      <p class="input-tip"><i class="ion-ios-information"></i>以上信息请如实填写</p>
      <a @click="submit" class="submit-btn short"><i v-show="editLoading" class="ion-load-a loading"></i><span v-show="!editLoading">下一步</span></a>
    </div>
    <div class="city-popup" transition="citys" v-show="popup">
      <div class="city-box" transition="citybox" v-show="popup">
        <h4>选择省</h4>
        <ul class="city-scroll">
          <li v-for="(key, city) in citys" @click="clickCity(city.id, city.name)" :class="{'active': city.id == currCityId}">{{city.name}}</li>
        </ul>
        <div class="city-btn">
          <a href="javascript:;" class="city-btn1" @click="city_cancel()">取消</a>
          <a href="javascript:;" class="city-btn2" @click="city_ok()"><i v-show="editLoading" class="ion-load-a loading"></i><span v-show="!editLoading">确定</span></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../service/request'
import { event } from '../service/'
export default {
  data() {
    return {
      citys: [],
      currCityId: 0,
      popup: false,
      username: "",
      password: "",
      cpassword: "",
      name: "",
      mobile: "",
      sex: "1",
      type: "0",
      region: {value: [[],[],[]], text: ""},
      company: "",
      department: "",
      position: "",
      editLoading: false,
      paddingBottom: "0px"
    };
  },
  computed: {},
  ready() {
    if(window.cordova){
      StatusBar.styleLightContent();
    }
    this.area = {}
    this.city = {}
    this.province = null
    this.editCity = null
    this.offKeyboardEvent = () => {}
    if(window.cordova){
      if(device.platform === "iOS"){
        let _this = this
        let showKeyboard = (e) => {
          if(_this.$route.path == '/signup'){
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
  methods: {
    async submit(){
      if(this.editLoading)return
      const reg = {
        username: [/^\w{3,15}$/, "用户名输入不合法"],
        password: [/^.{6,25}$/, "密码输入不合法"],
        name: [/^([\u4e00-\u9fa5]|\w){1,20}$/, "姓名输入不合法"],
        sex: [/^[12]$/],
        mobile: [/^1\d{10}$/, "手机输入不合法"],
        company: [/^([\u4e00-\u9fa5]|\w|\s|[\(\)\.]){1,30}$/, "单位名称输入不合法"],
        position: [/^([\u4e00-\u9fa5]|\w|\s){1,30}$/, "职务输入不合法"],
        department: [/^([\u4e00-\u9fa5]|\w|\s){1,30}$/, "部门输入不合法"],
        type: [/^[012]$/]
      }
      const fields = ["username", "password", "cpassword", "name", "mobile", "sex", "type", "company", "department", "position"]
      for(var key in reg){
        if(!reg[key][0].test(this[key].trim())){
          alert(reg[key][1]);
          return
        }
      }
      if(this.password != this.cpassword){
        alert("密码输入不一致")
        return
      }
      if(!this.region.value[0][1]){
        alert("请选择地区！")
        return
      }
      this.editLoading = true
      let _data = {}
      fields.forEach((item) => {
        _data[item] = this[item]
      })
      _data["province"] = this.region.value[0][0]
      _data["city"] = this.region.value[1][0]||""
      _data["district"] = this.region.value[2][0]||""

      let data = await api.post("/Login/registerInfo", _data)
        .catch(() => alert("请求失败"))
      this.editLoading = false
      if(data){
        if(data.status == 1){
          // 成功
          fields.forEach((item) => {
            switch (item) {
              case "sex":
                this[item] = "1"
                break;
              case "type":
                this[item] = "0"
                break;
              default:
                this[item] = ""
            }
          })
          this.region = {value: [[],[],[]], text: ""}
          window.confirm("注册成功，请登录", (index) => {
            if(index == 1){
              this.$router.go("/login")
            }
          })
        }else{
          alert(data.info||"请求失败")
        }
      }

      //this.$router.go("/main")
    },
    findIdByName(obj, name){
      for(var k in obj){
        if(obj[k].name == name){
          return obj[k].id
        }
      }
      return null
    },
    async openPopup(){
      this.popup = true
      this.currCityId = this.region.value[0][0]
      this.editCity = [[]]
      if(!this.province){
        this.editLoading = true
        let data = await api.get("/Public/public_getRegion", {parent: 0, type: 1})
          .catch(() => alert("请求失败"))
        this.editLoading = false
        if(data){
          if(data.status == 1){
            this.province = data.data
            this.citys = data.data
            if(this.region.value[0][1]){
              this.editCity = [[this.findIdByName(this.citys, this.region.value[0][1]), this.region.value[0][1]]]
              this.currCityId = this.editCity[0][0]
            }
          }else{
            alert(data.info||"请求地区数据失败！")
          }
        }
      }else{
        this.citys = this.province
        if(this.region.value[0][1]){
          this.editCity = [[this.findIdByName(this.citys, this.region.value[0][1]), this.region.value[0][1]]]
          this.currCityId = this.editCity[0][0]
        }
      }
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
    city_cancel(){
      if(this.editLoading){
        return
      }
      this.editCity = null
      this.popup = false
    },
    async city_ok(){
      if(this.editLoading){
        return
      }
      let len = this.editCity.length - 1
      if(len != 2){
        let [id, name] = this.editCity[len]
        let key = len==0?"city":"area"

        if(this[key][id]){
          if(this[key][id] != []){
            this.citys = this[key][id]
            if(this.editCity[len][1] == this.region.value[len][1]){
              this.editCity[len+1] = [this.findIdByName(this.citys, this.region.value[len+1][1]), this.region.value[len+1][1]]
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
          let data = await api.get("/Public/public_getRegion", {parent: id, type: len+2})
            .catch(() => alert("请求失败"))
          this.editLoading = false
          if(data){
            if(data.status == 1){
              if(!Array.isArray(data.data)){
                this[key][id] = data.data
                this.citys = data.data
                if(this.editCity[len][1] == this.region.value[len][1]){
                  this.editCity[len+1] = [this.findIdByName(this.citys, this.region.value[len+1][1]), this.region.value[len+1][1]]
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
              alert(data.info||"请求失败")
            }
          }

        }
      }else{
        this.updateCity()
      }
    },
    updateCity(){
      this.editLoading = false
      this.popup = false
      let _ref = []
      for(var i=0;i<3;i++){
        this.region.value[i] = this.editCity[i] || []
        this.editCity[i] && this.editCity[i][1] && _ref.push(this.editCity[i][1])
      }
      this.region.text = _ref.join(",")
    }
  },
  components: {}
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'
.input-tip
  color #575757
  padding-left 15px
  line-height 2.5rem
  .ion-ios-information
    margin-right .5rem
    color $red
.input-view
  span
    width 75px
  .input-view-main
    flex 1
    color #757575
    position relative
    .ion-ios-arrow-right
      position absolute
      right 5px
      color $red
      font-size 1.8rem
      top -3px
.infotip
  padding 10px 15px 0 34px
  position relative
  font-size 12px
  color #5f5f5f
  line-height 2rem
  :after
    color $red
    content "*"
    position absolute
    left 20px
    font-size 25px
    top 14px
.city-popup
  background-color rgba(0,0,0,.7)
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  z-index 10
  .city-box
    background-color #fff
    padding 15px
    position absolute
    bottom 0
    width 100%
    .city-scroll
      max-height 228px
      overflow-x hidden
      overflow-y scroll
    h4
      line-height 2em
      color #999
    .active
      background-color $red
      color #fff
    li
      display inline-block
      transition all 200ms
      border-radius 5px
      padding 3px 8px
      margin 6px
    .city-btn
      display -webkit-flex
      display flex
      justify-content center
      padding 18px 0 10px 0
      a
        padding 0 50px
        height 45px
        width 150px
        text-align center
        line-height 45px
      .city-btn1
        border 1px solid #ccc
        border-right 0 none
        border-radius 5px 0 0 5px
      .city-btn2
        background-color $red
        color #fff
        border-radius 0 5px 5px 0
        .loading
          font-size 2.2em

.citys-transition
  opacity 1
  transition opacity 300ms
.citys-enter,.citys-leave
  opacity 0
.citybox-transition
  transform translateY(0)
  transition transform 300ms
.citybox-enter,.citybox-leave
  transform translateY(100%)
</style>
