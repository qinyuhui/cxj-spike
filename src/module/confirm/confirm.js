import Vue from 'vue'
import { Toast } from 'mint-ui';
import App from './app'
import vueResource from 'vue-resource';
Vue.use(vueResource);
Vue.http.options.emulateJSON = true;
Vue.config.devtools = true;

var url=location.href;
var cmsDomain='chexiang';
			if(url.indexOf('sit')!=-1){
				cmsDomain='chexiangsit';
			}else if(url.indexOf('chexiangpre')!=-1){
				cmsDomain='chexiangpre';
			}
var imageDomain='cximg';
			if(url.indexOf('sit')!=-1){
				imageDomain='chexiangsit';
			}else if(url.indexOf('chexiangpre')!=-1){
				imageDomain='chexiangpre';
			}					
//ajax全局配置

var loadNode = document.createElement("div");
loadNode.innerHTML = '<div id="loadImg" class="loadImg" style="display:none"><p><img src="//s1.'+imageDomain+'.com/msweb02/cx/cxj-spike/images/loading.gif"/></p></div>';
document.querySelector("body").appendChild(loadNode);
var active = 0;//活动ajax个数
  
Vue.http.interceptors.push((request, next) => {
	active++;
	document.getElementById('loadImg').style.display = 'block';
	
	next((response) => {
		console.log(response);
		active--;
		if(!active) {
			document.getElementById('loadImg').style.display = 'none';
		}
		if(response.statusText=="error"||response.statusText=="parsererror"){
			Toast("系统繁忙,请稍后再试");
			go404(error);
		}else if(response.statusText=="timeout"){
			Toast("连接超时!请稍后再试");
			go404(timeout);
		}else if(response.status==404){
			Toast("网络异常!请稍后再试");
			go404(404);
		}else if(response.status==500){
			Toast("服务器内部错误!请稍后再试");
			go404(500);
		}else if(response.status==200 || response.status==304){
			
		}else{
			Toast("服务器内部错误!请稍后再试");
			go404(404);
		}
		function go404(code){
				location.href='//h.jia.'+cmsDomain+'.com/errorMsg404.htm?code='+code;
		}
		

	});
});
import common from '../../assets/js/common';
new Vue({
	el: 'body',
	components: {
		App
	}
})