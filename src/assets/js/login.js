/**
 * 公用的登录js
 * 依赖 jquery
 * PC 依赖 ECar.dialog
 * 页面 可通过 定义 g_config.domain 来设置环境。如果不定义会根据 页面hosts 来判断 环境
 *
 */

var LoginJS={

    /**
     * 环境域名后缀
     * .sit.com,.pre.com,.chexiang.com
     */
    domain:".chexiang.com",

    /**
     * 默认 42 表示商城
     */
    resource:"42",

    /**
     * 接口URL列表
     */
    URL:{
        /**
         * 获取登陆信息接口
         * @returns {string}
         */
        getUserInfoUrl:function(){
            return "//www"+LoginJS.domain+"/ms/user/userinfo.json";
        },

        /**
         * 获取登陆跳转URL
         * @returns {string}
         */
        getLoginUrl:function(backUrl,loginParam,loginUrl){

            var addedParam="";
            if(loginParam){
                for(var p in loginParam){
                    addedParam+="&"+p+"="+loginParam[p];
                }
            }
			
			var url="//m"+LoginJS.domain+"/account/quickLogin.htm";
			
			//是微信 走微信的登录URL
			if(LoginJS.isWechat()){
				url="//m"+LoginJS.domain+"/account/quickLogin.htm";
			}
			
			//有特定的 登录 URL指定
			if(loginUrl){
				url=loginUrl;
			}
			

			
			return url+"?resource="+LoginJS.resource+addedParam+"&backUrl="+encodeURIComponent(backUrl);
        }
    },

    /**
     * 判断是否是微信
     * @returns {boolean}
     */
    isWechat: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 判断是否手机
     * @returns {boolean} true 是 false 否
     */

    isMobile:function(){
        var isMobile=false;

        var sUserAgent = navigator.userAgent,
            mobileAgents = ['Windows CE', 'iPod', 'Symbian', 'iPhone', 'BlackBerry', 'Android', 'Windows Phone','iPad'];

        for (var i = 0, len = mobileAgents.length; i < len; i++) {
            if (sUserAgent.indexOf(mobileAgents[i]) !== -1) {
                isMobile=true;
                break;
            }
        }
        return isMobile;
    },

    /**
     * 检查是否登陆，未登录跳转到登陆页
     *
     * @param loginFn 1: Mobile中已登录执行后续的function 2: PC 中登录成功之后执行的function
     * @param backUrl 未登录状态下 进行登陆成功之后 跳转的URL 为空 表示刷新当前页面
     * @param beforeLoginFn 未登录状态下 跳往登录页之前 要做的操作
     * @param loginParam 可为空，默认login页面 只会传 resource 和backUrl 参数。
     *					 如需别的特殊参数，请通过 loginParam 对象传递 定义对象 var loginParam={} login.r=1 ....
	 * @param loginUrl 可为空 有些页面中需要指定特定的登录URL 如浦发 农行
     */
    checkLogin: function (loginFn,backUrl,beforeLoginFn,loginParam,loginUrl) {
        if(!backUrl || backUrl==""){
            //无回调地址 回调地址为当前页面；
            backUrl=window.location.href;
        }

        $.ajax({
            url: LoginJS.URL.getUserInfoUrl(),
            dataType: "jsonp",
            cache: false,
            jsonp: 'callback',
            success: function(data) {
                if(data && data.isSuccess){
                    var userData=data.data;

                    if(userData.isLogin){
                        //已登录 执行后续function
                        loginFn(userData);
                    }else{
                        if(typeof beforeLoginFn =="function"){
                            beforeLoginFn();
                        }

                        //未登录
                        if(LoginJS.isMobile()){
                            // 手机页面
                            if(LoginJS.isApp()){
                                LoginJS.loginApp(backUrl);
                            }else {
                                window.location.href=LoginJS.URL.getLoginUrl(backUrl,loginParam,loginUrl);
                            }
                        }else{
                            // PC 页面
                            LoginJS.goPcLogin(loginFn);
                        }

                    }
                }
            }
        });
    },


    /**
     * 调用PC的登录
     *
     */
    goPcLogin:function(backFn){
		//登陆成功之后回调函数
        window.backCallFun =backFn;
        var checktype="bind";
        var dialogTitle = checktype == 'bind' ? '请填写手机号' : checktype == 'login' ? '快速注册' : checktype == 'register' ? '快速注册' : '';
        var dialogHeight = checktype !== 'bind' ? 475 : 215;
        var dialogWidth = 480;
        document.domain = LoginJS.domain.substring(LoginJS.domain.indexOf('.') + 1);
        var getUrl = "//account" +LoginJS.domain+ "/simple/checkUser.htm?simple_checktype=" + checktype + "&d=" + new Date().getMilliseconds() + "&callback=?";

        $.ajax({
            type:'post',
            url: getUrl,
            dataType: "jsonp",
            jsonp: "callback",
            success:function(data){
                if(data)
                {
                    if(data["simple_status"] == 10){
                        var obj = {"userid" : data["simple_userid"]};
                        backFn(obj);
                    } else if(data["simple_status"] == 100 || data["simple_status"] == -2) {
                        //验证类型是绑定手机，而用户是未登录状态时弹出登录页面，否则弹出绑定手机页面
                        if(data["simple_status"] == -2)
                        {
                            checktype = "login_bind";
                            dialogTitle = "快速注册";
                            dialogHeight = 475;
                        }
                        ECar.dialog.open({
                            title: dialogTitle,
                            width: dialogWidth,
                            height:dialogHeight,
                            content: '<iframe  id="inneriframe" name="inneriframe" class="dialog-iframe" frameborder="no" border="0" scrolling="no" src="//account' +LoginJS.domain +'/simple/toSimple.htm?simple_pagetype=' + checktype + '"></iframe>'
                        });
                    } else if(data["simple_status"] == -1) {
                        alert("服务器繁忙，请稍后再试");
                    } else if(data["simple_status"] == -3) {
                        alert("请确认验证类型");
                    }
                } else {
                    alert("服务器繁忙，请稍后再试");
                }
            },
            error:function(){
                alert("error");
            }
        });
    },

    /**
     * 调用app 原生登陆
     * @param url 登录成功之后条状URL 为空表示刷新当前页面
     */
    loginApp:function(url){

        if(!(url && url!=null && url!="")){
            url=window.location.href;
        }

        //getQueryString 获取url的search对应的key的值方法；
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

        /**
         * 用获取到的信息 拼接URL 然后跳转到对应的URL
         * @param data
         */
        function reloadUrl(data){

            if(data.text.token){
                LoginJS.writeLoginCookie(data.text.token);
                window.location.href = url;
            }else if(data.text.UID){ //拿到用户UID
                var lct = url;
                if(lct.indexOf("uid=")!=-1){
                    var uidValue = getQueryString("uid");
                    lct = lct.replace("uid=" + uidValue, "uid=" + data.text.UID);
                }else{//没有UID
                    //截取url中'.htm'的位置，再去取'？'，
                    var htmIndex = lct.indexOf('.htm');
                    var index = lct.charAt(htmIndex + 4);
                    var connector = '?'
                    if(index && index==='?'){
                        // 有'?'，拼接url
                        connector = '&';
                    }
                    lct = lct + connector + 'uid='+data.text.UID
                }
                window.location.href = lct;
            }else{
                window.location.href = url;
            }

        }
        /*
         车享家APP 获取登录用户信息的方法
         */
        lb.getUserInfo(function (data) {
            //判断是否登录
            //alert("getUserInfo 回调事件1");
            if(data.errorCode==0){//已登录
                //alert("getUserInfo 回调事件1 errorCode == 0");
                reloadUrl(data);
            }else{//mall-mb
                lb.redirect('login',function(){
                    //alert("login 回调事件1");
                    lb.getUserInfo(function (data) {
                        //alert("login 回调事件1，进入 getUserInfo事件");
                        if(data.errorCode==0){
                            reloadUrl(data);
                        }else{
                            return;
                        }

                    });
                });
            }
        });
    },
    /**
     * 写登陆token
     * @param token  登陆token
     * @param domain  .chexiang.com 域名
     */
    writeLoginCookie:function (token){
        var expires = new Date();
        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);//1 天
        document.cookie = "sc_s=" + token + ";expires=" + expires.toGMTString() + ";path=/;domain=" + LoginJS.domain;
    },
    //判断是否是车享家app进来
    isApp:function(){
        var _this = this;
        var ua = navigator.userAgent,
            str = "MongoToC";
        if(ua.indexOf(str) >-1 ){
            return true;
        }else{
            return false;
        }
    },
    //请求lb.js
    requireLB:function(cb){
        var _this = this;
        var oHead = document.getElementsByTagName("head")[0];
        var oScript = document.createElement("script");
        oScript.setAttribute("type","text/javascript");
        oScript.setAttribute("src","//s1.chexiangpre.com/jssdk/1.0.0/lb.min.js");
        oHead.appendChild(oScript);
        oScript.onload = oScript.onreadystatechange = function(){
            if(!this.readyState || this.readyState == 'loaded' || this.readyState == "complete"){
                //lb.js下载完成
                if(typeof(cb)=== "function"){
                    cb();
                }
            }
        }
    },

};

if (window.location.hostname.indexOf(".sit.com") != -1) {
    LoginJS.domain=".sit.com";
} else if (window.location.hostname.indexOf(".pre.com") != -1) {
    LoginJS.domain=".pre.com";
}else if (window.location.hostname.indexOf(".sit.chexiang.com") != -1) {
    LoginJS.domain=".sit.chexiang.com";
}else if (window.location.hostname.indexOf(".pre.chexiang.com") != -1) {
    LoginJS.domain=".pre.chexiang.com";
}

if(typeof g_config != "undefined" && g_config.domain){
    if(g_config.domain){
        //赋值 sit pre chexiang
        LoginJS.domain=window.g_config.domain;
    }
    if(g_config.resourceLogin){
        LoginJS.resourceLogin=window.g_config.resourceLogin;
    }

}

if(LoginJS.isApp() && typeof window.lb =="undefined"){
    //加载 车享家APP 的JS lib 库
    LoginJS.requireLB(function(){
        //do nothing 只是为了下载 lb.js
    })
}
