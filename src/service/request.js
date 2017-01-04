import { getCfg, setCfg, rmCfg } from "./cfg"
import { Base64 } from 'js-base64'
import { util } from './index'

const _api = "http://XXX";
let parseResponse = (response) => {
  return Promise.all([response.status, response.statusText, response.json()])
},
checkStatus = ([status,statusText,data]) => {
  if(status >= 200 && status < 300){
    if(data.data && data.data.token){
      api.token = setCfg("token", data.data.token).token
      data.data.token = null
      delete data.data.token
    }
    return data
  }else{
    if(401 === status){
      rmCfg("token")
      api.token = null
      return Promise.reject({ status })
    }
    let error = new Error(statusText)
    error.status = status
    error.error_message = data
    return Promise.reject(error)
  }
}

const _fetch = (fetch_promise, timeout = 15000) => {
    // 实现fetch timeout 比谁快
    return Promise.race([
         fetch_promise,
         new Promise((resolve, reject) => {
              setTimeout(() => reject({message: "timeout"}), timeout)
         })
    ])
}

const api = {
  user: {avatar: getCfg().avatar || "", nickname: getCfg().nickname},
  token: getCfg().token || "",
  get (url, param = {}, headers = {}, host = _api) {
    let reqHeaders = new Headers(headers)
    reqHeaders.append('Accept', 'application/json')

    if(api.token){
      reqHeaders.append('Authorization','Basic '+Base64.btoa(api.token+':'))
    }
    var query = []
    Object.keys(param).forEach(item => {
      query.push(`${item}=${encodeURIComponent(param[item])}`)
    })
    let params = query.length?'?'+query.join('&'):''
    url = host + url + params

    var init = {
      method: 'GET',
      headers: reqHeaders,
      credentials:"include",
      cache: 'default',
      mode:'cors'
    }
    return _fetch(fetch(url, init))
      .then(parseResponse)
      .then(checkStatus)
  },
  patch (url, param = {}, headers = {}, host = _api) {
    let reqHeaders = new Headers(headers)
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    if(api.token){
      reqHeaders.append('Authorization','Basic '+Base64.btoa(api.token+':'))
    }
    url = host + url

    var init = {
      method: 'PATCH',
      headers: reqHeaders,
      credentials:"include",
      mode:'cors',
      body: JSON.stringify(param)
    }

    return _fetch(fetch(url, init))
      .then(parseResponse)
      .then(checkStatus)
  },
  post (url, param = {}, headers = {}, host = _api) {
    let reqHeaders = new Headers(headers)
    reqHeaders.append('Content-Type', 'application/json');
    reqHeaders.append('Accept', 'application/json');
    if(api.token){
      reqHeaders.append('Authorization','Basic '+Base64.btoa(api.token+':'))
    }
    url = host + url

    var init = {
      method: 'POST',
      headers: reqHeaders,
      credentials:"include",
      mode:'cors',
      body: JSON.stringify(param)
    }
    return _fetch(fetch(url, init))
      .then(parseResponse)
      .then(checkStatus)
  },
  put (url, param = {}, headers = {}, host = _api) {
    let reqHeaders = new Headers(headers)
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    if(api.token){
      reqHeaders.append('Authorization','Basic '+Base64.btoa(api.token+':'))
    }
    url = host + url

    var init = {
      method: 'PUT',
      headers: reqHeaders,
      credentials:"include",
      mode:'cors',
      body: JSON.stringify(param)
    }

    return _fetch(fetch(url, init))
      .then(parseResponse)
      .then(checkStatus)
  },
  delete (url, param = {}, headers = {}, host = _api) {
    let reqHeaders = new Headers(headers)
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    if(api.token){
      reqHeaders.append('Authorization','Basic '+Base64.btoa(api.token+':'))
    }
    url = host + url

    var init = {
      method: 'DELETE',
      credentials:"include",
      headers: reqHeaders,
      mode:'cors'
    }

    return _fetch(fetch(url, init))
      .then(parseResponse)
      .then(checkStatus)
  },
  upload(opt){
    var mimeTypes = {
      "jpeg" 	: "image/jpeg",
    	"jpg" 	: "image/jpeg",
      "png" 	: "image/png",
      "gif" 	: "image/gif",
      "mov" 	: "video/quicktime",
      "mp4" 	: "audio/mp4",
      "wmv"   : "video/x-ms-wmv",
      "mp3" 	: "audio/mpeg",
      "ogg"   : "audio/ogg",
      "webm"  : "audio/webm"
    }
    return new Promise((resolve, reject) => {
      var options = new FileUploadOptions(),
          // 过滤 Android 后面带的那一坨
          ext = opt.uri.slice(opt.uri.lastIndexOf('.')+1).replace(/\?.+$/, "")||"";
      if(!mimeTypes[ext.toLowerCase()]){
        return reject({message: "不支持的上传类型", id: opt.id})
      }

      options.mimeType = mimeTypes[ext]
      options.fileKey = opt.fileKey||"filedata",
      options.fileName = opt.uri.substr(opt.uri.lastIndexOf('/')+1);

      options.params = {
        type: opt.type,
        time: util.format(new Date(), 'yyyyMMddhhmmss')
      }
      options.chunkedMode = false
      options.headers = {
        'Connection': 'close'
      }

      if(api.token){
        options.headers.Authorization = 'Basic '+Base64.btoa(api.token+':')
      }
      var ft = new FileTransfer();
      ft.onprogress = (progressEvt) => {
        if(opt.onprogress && progressEvt.lengthComputable){
          var args = [Math.round( ( progressEvt.loaded / progressEvt.total ) * 100)]
          if(opt.id){
            args.unshift(opt.id)
          }
          opt.onprogress(...args)
        }
      }
      ft.upload( opt.uri, encodeURI(_api+(opt.path||'/Public/upload')), (...args) => {
        if(opt.id){
          args[0].id = opt.id
        }
        // 与 web upload api 统一
        try{
          args[0].response = JSON.parse(args[0].response);
        }catch(e){
          args[0].response = {}
        }
        resolve(...args)
      } , (...args) => {
        if(opt.id){
          args[0].id = opt.id
        }
        reject(...args)
      }, options);
    })
  },
  uploadFormData(opt){
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest(), fd = new FormData();
      fd.append(opt.fileKey || "filedata", opt.file)
      for(let key in opt.params){
  			fd.append(key, opt.params[key])
  		}
      xhr.open("POST", _api+(opt.path||'/Public/upload'), true)
      if(api.token){
        xhr.setRequestHeader("Authorization", 'Basic '+Base64.btoa(api.token+':'))
      }
      xhr.upload.addEventListener("progress", function(progressEvt){
        if(opt.onprogress){
          let args = [Math.round( ( progressEvt.loaded / progressEvt.total ) * 100)]
          if(opt.id){
            args.unshift(opt.id)
          }
          opt.onprogress(...args)
        }
  		}, false)
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
  				if(this.status == 200){
            var data
  					try{
  						data = JSON.parse(this.responseText);
  					}catch(e){
              data = {}
  					}
            // 与 native upload api 统一
            resolve({id: opt.id, responseCode:this.status, response: data})
          }else{
            reject({status: this.status, id: opt.id})
          }
        }
      }
      xhr.send(fd)
    })
  }
}
export { api }
