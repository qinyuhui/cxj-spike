<template>
	<div class="seckill-edit">
		<div class="wrap">
			<div class="input-wrap">
				<span class="input-name">收件人</span>
				<input type="text" id="userName" placeholder="真实姓名" maxlength='20' @input='saveValue("userNameEvent",$event,userNameFlag)'  v-model='name'>
				<b v-if='userNameFlag'>请填写收货人</b><b v-if='userNameFlag02'>姓名输入有问题</b>
			</div>

			<div class="input-wrap">
				<span class="input-name">手机号</span>
				<input type="tel" placeholder="填写手机号" maxlength='11' id="userMobile" @input="mobileInput($event)"  v-model='mobile'>
				<b v-if='mobileFlag'>请填写手机号</b><b v-if='mobileFlag02'>请填写正确的手机号</b>
			</div>

			<!--城市选择-->
			<select-city></select-city>

			<div class="input-wrap address">
				<span class="input-name">详细地址</span>
				<input type="text"  placeholder="街道、楼牌号等（不少于4个字）" maxlength='50' id="userAddress" @input='addressInput($event)' v-model='address'></input>
				<b v-if='addressFlag'>请填写地址</b><b v-if='addressFlag02'>地址不少于4个字</b><b v-if='addressFlag03'>地址输入有问题</b>
			</div>
		</div>
		<div class="wrap default" v-if='defaultInitFlag!="1" '>
			<div class="input-wrap ">
				<span class="input-name">设为默认</span>
				<div class="city-wrap">
					<p>下次下单会使用该地址</p>
					<div class="mint-switch">
						<input type="checkbox" class="mint-switch-input" v-model='defaultFlagModel'>
						<span class="mint-switch-core"></span>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script type="text/javascript">
	import Vue from 'vue';
	import selectCity from './select-city';

	//switch
	import {
		Switch
	} from 'mint-ui';
	Vue.component(Switch.name, Switch);
	export default {
		data() {
				return {
					name: '',
					mobile: '',
					area: '',
					address: '',
					userNameFlag: false,
					userNameFlag02:false,
					mobileFlag: false,
					mobileFlag02:false,
					areaFlag: false,
					addressFlag: false,
					addressFlag02:false,
					addressFlag03:false,
					defaultFlagModel:false,
					defaultFlag: '2',
					defaultInitFlag:''

				}
			},
			methods: {
				
				saveValue: function(eventName, event, flag) {
					var val = event.currentTarget.value;
					this.$dispatch(eventName, val);
					if(val) {
						this.flag = false;
					}
				},
				mobileInput:function (event) {
					var val = event.currentTarget.value;
					var mobileRep=/\d/;
					if(val.length>11){
						event.currentTarget.value=val.slice(0,11);
					}else if(mobileRep.test(val)||val.length==0){
						this.mobileFlag02=false;
					}
					this.saveValue("mobileEvent",event,this.mobileFlag);
				},
				addressInput:function (event) {
					var val = event.currentTarget.value;
					if(val.length==4){
						this.addressFlag02=false;
					}
					
					this.saveValue("addressEvent",event,this.addressFlag);
					this.saveValue("addressEvent",event,this.addressFlag02);
				},
				getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;
				}
			},
			watch: {
				name: function(val, oldVal) {
					if(val) {
						this.userNameFlag = false;
					}else{
						this.userNameFlag02 = false;
					} 
					// var s = /^[\da-zA-Z\u4E00-\u9FA5]{1,10}$/;
					var s = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\w])*$/;
					if(s.test(val)){
						this.userNameFlag02 = false;
					}
				},
				mobile: function(val, oldVal) {
					if(val) {
						this.mobileFlag = false;
					}
				},
				address: function(val, oldVal) {
					if(val){
						this.addressFlag=false;
					}else{
						this.addressFlag03=false;
						this.addressFlag02=false;
					};
					var s = /^[\da-zA-Z\u4E00-\u9FA5-_]{1,50}$/;
					if(s.test(val)){
						this.addressFlag03=false;
					}
					
					// var s = /^[\da-zA-Z\u4E00-\u9FA5]{1,10}$/;
					// var s = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\w])*$/;
					// if(s.test(val)){
					// 	this.addressFlag = false;
					// }
				},
				defaultFlagModel:function () {
					if(this.defaultFlagModel){
						this.defaultFlag='1';
						
					}else{
						this.defaultFlag='2';
					}
					this.$dispatch('chooseDefaultEvent', this.defaultFlag);
				},
				addressFlag03:function(){
					if(this.addressFlag03){
						this.addressFlag02=false;
					};
				},
				addressFlag02:function(){
					if(this.addressFlag02){
						this.addressFlag03=false;
					};
				}

			},
			ready: function() {
				var userName = document.getElementById("userName");
				var userMobile = document.getElementById("userMobile");
				var userArea = document.getElementById("userArea");
				var userAddress = document.getElementById("userAddress");
				var newAddress = {};
				newAddress.username = userName;
				newAddress.usermobile = userMobile;
				newAddress.userarea = userArea;
				newAddress.useraddress = userAddress;
				var entry = this.getQueryString('entry');
				if(entry == 'edit') {
					this.editFlag = true;
					var editAddressItem = JSON.parse(localStorage.getItem('chooseAddressEdit'));
					var editAddressMap = JSON.parse(localStorage.getItem('chooseAddressMap'));
					this.name = editAddressItem.consignee;
					this.mobile=editAddressItem.mobile;
					this.address=editAddressItem.addressName;
					this.defaultFlag=editAddressItem.defaultFlag;
					this.defaultInitFlag=editAddressItem.defaultFlag;
					if(this.defaultFlag=='1'){
						this.defaultFlagModel=true;
					}else{
						this.defaultFlagModel=false;
					}
					this.$dispatch('userNameEvent', this.name);
					this.$dispatch('mobileEvent', this.mobile);
					this.$dispatch('addressEvent', this.address);
					this.$dispatch('chooseDefaultEvent02', this.defaultFlag);
				}
				//新用户第一次进入 默认选中
				console.log(localStorage.getItem('addressTotalNum'));
				if(localStorage.getItem('addressTotalNum')==0){
					this.defaultFlagModel=true;
				}
			},
			events: {
				userFlagEvent: function(msg) {
					this.userNameFlag = msg;
				},
				userFlag02Event: function(msg) {
					this.userNameFlag02 = msg;
				},
				mobileFlagEvent: function(msg) {
					this.mobileFlag = msg;
				},
				mobileFlag02Event:function (msg) {
					this.mobileFlag02 = msg;
				},
				addressFlagEvent: function(msg) {
					this.addressFlag = msg;
				},
				addressFlag02Event: function(msg) {
					this.addressFlag02 = msg;
				},
				addressFlag03Event: function(msg) {
					console.log(msg);
					this.addressFlag03 = msg;
				}
			},
			components:{selectCity}
	}
</script>

<style lang="scss">
	@import "../../assets/css/_functions.scss";
	@import "../../assets/css/_variables.scss";
	.seckill-edit {
		.wrap {
			background: $_fff;
			overflow: hidden;
		}
		width: rem(375);
		height: auto;
		overflow: hidden;
		.input-wrap {
			width: rem(360);
			height: rem(44);
			display: block;
			float: right;
			line-height: rem(44);
			border-bottom: 1px solid #dedede;
			position: relative;
			>* {
				display: block;
				float: left;
				overflow: hidden;
				line-height: rem(44);
			}
			span {
				width: rem(75);
				text-align: left;
				font-size: 14px;
				color: #333333;
				display: block;
			}
			input {
				width: rem(285);
				border: none;
				margin-top: rem(12);
				line-height: rem(18);
				height: rem(18);
				color: #333333;
				font-size: rem(14);
			}
			.mint-switch-input{
				width: rem(285);
				border: none;
				margin-top: rem(1);
				line-height: rem(42);
				color: #333333;
				font-size: rem(14);
				opacity: 0;
				display: block;
			}
			b {
				position: absolute;
				right: 0;
				top: 0;
				font-size: rem(14);
				color: #ff0000;
				padding-right: rem(13);
				font-weight: normal;
			}
			.city-wrap {
				width: rem(285);
				margin-top: rem(1);
				line-height: rem(42);
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				p {
					font-size: rem(14);
					color: #cccccc;
					opacity: 0.8;
					display: block;
				}
				img {
					margin-top: rem(15);
					margin-right: rem(15);
					width: rem(8);
					height: rem(13);
					display: block;
				}
			}
		}
		.address {
			input {
				padding-right: rem(27);
			}
		}
		:last-child {
			border-bottom: none !important;
		}
		.default {
			margin-top: rem(15);
		}
	}
	
	.mint-switch {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		position: relative;
		margin-right: rem(15);
	}
	
	.mint-switch-label {
		margin-left: rem(10);
		display: inline-block
	}
	
	.mint-switch-label:empty {
		margin-left: 0
	}
	
	.mint-switch-core {
		position: relative;
		width: rem(52) !important;
		height: rem(32);
		border: 1px solid #d9d9d9;
		border-radius: rem(16);
		box-sizing: border-box;
		background: #d9d9d9
	}
	
	.mint-switch-core::after,
	.mint-switch-core::before {
		content: " ";
		top: 0;
		left: 0;
		position: absolute;
		-webkit-transition: -webkit-transform .3s;
		transition: -webkit-transform .3s;
		transition: transform .3s;
		transition: transform .3s, -webkit-transform .3s;
		border-radius: rem(15)
	}
	
	.mint-switch-core::after {
		width: rem(30);
		height: rem(30);
		background-color: #fff;
		box-shadow: 0 rem(1) rem(3) rgba(0, 0, 0, .4)
	}
	
	.mint-switch-core::before {
		width: rem(50);
		height: rem(30);
		background-color: #fdfdfd
	}
	
	.mint-switch-input {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		outline: 0;
		width: rem(52)!important;
		height: rem(32);
		position: absolute;
		z-index: 1;
		display: block;
	}
	
	.mint-switch-input:checked+ .mint-switch-core {
		border-color: #44DB5E;
		background-color: #44DB5E
	}
	
	.mint-switch-input:checked+ .mint-switch-core::before {
		-webkit-transform: scale(0);
		transform: scale(0)
	}
	
	.mint-switch-input:checked+ .mint-switch-core::after {
		-webkit-transform: translateX(rem(20));
		transform: translateX(rem(20))
	}
	
	input::-webkit-input-placeholder,
	textarea::-webkit-input-placeholder {
		font-weight: 100;
		color: #cccccc;
		font-size: rem(14);
		letter-spacing: -0.34px;
	}
	
	// input:-moz-placeholder, textarea:-moz-placeholder {
	// font-family: PingFang-Medium,PingFangSC-Regular,Helvetica;
	// font-weight: 100;
	// color:#cccccc;
	// font-size:rem(14);
	// }
	// input::-moz-placeholder, textarea::-moz-placeholder {
	// font-family: PingFang-Medium,PingFangSC-Regular,Helvetica;
	// font-weight: 100;
	// color:#cccccc;
	// font-size:rem(14);
	// }
	// input:-ms-input-placeholder, textarea:-ms-input-placeholder {
	// font-family: PingFang-Medium,PingFangSC-Regular,Helvetica;
	// font-weight: 100;
	// color:#cccccc;
	// font-size:rem(14);
	// }
</style>