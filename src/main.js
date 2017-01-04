import Vue from 'vue'
import App from './App'
import clearStyle from './filter'
import { router } from './router'
import { api } from './service/request'
import { event } from './service/'

import './stylus/base.styl';

Vue.filter("clear-style", clearStyle)

const appReady = () => {
  if(window.cordova){
    var cls = ["cordova"];
    if(device.platform === "Android"){
      cls.push("android")
    }else if(device.platform === "iOS"){
      cls.push("ios")
    }
    window.alert = (message, alertCallback = function(){}, title = "系统提示", buttonName = "确定") => {
      if("undefined" != typeof message){
        navigator.notification.alert(message.toString(), alertCallback, title, buttonName)
      }
    }
    window.confirm = (message, confirmCallback = function(){}, title = "系统提示", buttonLabels = ["确定", "取消"]) => {
      if("undefined" != typeof message){
        navigator.notification.confirm(message.toString(), confirmCallback, title, buttonLabels)
      }
    }
    document.documentElement.className = cls.join(" ");
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);
    // 📢 keyboard event
    window.addEventListener('native.keyboardshow', (e) => {
        event.trigger("keyboardshow", e)
    });
    window.addEventListener('native.keyboardhide', (e) => {
        event.trigger("keyboardhide", e)
    });
  }else{
    let origin = window.confirm
    window.confirm = (content, cb = function(){}) => {
      cb(origin.call(window, content)?1:2)
    }
  }
  let initApp = () => {
    router.start(App, '#app')
    if(window.cordova){
      setTimeout(() => {
        navigator.splashscreen.hide();
      }, 500)
    }
    initApp = () => {}
  }
  api.get("").then(initApp, initApp)
  setTimeout(() => initApp(), 8000)
}
if(!window.cordova){
  appReady();
  //document.querySelector('#appsplash').style.display = 'block';
}else{
  document.addEventListener('deviceready', appReady, !1);
}
