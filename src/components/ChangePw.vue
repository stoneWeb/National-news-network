<template lang="html">
  <div style="height:100%; background-color:#f9f9f9">
    <header class="header">
      <span class="head-left"><a href="javascript:;" @click="back()"><i class="ion-ios-arrow-left"></i></a></span>
      <h1 class="head-title">修改密码</h1>
      <span class="head-right"></span>
    </header>
    <div class="scroll-view hastop">
      <label class="input-view">
        <i class="ion-ios-unlocked-outline"></i>
        <input type="password" v-model="oldpassword" placeholder="原密码">
      </label>
      <label class="input-view">
        <i class="ion-ios-unlocked-outline"></i>
        <input type="password" v-model="password" placeholder="新密码">
      </label>
      <label class="input-view">
        <i class="ion-ios-unlocked-outline"></i>
        <input type="password" v-model="cpassword" placeholder="确认密码">
      </label>
      <a href="javascript:;" @click="submit" class="submit-btn short"><i v-show="loading" class="ion-load-a loading"></i><span v-show="!loading">修改密码</span></a>
    </div>
  </div>
</template>

<script>
import { api } from '../service/request'
export default {
  data() {
    return {
      loading: false,
      oldpassword: "",
      password: "",
      cpassword: ""
    };
  },
  computed: {},
  ready() {},
  attached() {},
  methods: {
    back() {
      window.history.back()
    },
    submit() {
      if(this.loading)return;
      const [oldpassword, password, cpassword] = [this.oldpassword.trim(), this.password.trim(), this.cpassword.trim()]
      if(oldpassword.length < 6 || password.length < 6){
        alert("密码格式错误")
        return
      }else if(password != cpassword){
        alert("两次密码不一致")
        return
      }
      this.loading = true;
      api.post("/User/editPwd", {oldpassword, password, cpassword})
        .then((data) => {
          if(data.status == 1){
            alert("修改成功");
            this.oldpassword = this.password = this.cpassword = ""
          }else{
            alert(data.info)
          }
          this.loading = false
        }, (err) => {
          this.loading = false
        })
    }
  },
  components: {}
};
</script>

<style lang="stylus">
</style>
