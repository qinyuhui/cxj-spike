<template>
	<div class="seckill-shipping-address-list" v-cloak>

		<div class="list" v-if='addressListSort.length>0'>
			<div class="seckill-list-info" v-for='item in addressListSort'  >
				<div class="choose" @click='chooseAddress($index)' ca="P_秒杀收货地址管理$选择地址">
					<p>
						<span class="seckill-list-info-name">{{item.consignee}}</span>
						<span>{{item.mobile}}</span><span v-if='item.defaultFlag=="1" '>默认</span>
					</p>
					<p class="seckill-list-info-address">
						{{chooseAddressMap[item.province]}}{{chooseAddressMap[item.city]}}{{chooseAddressMap[item.district]}}{{item.addressName}}
					</p>
				</div>
				
				<b @click='editAddress($index)' ca="P_秒杀收货地址管理$编辑">编辑</b>
			</div>
		</div>
		<div v-if='noAddressFlag' class="noaddress">
			<div><img src="../../assets/images/address.png"/></div>
			<div>您尚未添加地址,现在去设置？</div>
		</div>
		<div class="seckill-empty-btn" @click='addNewAddress' ca="P_秒杀收货地址管理$添加新地址">
			添加新地址
		</div>
	</div>
</template>
<script>
	//ajax
	import Vue from 'vue';
	import VueResource from 'vue-resource';
	import common from '../../utils/common';
	Vue.use(VueResource);
	Vue.http.options.emulateJSON = true;
	
	


	export default {
		data() {
				return {
					addressList: [],
					datas: [],
					url: '',
					flag: 'confirm',
					activityId:'',
					noAddressFlag:false,
					chooseAddressMap:null,
					addressListSort:[]
				}
			},
			computed:{
				
			},
			ready: function() {
				var self=this;
				//登陆
				LoginJS.checkLogin(
					function(data) {
						console.log('已登录');
					},
					"",
					function() {
					});
				//cookie
				var domain=".chexiang.com";
			if (window.location.hostname.indexOf(".sit.com") != -1) {
		        domain=".sit.com";
		    } else if (window.location.hostname.indexOf(".pre.com") != -1) {
		        domain=".pre.com";
		    };
		    var ua= navigator.userAgent;

		    if (ua.indexOf("userToken")!=-1) {
		    	console.log("手机");
		    	var token=JSON.parse(ua).userToken;
			    var expires = new Date();
	            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);//1 天
	            document.cookie = "sc_s=" + token + ";expires=" + expires.toGMTString() + ";path=/;domain=" + domain;
		    }else{
		    	console.log("是pc");
		    };
		  //
				this.activityId = this.getQueryString('activityId');
				var url=common.isdev() + '/prmtcenter/seckill/findAddress.htm?'+Date.now();
				var data='';
				this.$http.get(url).then(function(d){
					d=d.json();
					var res=d.result.addressList;
					self.addressList = res;
					if(self.addressList.length==0){
						self.noAddressFlag=true;
					}
					//排序
					var addressListDefault=[];
					var addressListOther=[];
					var addressListSort=[];
					for(var i=0;i<res.length;i++){
						if(res[i].defaultFlag=='1'){
							addressListDefault.push(res[i]);
						}else{
							addressListOther.push(res[i]);
							
						}
						
					}
					
					addressListOther.sort(self.sort);
					
					addressListSort=addressListDefault.concat(addressListOther); 
					this.addressListSort=addressListSort;
					
					
					//
					var chooseAddressMap = d.result.map;
					this.chooseAddressMap=chooseAddressMap;
					localStorage.setItem('chooseAddressMap', JSON.stringify(chooseAddressMap));
					localStorage.setItem('addressTotalNum', self.addressList.length);
					
				})
				
				this.flag = this.getQueryString('flag');
				//编辑或添加页进入 不保存历史记录
				if(this.flag != 'confirm') {
//					location.replace('./addresslist.html?activityId='+this.activityId);
				}
			},
			methods: {
				chooseAddress: function(index) {
					//接受一个flag 设置数据
					if(this.flag == 'confirm') {
						location.replace("confirm"+common.env()+"?entry=address&activityId="+this.activityId);

						var chooseAddressItem =this.addressListSort[index];
						localStorage.setItem('chooseAddressConfirm', JSON.stringify(chooseAddressItem));
						
					}
					
				},
				addNewAddress: function() {
					location.replace('addressedit'+common.env()+'?entry=add'+'&activityId='+this.activityId);
				},
				editAddress:function (index) {
						var chooseAddressItem = this.addressListSort[index];
						localStorage.setItem('chooseAddressEdit', JSON.stringify(chooseAddressItem));
						location.replace('addressedit'+common.env()+'?entry=edit&addressId='+chooseAddressItem.addressId+'&activityId='+this.activityId);
					
				},
				getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					console.log(window.location.search.substr(1));
					var r = window.location.search.substr(1).match(reg);
					console.log(r);
					if(r != null) return unescape(r[2]);
					return null;
				},
				sort:function(a,b){
					return a.addressId-b.addressId;
				}
			},
			components: {
				
			}
	}
</script>

<style lang="scss">
	@import "../../assets/css/reset.scss";
	@import "../../assets/css/common.scss";
	@import '../../assets/css/_functions.scss';
	@import '../../assets/css/_variables.scss';
	body {
		background-color: #eee;
	}
	
	.seckill-shipping-address-list {
		margin-top: rem(15);
	}
	.list{
		padding-bottom: rem(70);
	}
	.noaddress{
		margin-top: rem(233);
		div:nth-of-type(1){
			width:100%;
			overflow:hidden;
			text-align:center;
		
			img{
				width: rem(69);
				height: rem(69);
			}
		}
		div:nth-of-type(2){
			width:100%;
			overflow:hidden;
			margin-top: rem(16);
			text-align:center;
			font-size:rem(14);
			color:#999;
		}
	}
	.seckill-list-info {
		background-color: #fff;
		padding: rem(8) rem(15);
		margin-bottom: rem(10);
		line-height: rem(30);
		font-size: rem(14);
		color: #333;
		position: relative;
		.choose{
			width: rem(280);
			overflow: hidden;
			p{
				display: flex;
				align-items: center;
			}
			span:nth-of-type(3){
				background: #03a9f6;
				color: #fff;
				font-size: rem(12);
				margin-left: rem(5);
				display: inline-block;
				width: rem(29);
				line-height: rem(16);
				text-align: center;
				border-radius: rem(4);
			}
		}
		b{
			font-weight: normal;
			font-size: rem(14);
			color: #333;
			position: absolute;
			right:0;
			top: 0;
			width: rem(70);
			height: rem(58);
			text-align: right;
			padding-right: rem(14);
			padding-top: rem(8);
			
		}
	}
	
	.seckill-list-info-name {
		margin-right: rem(6);
	}
	
	.seckill-list-info-address {
		line-height: rem(18);
	}
	
	.seckill-empty-btn {
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		height: rem(48);
		line-height: rem(48);
		background-color: #fff;
		text-align: center;
		font-size: rem(16);
		min-width: 320px;
		max-width: 640px;
		margin: 0 auto;
		color: $orange;
	}
	
	.seckill-empty-btn a {
		display: block;
		color: #ff6600;
	}
</style>