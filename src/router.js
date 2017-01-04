/**
 * Created by chuck7 on 16/8/22.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/Login.vue'
import SignUp from 'components/SignUp.vue'
import Main from 'components/Main.vue'
import User from 'components/User.vue'
import Setting from 'components/Setting.vue'
import NewDetail from 'components/NewDetail.vue'
import UserData from 'components/UserData.vue'
import ChangePw from 'components/ChangePw.vue'
import Reports from 'components/Reports.vue'
import ReportDetail from 'components/ReportDetail.vue'
import AddReport from 'components/AddReport.vue'
import Information from 'components/Information.vue'
import { getCfg } from "./service/cfg"

Vue.use(VueRouter)
const router = new VueRouter()

router.map({
  /*'/index':{
    component: Indexheader,
    subRoutes: {
      "": {
        component: Main
      },
      "search": {
        component: Search
      }
    }
  },*/
  '/login':{
    component: Login,
    authPage: true
  },
  '/signup':{
    component: SignUp,
    authPage: true
  },
  '/main':{
    component: Main,
  },
  '/user':{
    component: User
  },
  '/setting':{
    component: Setting
  },
  '/news_detail/:id': {
    name: 'news_detail',
    component: NewDetail
  },
  '/user_data': {
    component: UserData
  },
  '/change_password': {
    component: ChangePw
  },
  '/me_reports': {
    component: Reports
  },
  '/report_detail/:id': {
    name: 'report_detail',
    component: ReportDetail
  },
  '/add_report': {
    component: AddReport
  },
  '/information': {
    component: Information
  }
})
router.redirect({
  '*': '/login'
})

Vue.transition('next', {
  beforeEnter: function (el) {
    router.app.changePage = true;
  },
  enter:function(){
  },
  afterEnter: function (el) {
    router.app.changePage = false;
  }
});
Vue.transition('prev', {
  beforeEnter: function (el) {
    router.app.changePage = true;
  },
  enter:function(){
  },
  afterEnter: function (el) {
    router.app.changePage = false;
  }
});

var routeList = []
var routeReg = /^(\/main|\/user)$/
var fn = ({to, from, next}) => {
    router.app.effect='next';//前进
    routeList.push(to.path);
    next()
    fn = ({from, to, next, redirect}) => {
        if(routeReg.test(from.path) && routeReg.test(to.path)){
            router.app.effect='';
            routeList.push(to.path);
            setTimeout(next, 15);
            return
        }else if(routeList.length > 1 && to.path==routeList[routeList.length-2]){
            router.app.effect='prev';//返回
            routeList.splice(routeList.length-1,1);
            setTimeout(next, 15);
            return;
        }

        router.app.effect='next';//前进
        routeList.push(to.path);
        setTimeout(next, 15);
    }
};
router.beforeEach((transition) => {
  if(true !== transition.to.authPage){
    if(!getCfg().token){
      transition.redirect("login")
    }else{
      fn(transition)
    }
  }else{
    if(!getCfg().token){
      fn(transition)
    }else{
      transition.redirect('main')
    }
  }
});
router.afterEach(function({from, to}){
  if(routeReg.test(from.path) && routeReg.test(to.path)){
    setTimeout(function(){
      router.app.effect='';
    }, 15);
  }else{
    router.app.effect='next';
  }
});
export { router }
