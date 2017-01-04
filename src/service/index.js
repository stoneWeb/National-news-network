import Vue from 'vue'
//import request from './request'
import event from './event'
let util = Vue.util.extend({}, Vue.util)
util.copy = function(obj){
    return JSON.parse(JSON.stringify(obj))
}
util.format = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1,                 //月份
    'd+': date.getDate(),                    //日
    'h+': date.getHours(),                   //小时
    'm+': date.getMinutes(),                 //分
    's+': date.getSeconds(),                 //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}
util.sizeFormat = function(s, k){
  // byte to kb or mb
	return s> 1024 * 1024&&!k ?
		(Math.round(s * 100 / (1024 * 1024)) / 100).toString() + 'MB' :
		(Math.round(s * 100 / 1024) / 100).toString() + 'KB';
}
const getPos = (dom) => {
  // get relative page position
  let y = 0
  while (dom) {
    y += dom.offsetTop
    dom = dom.offsetParent
  }
  return y
}

util.scrollTop = (...args) => {
  let dom = document.querySelector("#"+args[0])
  if(dom){
    let arg = [args[1], getPos(dom)].concat(Array.from(args).slice(2))
    util.scrollTopAnimate(...arg)
  }
}
util.hs = (str) => {
  // get file name
	var hash = 1315423911, i, ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }
    return  (hash & 0x7FFFFFFF);
}

util.scrollTopAnimate = (function(){
  var scrolling;
  var fn = function (dom, t, speed, cb){
    if(scrolling){
        scrolling = false;
        fn.apply(null, arguments);
        return;
    }
    scrolling = true;
    if(t == "bottom"){
      t = dom.children[0].scrollHeight - dom.offsetHeight;
    }
    t = Math.max(t, 0);
    speed = speed || 15;
    var scrollTop = dom.scrollTop;
    if(scrollTop==t){
      cb && cb()
      return
    }
    var start = 0;
    var easeIn = function(t, b, c, d) {
          return c * (t /= d) * t + b;
      }
    var _run = function() {
      start++;
      var top = easeIn(start, scrollTop, t - scrollTop, speed);
      dom.scrollTop = top;
      if (start < speed && scrolling){
        window.requestAnimationFrame(_run)
      }else{
        cb && cb()
      };
    };
    _run();
  }
  return fn
})();
util.getWebMedia = (() => {
  // get local file from web form
  var file = document.createElement("input")
  file.type = 'file'
  file.style.display = "none"
  document.body.appendChild(file)
  var callback = function(){}
  file.addEventListener("change", (...args) => {
    callback(...args)
  })
  return (opt) => {
    if(opt.accept){
      file.accept = opt.accept
    }
    callback = opt.callback
    file.click()
  }
})()
util.getMedia = (opt) => {
  // get local file from native ability
  var defaults = {
      quality: 40,
      mediaType: 0,
      correctOrientation: true,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: 1
      //saveToPhotoAlbum: true
  }
  return new Promise((resolve, reject) => {
      opt = Object.assign(defaults, opt)
      navigator.camera.getPicture((uri) => {
        if(device.platform === "Android" && !/^file/.test(uri)){
          // Android is shit
          uri = "file://"+uri
        }
        resolve(uri)
      }, reject, opt);
  })
}
util.getFileInfo = (fileUri) => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(fileUri, (fileEntry) => {
      fileEntry.file((f) => {
        f.uri = fileUri
        // Android 图片扩展名后会加时间戳，需要过滤掉
        f.ext = fileUri.slice(fileUri.lastIndexOf('.')+1).replace(/\?.+$/, "")
        resolve(f)
      }, reject);
    }, reject);
  })
}
util.removeLocalCache = (uri) => {
  return new Promise((resolve, reject) => {
    if(!window.cordova){
      return resolve()
    }
    window.resolveLocalFileSystemURL(uri, ( fileEntry ) => {
      resolve()
      fileEntry.remove();
    }, reject);
  })
}
export { util, event }
