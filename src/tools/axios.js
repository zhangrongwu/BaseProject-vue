import Vue from 'vue'
import Axios from 'axios'
import ElementUI from 'element-ui';
import router from "../router";
Vue.prototype.$axios = Axios

Axios.defaults.baseURL = process.env.API_HOST
Axios.defaults.timeout = 20000;

let loading

Axios.interceptors.request.use(function (config) {
  // 显示loading
  console.log("request::"+config.url,JSON.stringify(config.data));
  loading = ElementUI.Loading.service({
    fullscreen: true,
    background: "rgb(0,0,0,0)"
  })
  return config
})

Axios.interceptors.response.use(function (config) {
  // 隐藏loading
  loading.close();
  if(config.config.responseType =="blob"){//判断是否是文件类型
    return config
  }
  console.log("response::"+config.config.url,JSON.stringify(config.data));
  if(!config.data.success){
    if(config.data.data=="TIMEOUT"){//session过期
      sessionStorage.clear();
      router.replace({ name: "login", query: {} });
    }else{
      ElementUI.Message(config.data.errMsg);
    }
  }
  return config
},function(error){
  // 隐藏loading
  loading.close();
  console.log("response::",error);
  console.log(error)
  return error
})
