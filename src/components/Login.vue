<template lang="html">
  <div style="height:100%">
    <div class="login-wrap">
      <h1><strong>中国电视协作网 <span>National News Network</span></strong></h1>
      <div class="login-ctrl">
        <label class="inputview">
          <i class="ion-ios-person-outline"></i>
          <input type="text" v-model="username" placeholder="用户名">
        </label>
        <label class="inputview">
          <i class="ion-ios-unlocked-outline"></i>
          <input type="password" v-model="password" @keyup.13="login" placeholder="密码">
        </label>
        <a href="javascript:;" @click="login" class="submit-btn"><i v-show="loading" class="ion-load-a loading"></i><span v-show="!loading">登录</span></a>
        <p class="login-forg"><a href="javascript:;" @click="forget()">忘记密码 <i class="ion-ios-help-outline"></i></a></p>
      </div>
      <p class="login-reg"><a v-link="{'path': '/signup'}">注册 &gt;</a></p>
    </div>
  </div>
</template>

<script>
import service from '../service/login'
import { api } from '../service/request'
export default {
  data() {
    return {
      loading: false,
      password: "",
      username: ""
    }
  },
  computed: {},
  ready() {
  },
  attached() {
    if(window.cordova){
      StatusBar.styleDefault();
    }
  },
  methods: {
    async forget(){
      if(this.forgetMsg){
        return alert(this.forgetMsg)
      }
      try {
        let data = await api.get("/Login/findPwd");
        if(data){
          if(data.status == 1){
            this.forgetMsg = data.info
          }
          data.info && alert(data.info)
        }
      } catch (e) {}
    },
    async login(){
      if(this.loading){
        return
      }
      let [username, password] = [this.username.trim(), this.password.trim()]
      if(!username||!password){
        return
      }
      if(document.activeElement.tagName.toLowerCase() == "input"){
        document.activeElement.blur()
      }
      this.loading = true;
      let ref = await service.createToken({username, password})
        .catch(() => alert("请求失败"))
      this.loading = false
      if(ref){
        if(ref.status == 1){
          this.password = ""
          this.$router.go("/main")
        }else{
          alert(ref.info || "请求失败")
        }
      }

    }
  },
  components: {}
};
</script>

<style lang="stylus">
@import '../stylus/setting.styl'

.login-wrap
  position relative
  background #fff
  display -webkit-flex
  display flex
  flex-direction column
  height 100%
  min-height 350px
  h1
    height: 40%;
    display: -webkit-flex;
    display: flex;
    line-height 1em
    font-size: 3.5rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    span
      color: #999;
      display: block;
      font-size: 1.4rem;

  .login-ctrl
    padding: 10px 3rem
    .inputview
      margin-bottom 25px
      height: 37px
      position relative
      display: -webkit-flex;
      display: flex;
      align-items center
      :after
        content ""
        position absolute
        right 0
        transform: rotate(45deg)
        right -6px
        bottom -6px
        border-color transparent transparent transparent $red
        border-width 6px
        border-style solid
      i
        height 28px
        width 28px
        margin-right 15px
        font-size 24px
        line-height 26px
        text-align center
        border-radius 50%
        color $red
        border 1px solid $red
      input
        background none
        border 0
        flex 1
        font-size 16px
        height 100%
        border-bottom 1px solid $red
  .login-forg
    color #444
    padding-top 10px
    text-align center
  .login-reg
    position absolute
    bottom 15px
    color $red
    width 100%
    text-align center
</style>
