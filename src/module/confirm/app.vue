<template>
	<div class="seckill-confirm-order">
		<seckill-confirm-orderheader :orderinfoprop='orderInfo'></seckill-confirm-orderheader>
		<seckill-confirm-hasaddress :addressprop='address' v-if='expressFlag'></seckill-confirm-hasaddress>
		<seckill-confirm-shippingmethod v-ref:shippingmethod></seckill-confirm-shippingmethod>
		<seckill-confirm-needinvoice  v-if='expressFlag'></seckill-confirm-needinvoice>
		<div class="submit-btn" @click='toConfirm'>
			<div class="price"><span>合计：</span><span>¥</span><span>{{price}}</span></div>
			<div class="btn" :class='{"gray":togray}' ca="P_秒杀确认订单$立即支付">立即支付</div>

		</div>
	</div>
	<div class="mask-wrap" v-show="show">
		<div class="box">
			<p>您的订单已创建</p>
			<div class="box-b">
				<span @click="no" ca="P_秒杀确认订单$取消">取消</span>
				<span @click="yes" ca="P_秒杀确认订单$立即查看">立即查看</span>
			</div>
		</div>
	</div>
</template>

<script>

	//common
	import Vue from 'vue';
	import { Toast } from 'mint-ui';
	import '../../utils/remset';
	import vueResource from 'vue-resource';
	Vue.use(vueResource);
	import common from '../../utils/common';

	//组件引用
	import seckillConfirmOrderheader from './seckill-confirm-orderheader';
	import seckillConfirmHasaddress from './seckill-confirm-hasaddress';
	import seckillConfirmShippingmethod from './seckill-confirm-shippingmethod';
	import seckillConfirmNeedinvoice from './seckill-confirm-needinvoice';
	
	

	export default {
		data() {
				return {
					orderInfo: null,
					address: null,
					provinceDescription:'',
					cityDescription:'',
					areaDescription:'',
					popupVisible: false,
					entry: '',
					activityId:'',
					invoiceType:'0',
					invoiceCompanyname:'',
					invoiceContent:'',
					isInvoice:'0',
					price:'',
					orderId:'',
					loadingShowFlag:true,
					duConfirmFlag:true,
					togray:false,
					show:false,
					expressFlag:true
					
					
					
				}
			},
			components: {
				seckillConfirmOrderheader,
				seckillConfirmHasaddress,
				seckillConfirmShippingmethod,
				seckillConfirmNeedinvoice
			},
			methods: {
				no:function(){
					window.location.href="goodsdetail"+common.env()+"?activityId="+this.activityId;
				},
				yes:function(){ // 取消订单
					var orderId=localStorage.getItem('orderId');
					window.location.href="orderdetail"+common.env()+"?orderid="+orderId;
				},
				showAddress: function() {
					this.popupVisible = true;
				},
				toConfirm: function() {
					var self=this;
					this.activityId=this.getQueryString('activityId');
					if(!this.address&&this.expressFlag){
						 Toast("亲，请选择收货地址！");
						return false;
					}
					if(!this.duConfirmFlag){
						return false;
					}
					if(self.invoiceType!='2'){
						self.invoiceCompanyname='';
					}else{
						if(self.invoiceCompanyname==''){
							Toast("亲，请填写公司名称！");
							return false;
						}
						
					}
					//支付
					var confirmUrl= common.isdev() + '/prmtcenter/seckill/confirm.json';
					var confirmData={};
					if(this.expressFlag){
						//需要配送
						confirmData={
							activityId: self.activityId,
							receiverMobile: self.address.mobile,
							receiverAddress: self.address.addressName,
							receiverName: self.address.consignee,
							provinceCode: self.address.province,
							provinceDescription: self.provinceDescription,
							cityCode: self.address.city,
							cityDescription: self.cityDescription,
							areaCode: self.address.district,
							areaDescription: self.areaDescription,
							invoiceType:self.invoiceType,
							invoiceCompanyname:self.invoiceCompanyname,
							invoiceContent:'',
							isInvoice:self.isInvoice
						};
					}else{
						//不需要配送
						confirmData={
							activityId: self.activityId,
							receiverMobile:'',
							receiverAddress: '',
							receiverName: '',
							provinceCode: '',
							provinceDescription: '',
							cityCode: '',
							cityDescription: '',
							areaCode: '',
							areaDescription: '',
							invoiceType:'',
							invoiceCompanyname:'',
							invoiceContent:'',
							isInvoice:''
						};
					}
					this.$http.post(confirmUrl,confirmData).then(function (d) {
						d=d.json();
						this.duConfirmFlag=false;
						var time=null;
						setTimeout(function(){
							clearInterval(time);
						},5000)

						if(d.code=='2002'){
							localStorage.setItem('orderId',d.data);
							//
							document.getElementById('loadImg').style.display = 'block';
							var finishUrl=common.isdev() + '/prmtcenter/seckill/isOrderFinish.json';
							var finishData={
									"activityId":self.activityId
							};
							time=setInterval(function () {
								self.$http.post(finishUrl,finishData).then(function (d) {
									d=d.json();
									self.orderId=d.data;
									if(d.code=="1001") {
										clearInterval(time);
										self.payment(self.orderId);
									}
									//self.payment(self.orderId);
									
									else if(d.code=='2002'){
										document.getElementById('loadImg').style.display = 'block';
										// self.$http.post(finishUrl,finishData).then(function(d){
										// 	d=d.json();
										// 	self.orderId=d.data;
											
										// })
									}else if(d.code=='3007'){
										Toast(d.message);
										this.togray=true;
										clearInterval(time);
									}else {
										clearInterval(time);
									}
								})
								
							},1000);
						//

						}else if(d.code=='-10000'){
							this.show=true;
							this.togray=true;
							
						}
						else{
							Toast(d.message);
							this.togray=true;
						}
					})
					
				
				},
				payment:function (id) {
					var submitForm = "<form id = \"paymentForm\" action=\"" + common.isdev()+"/payment/toAlipay.htm\" method=\"post\" style=\"display:none\">" + "<input name=\"orderHeadCode\" value="+id+" type=\"hidden\" />"  + "</form>";
					$(submitForm).appendTo(document.body).submit();
				},
				getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;
				}
			},
			events: {
				chooseAddress: function(msg) {
					this.address = msg;
				},
				invoiceTypeEvent:function (msg) {
					this.invoiceType=msg;
				},
				companyNameEvent:function (msg) {
					this.invoiceCompanyname=msg;
				},
				idNeedVoiceEvent:function (msg) {
					this.isInvoice=msg;
				},
				priceEvent:function (msg) {
					this.price=msg;
				},
				expressFlagEvent:function (msg) {
					this.expressFlag=msg;
				}
			},
			ready: function() {
				
				var self=this;
				//登陆
				LoginJS.checkLogin(
					function(data) {
					},
					"",
					function() {
					});
				//是否是可买id
				this.activityId=this.getQueryString('activityId');
				localStorage.setItem('activityId', this.activityId);
				var iscanbuyUrl=common.isdev() + '/prmtcenter/seckill/isExecute.json';
				var iscanbuyData={"activityId":this.activityId};
				this.$http.post(iscanbuyUrl,iscanbuyData).then(function(d){
					d=d.json();
					if(!d.isSuccess){
//						location.href="goodsdetail"+common.env()+"?activityId="+self.activityId;
					}
				})
				
				//地址信息
				this.entry = this.getQueryString('entry');
				this.activityId = this.getQueryString('activityId');
				this.$broadcast('activityEvent',this.activityId);

				if(this.entry == 'address') { //当重地址列表选择回来
					var chooseAddressVal = localStorage.getItem('chooseAddressConfirm');
					var chooseAddress = JSON.parse(chooseAddressVal);
					var map=JSON.parse(localStorage.getItem('chooseAddressMap'));
					var proviceCode=chooseAddress.province;
					var cityCode=chooseAddress.city;
					var areaCode=chooseAddress.district;
					this.provinceDescription=map[proviceCode];
					this.cityDescription=map[cityCode];
					this.areaDescription=map[areaCode];
					this.address = chooseAddress;

				} else { //后端取默认地址
					var addressUrl=common.isdev() + '/prmtcenter/seckill/getDefaultAddr.htm';
					var addressData={};
					
					this.$http.post(addressUrl,addressData).then(function(d){
						d=d.json();
						var addressDefault = d.result.addressList[0];
						if(addressDefault){
							var mapDefault = d.result.map;
							localStorage.setItem('chooseAddressMap', JSON.stringify(mapDefault));
							this.$broadcast('chooseAddressMapEvent',mapDefault);
							var proviceCode=addressDefault.province;
							var cityCode=addressDefault.city;
							var areaCode=addressDefault.district;
							if( addressDefault.length != 0) {
								self.address = addressDefault;

								self.provinceDescription=mapDefault[proviceCode];
								self.cityDescription=mapDefault[cityCode];
								self.areaDescription=mapDefault[areaCode];
							}
						}
					})
				}

			}
	}
</script>

<style lang="scss">
	@import "../../assets/css/reset.scss";
	@import "../../assets/css/common.scss";
	@import "../../assets/fonts/iconfont.scss";
	@import '../../assets/css/_functions.scss';
	@import '../../assets/css/_variables.scss';
	@import "../../assets/css/toast.scss";
	.seckill-confirm-order {
		.mint-popup {
			width: 100%;
			height: 100%;
			background: #fff;
		}
		.submit-btn {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: rem(48);
			line-height: rem(48);
			background: #fff;
			border-top:1px solid #eee;
			.price {
				width: rem(264);
				height: rem(48);
				line-height: rem(48);
				float: left;
				text-align: right;
				span:nth-of-type(1) {
					font-size: rem(14);
					color: #333;
				}
				span:nth-of-type(2) {
					font-size: rem(12);
					color: #ff0000;
				}
				span:nth-of-type(3) {
					font-size: rem(18);
					color: #ff0000;
					padding-right: rem(19);
				}
			}
			.btn {
				width: rem(111);
				height: rem(48);
				line-height: rem(48);
				float: left;
				text-align: center;
				background: #ff6600;
				font-size: rem(18);
				color: #fff;
			}
			.gray{
				background: #999;
			}
		}
	}
	.mask-wrap{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background:rgba(0,0,0,0.5);
		z-index:99;
		.box{
			background:rgb(239,239,239);
			position: fixed;
			border-radius:12px;
			width:rem(270);
			height:rem(104);
			top: 50%;
			left:50%;
			margin-top: rem(-52);
			margin-left: rem(-135);
			z-index: 100;
			overflow: hidden;
			p{
				height: rem(60);
				line-height: rem(60);
				text-align: center;
				font-size:rem(17);
				color:#030303;	
				border-bottom: rem(1) solid #BBBBBB;
			}
			.box-b{
				height: rem(44);
				line-height: rem(44);
				display: flex;
				font-size:rem(17);
				justify-content:space-around;
				span{
					line-height: rem(44);
					text-align: center;
					color:#666;
					width:50%;
					display:block;
					&:first-child{
						color:#0076ff;
						border-right:rem(1) solid #BBBBBB;
					}
				}
			}
		}
	}
</style>