<template>
	<div class="seckill-confirm-hasaddress">
		<div class="normal-bg mt15"  v-if='addressprop==null' @click='chooseAddress' ca="P_秒杀确认订单$选择地址">
			<p class="address ">
				<span>收货地址</span>
				<span class="gray">请选择</span>
			</p>
		</div>
		<div class="normal-bg mt15" v-if='addressprop!=null' @click='chooseAddress'  ca="P_秒杀确认订单$选择地址">

			<div class="address">
				<p>
					<span>收货人：{{addressprop.consignee}} {{addressprop.mobile}}</span>
				</p>
				<p class="short-p">收货地址：{{chooseAddressMap[addressprop.province]}}{{chooseAddressMap[addressprop.city]}}{{chooseAddressMap[addressprop.district]}}{{addressprop.addressName}}</p>
			</div>
		</div>
	</div>
</template>
<script>
	//url
	import common from '../../utils/common';
	export default {
		data() {
				return {
					popupVisible: false,
					activityId:'',
					chooseAddressMap:null
				}
			},
			props: {
				addressprop: {
					type: Object,
					default: null
				}
			},
			components: {
				
			},
			methods: {
				chooseAddress:function(){
					location.href='addresslist'+common.env()+'?flag=confirm&activityId='+this.activityId;
				},
				getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;
				}
			},
			events:{
				chooseAddress:function(msg){
					this.addressprop=msg;
				},
				showAddressList:function(msg){
					this.popupVisible=msg;
				},
				activityEvent:function(msg){
					this.activityId=msg;
				},
				chooseAddressMapEvent:function(msg){
					this.chooseAddressMap=msg;
				}
			},
			ready:function(){
				this.activityId=this.getQueryString('activityId');
				this.chooseAddressMap=JSON.parse(localStorage.getItem('chooseAddressMap'));
			}
	}
</script>
<style lang="scss" scoped>
	@import '../../assets/css/_functions.scss';
	@import '../../assets/css/_variables.scss';
	.normal-bg {
		background-color: $_fff;
		padding: rem(14) rem(15);
		font-size: rem(14);
	}
	
	.normal-bg {
		padding-right: rem(15);
	}
	
	.normal-bg p {
		clear: both;
		overflow: hidden;
		line-height: rem(22)
	}
	
	.normal-bg p span:nth-child(2) {
		float: right;
		margin-right: rem(15);
	}
	
	.gray {
		color: $_999;
	}
	
	.address {
		background: transparent url(../../assets/images/arrow.png?v1) no-repeat right center;
	}
	
	.short-p {
		padding-right: rem(20)
	}
	.mint-popup{
		width: 100%;
		height: 100%;
		background: #fff;
	}
</style>