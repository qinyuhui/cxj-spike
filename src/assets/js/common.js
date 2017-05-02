(function($) {
    //获得RSA加密信息(status:状态,obj:签名value，msg：提示信息)
    $.getUserSignValue = function() {
            var signValue = {};
            signValue.status = $.dataResult.FAILD;
            signValue.msg = "";
            $.postAjaxSync("/t/getUserSignValue.htm", {},
                function(data) {
                    signValue.status = data.result;
                    signValue.msg = data.msg;
                    if (data.result == 1) {
                        signValue.obj = data.obj;
                    } else {
                        signValue.obj = "";
                    }
                });
            return signValue;
        }
        //$.StringUtils.isEmpty() 判断字符串是否为空
    $.StringUtils = {
        isEmpty: function(str) {
            return str === null || str === undefined ? true : /^[\s\xa0]*$/.test(str);
        },
        isNotEmpty: function(str) {
            return $.StringUtils.isEmpty(str) ? false : true;
        },
        between: function(s, left, right) {
            var startPos = s.indexOf(left);
            var endPos = s.indexOf(right);
            var start = startPos + left.length;
            return endPos > startPos ? s.slice(start, endPos) : "";
        }
    };
    $.contexts = function() {
        //获取应用的上下文根路径
        var pathname = window.location.pathname;
        var indexNext = pathname.indexOf("/", 0);
        return pathname.substr(0, indexNext);
    };
    //获取上文根
    $.context = $.contexts();
    $.dataResult = { "SUCCESS": 1, "FAILD": 0, "NOLOGIN": -99, "INVAILD": -98, "RSA_ERROR": -97 };
    $.timeout = 10000;
    $.loginUrl = $.context + "/user/toLogin.htm?targetUrl=" + encodeURI(window.location.href);

    /**
     * 跳转链接，不保留历史记录
     */
    $.hrefNoHistory = function(url) {
        location.replace(url);
        if (typeof event == "object") {
            event.returnValue = false;
        }
    }

    $.baseAjax = function(arg) {
        arg.loading = (arg.loading == "false" ? false : true);
        if (arg.loading) {
            $("#loadImg").show();
        }
        if (!arg.headers) {
            arg.headers = {};
        }
        if (typeof(RSA_WEB_SIGN_RESULT) == "string") {
            arg.headers["USER_RSA_KEY"] = RSA_WEB_SIGN_RESULT;
        }
        var failCallBack = function() {
            if (arg.failCallBack) {
                arg.failCallBack.call(this);
            }
        }

        $.ajax({
            dataType: "json",
            url: arg.url,
            async: arg.async == false ? false : true,
            type: arg.type || "POST",
            global:true,
            cache: false,
            data: arg.data,
            timeout: $.timeout,
            contentType: arg.contentType || "application/x-www-form-urlencoded",
            headers: arg.headers,
            error: function handleAjaxError(xhr, textStatus, error) {
                if (textStatus === "timeout") {
                    comAlertObj("连接超时!请稍后再试");
                    failCallBack();
                } else if (textStatus == "error" || textStatus === "parsererror") {
                    comAlertObj("系统繁忙,请稍后再试");
                    failCallBack();
                }
                if (arg.loadingConnect) {
                    return true;
                }
                if (arg.loading) {
                    $("#loadImg").hide();
                }
            },
            success: function(data) {
                if (data.result == $.dataResult.NOLOGIN) {
                    window.location.href = $.loginUrl;
                } else if (data.result == $.dataResult.INVAILD) {
                    comAlertObj("发送请求的参数中含有非法字符！");
                    failCallBack();
                } else if (data.result == $.dataResult.RSA_ERROR) {
                    comAlertObj("请求已失效，请返回重试！");
                    failCallBack();
                } else {
                    arg.successfn.call(this, data, arg.successarg);
                }
                if (arg.loadingConnect) {
                    return true;
                }
                if (arg.loading) {
                    $("#loadImg").hide();
                }
            },
            complete: function(xhr, ts) {
                if (arg.completefn) {
                    arg.completefn.call(this);
                }
            }
        });
    }
 
    /**
     * 记录日志至数据库
     */
    $.logDb = function(param) {
        var url = "/logInfo/jslog.htm";
        var arg = {
            url: url,
            data: param,
            successfn: function() {},
            loading: false
        };

        $.baseAjax(arg);
    }
    $.logInfo = function(remark1, remark2, remark3, remark4) {
        var arg = {
            userName: "jsInfo",
            remark1: remark1,
            remark2: remark2,
            remark3: remark3,
            remark4: remark4
        }
        $.logDb(arg);
    }
    $.logWarn = function(remark1, remark2, remark3, remark4) {
        var arg = {
            userName: "jsWarn",
            remark1: remark1,
            remark2: remark2,
            remark3: remark3,
            remark4: remark4
        }
        $.logDb(arg);
    }
    $.logError = function(remark1, remark2, remark3, remark4) {
        var arg = {
            userName: "jsError",
            remark1: remark1,
            remark2: remark2,
            remark3: remark3,
            remark4: remark4
        }
        $.logDb(arg);
    }

    /**Ajax方法 同步消息返回 POST提交 设置有错误处理超时处理
     * @param url 请求URL
     * @param data 请求数据
     * successfn 成功回调函数
     * arg 回传值
     * $.xxxNEW 新的ajax方法 传obj代替每次传入单个argument
     * */
    $.postAjaxSync = function(url, data, successfn, successarg, completefn) {
        var successfn = successfn || $.noop;
        var arg = {
            url: url,
            data: data,
            successfn: successfn,
            successarg: successarg,
            completefn: completefn,
            async: false
        };

        $.baseAjax(arg);
    };

    $.postAjaxSyncNew = function(obj) {
        var successfn = obj.successfn || $.noop;
        var arg = {
            url: obj.url,
            data: obj.data,
            successfn: obj.successfn,
            successarg: obj.successarg,
            completefn: obj.completefn,
            async: false,
            loading: obj.loadingSwitch || true,
            loadingConnect: obj.loadingConnect || false
        };

        $.baseAjax(arg);
    };

    /**Ajax方法 POST提交 设置有错误处理超时处理
     * @param url 请求URL
     * @param data 请求数据
     * successfn 成功回调函数
     * arg 回传值
     * */
    $.postajax = function(url, data, successfn, successarg, completefn) {
        var successfn = successfn || $.noop;
        var arg = {
            url: url,
            data: data,
            successfn: successfn,
            successarg: successarg,
            completefn: completefn
        };

        $.baseAjax(arg);
    };

    $.postajaxNew = function(obj) {
        var successfn = obj.successfn || $.noop;
        var arg = {
            url: obj.url,
            data: obj.data,
            successfn: obj.successfn,
            successarg: obj.successarg,
            completefn: obj.completefn,
            loading: obj.loadingSwitch || true,
            loadingConnect: obj.loadingConnect || false
        };

        $.baseAjax(arg);
    };

    $.postjson = function(url, data, successfn, successarg, completefn) {
        var successfn = successfn || $.noop;
        var arg = {
            url: url,
            data: data,
            successfn: successfn,
            successarg: successarg,
            completefn: completefn,
            contentType: "application/json"
        };

        $.baseAjax(arg);
    };


    $.postjsonNew = function(obj) {
        var successfn = obj.successfn || $.noop;
        var arg = {
            url: obj.url,
            data: obj.data,
            successfn: obj.successfn,
            successarg: obj.successarg,
            completefn: obj.completefn,
            contentType: "application/json",
            loading: obj.loadingSwitch || true,
            loadingConnect: obj.loadingConnect || false
        };

        $.baseAjax(arg);
    };
    /**Ajax方法 GET提交 设置有错误处理超时处理
     * @param url 请求URL
     * @param data 请求数据
     * successfn 成功回调函数
     * arg 回传值
     * */
    $.getajax = function(url, data, successfn, successarg, completefn, failCallBack) {
        var successfn = successfn || $.noop;
        var arg = {
            url: url,
            data: data,
            successfn: successfn,
            successarg: successarg,
            completefn: completefn,
            failCallBack: failCallBack,
            type: "GET"
        };

        $.baseAjax(arg);
    };

    $.getajaxNew = function(obj) {
        var successfn = obj.successfn || $.noop;
        var arg = {
            url: obj.url,
            data: obj.data,
            successfn: obj.successfn,
            successarg: obj.successarg,
            completefn: obj.completefn,
            failCallBack: obj.failCallBack,
            type: "GET",
            loading: obj.loadingSwitch || true,
            loadingConnect: obj.loadingConnect || false
        };

        $.baseAjax(arg);
    };

    /**
     * 公用 弹窗 
     */

    $.openLayer = function(content, callback) {
        $('body').addClass('pop-open');


        $.closeLayer();
        var _html = '<div class="pop-content-ct"><div class="pop-layer-close-ct" >' + '<div  class="pop-layer-close"><i class="iconfont icon-guanbi"></i></div></div> <div class="pop-content">' + content + '</div></div>';
        $(document.body).append(_html);
        //禁止背景滚动
        function preventDefault(ev) {
            ev.preventDefault()
        };
        $('.mask').get(0).addEventListener('touchmove', preventDefault, false);
        $('.pop-content-ct').on('touchmove', function() {
            return false; //阻止事件冒泡到document的touchmove事件的默认上拉滚动效果
        });
        //end
        $(".pop-layer-close").click(function(event) {
            $.closeLayer();
        });
        $(".pop-layer").click(function(event) {
            $.closeLayer();

        });
        $(".pop-content-ct").click(function(event) {
            return false;
        });
        $('.mask').click(function(event) {
            $.closeLayer();
        })
        callback && callback();
    };

    $.tipShow = function(text) {
        layer.open({ content: text, time: 2 });
    }
    $.closeLayer = function() {
        $('.pop-content-ct').css("top", $(window).height());
        $('.mask').hide();
        $('body').removeClass('pop-open');
        return false;
    }

})(Zepto);


//创建单例
var creatSingle = {
    creatMask: function() {
        var mask = $("<div class='mask' id='mask'></div>")
        mask.appendTo('body');
        return mask;
    },
    creatAlertObj: function() {
        var alertObj = $("<div class='alert' id='alert'></div>");
        alertObj.appendTo('body');
        return alertObj;
    },
    creatConfirmStr: function() {
        var confirmStr = $("<div class='confirm' id='confirm'>" +
            "<table><tr><td colspan=2 id='confirmMsg'></td></tr>" +
            "<tr><td style='height:35px;' align=right><a href='javascript:;' id='confirm_cancel' class='confirm-btn'>取消</a></td>" +
            "<td style='height:35px;' align=left><a href='javascript:;' id='confirm_ok' class='confirm-btn'>确定</a></td></tr></table></div>");
        confirmStr.appendTo('body')
        return confirmStr;
    },
    creatConfirmSingleStr: function() {
        var confirmSingleStr = $("<div class='confirm' id='cSingle'>" +
            "<table><tr><td colspan=2 id='cSingleMsg'></td></tr>" +
            "<tr><td colspan=2 style='height:35px;' align=center><a href='javascript:;' id='cSingle_ok' class='confirm-btn'>确定</a></td></tr></table></div>");
        confirmSingleStr.appendTo('body');
        return confirmSingleStr;
    },
    getSingle: function(fn) {
        var result;
        return function() {
            return result || (result = fn.apply(this, arguments));
        }
    }
};

var creatSingleLayer = {
    creatMaskLayer: creatSingle.getSingle(creatSingle.creatMask),
    creatAlertObjLayer: creatSingle.getSingle(creatSingle.creatAlertObj),
    creatConfirmLayer: creatSingle.getSingle(creatSingle.creatConfirmStr),
    creatConfirmSingleLayer: creatSingle.getSingle(creatSingle.creatConfirmSingleStr)
};

var comAlertObj = function(txt, otherClass) {
    var alertLayer = creatSingleLayer.creatAlertObjLayer(),
        maskLayer = creatSingleLayer.creatMaskLayer();
    alertLayer.show();
    var timer = null;
    $("#alert").html(txt);
    if (otherClass) {
        $("#alert").addClass(otherClass);
    }
    timer = setTimeout(function() {
        $("#alert").hide(300, function() {
            clearTimeout(timer);
            if (otherClass) {
            $("#alert").removeClass(otherClass);
        }
        });
        
    }, 1500);
};

$.baseConfirmObj = function(args) {
    var confirmStrLayer = creatSingleLayer.creatConfirmLayer(),
        maskLayer = creatSingleLayer.creatMaskLayer();
    maskLayer.show();
    confirmStrLayer.show();
    $("#confirmMsg").html(args.txt);
    $("#confirm").addClass(args.confirm_class);
    var obj = $("#mask").add("#confirm");

    $("#confirm_ok").off("click");
    $("#confirm_ok").text(args.confirm_ok);
    $("#confirm_cancel").off("click");
    $("#confirm_cancel").text(args.confirm_cancel);

    $("#confirm_ok").on("click", function() {
        $("#confirm").removeClass('show');
        $("#mask").hide(200);
        args.callback(1);
        return false;
    });
    $("#confirm_cancel").on("click", function() {
        $("#confirm").removeClass('show');
        $("#mask").hide(200);
        args.callback(2);
        return false;
    });
    $("#mask").show(300);
    $("#confirm").addClass('show');
};

var confirmObj = function(txt, confirm_ok, confirm_cancel, callback, confirm_class) {
    var args = {
        txt: txt,
        confirm_ok: confirm_ok,
        confirm_cancel: confirm_cancel,
        confirm_class: confirm_class,
        callback: callback
    };
    $.baseConfirmObj(args);
};
var confirmObjNew = function(obj) {
    var args = {
        txt: obj.txt,
        confirm_ok: obj.confirm_ok,
        confirm_cancel: obj.confirm_cancel,
        confirm_class: obj.confirm_class,
        callback: obj.callback
    };
    $.baseConfirmObj(args);
};

$.baseSingleObj = function(args) {
    var confirmSingleLayer = creatSingleLayer.creatConfirmSingleLayer(),
        maskLayer = creatSingleLayer.creatMaskLayer();
    maskLayer.show();
    confirmSingleLayer.show();
    $("#cSingleMsg").html(args.txt);
    $("#cSingle").addClass(args.cSingle_class);
    var obj = $("#mask").add("#cSingle");

    $("#cSingle_ok").off("click");
    $("#cSingle_ok").text(args.cSingle_ok);

    $("#cSingle_ok").on("click", function() {
        $("#mask").hide(200);
        $("#cSingle").removeClass('show');
        args.callback(1);
        return false;
    });
    $("#mask").show(300);
    $("#cSingle").addClass('show');
};


var cSingleObj = function(txt, cSingle_ok, cSingle_class, callback) {
    var args = {
        txt: txt,
        cSingle_ok: cSingle_ok,
        cSingle_class: cSingle_class,
        callback: callback || null
    };
    $.baseSingleObj(args);
};
var cSingleObjNew = function(obj) {
    var args = {
        txt: obj.txt,
        cSingle_ok: obj.cSingle_ok,
        cSingle_class: obj.cSingle_class,
        callback: obj.callback
    };
    $.baseSingleObj(args);
};

//默认图片
var defaultImg = function(img) {
    var imgUrl = img.getAttribute("default-img")
    img.src = imgUrl;
    img.onerror = null;
};
  //多个ajax的loading
var load = $('<div id="loadImg" class="loadImg" style="display:none"><p><img src="//s1.chexiangpre.com/msweb02/cx/cxj-spike/images/loading.gif"/></p></div>'); // loading 效果
        $("body").append(load); // 为每个页面插入load 的dom 结构
$(document).on('ajaxStart',function(){
        $("#loadImg").show();
        });
  $(document).on('ajaxStop',function(){
        $("#loadImg").hide();
       
})
$(function() {;
    (function() {
        //添加蒙层
        creatSingleLayer.creatMaskLayer()
        
         
        // 返回头部
        var backToTop = (function() {
            var instance = null;

            function BackToTop() {
                this.obj = $("<div class='backtop' id='backToTop'><i class='iconfont icon-top' ></i></div>");
                this.obj.appendTo($("body"));
                this.obj.click(function() { // 返回顶部
                    $("body,html").animate({ "scrollTop": 0 }, 200);
                });
            }
            return {
                init: function() {
                    var winHeight = $(window).height();
                    var bodyHeight = $("body").height();
                    $(window).scroll(function() {
                        if ($(window).scrollTop() > winHeight * 2) {
                            $('.backtop').show(500);
                        } else {
                            $('.backtop').hide(500);
                        }
                    });
                    if (bodyHeight / winHeight < 3) { // 小于3屏不添加返回顶部按钮
                        return false;
                    } else {
                        if (!instance) { // 大于等于3屏判断是否有此对象
                            instance = new BackToTop();
                        } else {
                            return instance;
                        }
                    }
                }
            }
        })();
        backToTop.init();
    })();

    //页面加载完毕 过渡隐藏
    $('.loading-page').hide();
});

var backet = null;;
(function() {


    backet = (function() { // 添加购物车 和 loading图标                     
        var backetObj = null,
            str = "";
        var strFoward = '<div class="buycar" id="buycar"><a href="' + $.context + '/preorder/index.htm"><i class="buycarfont"><span>&#x3475;</span><em>';
        var strBack = '</em></i></a></div>';

        function BacketFn(num) {
            str = strFoward + num + strBack;
            $("body").append(str);
        }
        return {
            init: function() {
                if (!backetObj) {
                    $.postajax($.context + "/preorder/shoppingcart.htm", "", function(data) {
                        if (data.obj.productNums && data.obj.productNums * 1 > 0) {
                            return backetObj = new BacketFn(data.obj.productNums);
                        }
                    });
                } else {
                    return backetObj;
                }
            }
        };
    })();
    // backet.init(); 创建购物车方法
})();

(function() {
    Number.prototype.toFixed = function(s) {
        var changenum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
        var index = changenum.indexOf(".");
        if (index < 0 && s > 0) {
            changenum = changenum + ".";
            for (var i = 0; i < s; i++) {
                changenum = changenum + "0";
            }
        } else {
            index = changenum.length - index;
            for (var i = 0; i < (s - index) + 1; i++) {
                changenum = changenum + "0";
            }
        }
        return changenum;
    };



})();
