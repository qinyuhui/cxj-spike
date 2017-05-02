<template>
	<div class="seckill-pay-success">
		<div class="seckill-pay-success-icon"><img src="../../assets/images/success.png"/></div>
		<p class="seckill-pay-success-inform">
			<span>
				秒杀成功
			</span>	
		</p>
		<div class="seckill-pay-success-btns clearfix">
			<!--<div class="seckill-pay-success-back fl" @click='goIndex' v-if='goIndexFlag'>
					返回首页
			</div>-->
			<div class="seckill-pay-success-check fl" @click='goOrder' ca="P_秒杀支付成功$查看订单">
					查看订单
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import common from '../../utils/common';
export default {
	data(){
		return {
			orderid:'',
			goIndexFlag:true,
			activityId:''
		}
	},
	methods:{
		goIndex:function () {
			this.activityId=localStorage.getItem('activityId');
			window.location.href="goodsdetail"+common.env()+"?activityId="+this.activityId;
			
// 			var ua = window.navigator.userAgent;
			
// 			if(ua.indexOf('MongoToC')!=-1){
// 			 	 lb.closeWebview(function (data) {})
// 			 }else{
// //			 	window.opener = null;
// //				window.open('/','_self');
// //				window.close();
// //				var url=location.href;
// //				if(url.indexOf('sit')!=-1){
// //					location.href='//recruit.sit.chexiang.com/wxoauth2/cxh/home';
// //				}else if(url.indexOf('chexiangpre')!=-1){
// //					location.href='//recruit.pre.chexiang.com/wxoauth2/cxh/home';
// //				}else{
// //					locaiton.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx50532a3a86aab9fd&redirect_uri=http%3A%2F%2Fwx.chexiang.com%2Fwxoauth2%2Fcxh%2Fhome&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect';
// //				}
				
// 			 }
			
			
		},
		goOrder:function () {
			location.href='orderdetail'+common.env()+'?orderid='+this.orderid;
		},
		getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;
				}
	},
	ready:function () {
		//登陆
				LoginJS.checkLogin(
					function(data) {
						console.log('已登录');
					},
					"",
					function() {
					});
		this.orderid=this.getQueryString('orderid');
//		var ua = window.navigator.userAgent;
//		if(ua.indexOf('MongoToC')==-1){
//			 	 this.goIndexFlag=false;
//		}
	}
}
</script>

<style lang="scss">
 
	@import '../../assets/css/_functions.scss';
@import '../../assets/css/_variables.scss';
body{
	background: #fff;
}
	.seckill-pay-success-icon {
		width: rem(78);
		height: rem(78);
		margin: rem(45) auto rem(19) auto;
		img{
			width:100%;
			height: 100%;
		}
	}
	.seckill-pay-success-inform {
		text-align: center;
		font-size: rem(20);
		margin-bottom: rem(41);
	}
	.seckill-pay-success-inform span {
		color: #333;
		font-size: rem(20);
	}
	.seckill-pay-success-btns{
		display: flex;	
		justify-content: center;
	}
	.seckill-pay-success-btns div {
		width: rem(158);
		height: rem(38);
		font-size: rem(14);
		text-align: center;
		line-height: rem(38);
		border: 1px solid #ccc;
		border-radius: rem(4);
		color: #030303;
	}
	
	.seckill-pay-success-back {
		margin: 0 rem(15) 0 0;
	}
</style>