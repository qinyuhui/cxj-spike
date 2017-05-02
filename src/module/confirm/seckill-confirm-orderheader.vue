<template>
	<div class="normal-bg mt15 clearfix">
		<dl class="order-header">
			<div class="left">
				<dd class="order-img">
					<img :src="orderInfo.mainImage" />
				</dd>
				<dd class="title">
					<p class="name">{{orderInfo.goodsName}}</p>
				</dd>
			</div>
			<div class="right">
				<dd>
					<p class="amount"><span class="price"><small>&yen;</small>{{orderInfo.cashPrice}}</span></p>
				</dd>
			</div>

		</dl>

	</div>
</template>
<script>
	//ajax
	import common from '../../utils/common';

	export default {

		data() {
				return {
					orderInfo: [],
					activityId: ''
				}
			},
			methods: {
				getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;
				}
			},
			ready: function() {
				this.activityId = this.getQueryString('activityId');
				var self = this;
				var url = common.isdev() + '/prmtcenter/seckill/' + self.activityId + '.json';
				var data = ''
					//秒杀活动信息
				this.$http.get(url).then(function(d) {
					d = d.json();
					var res = JSON.parse(d.data.seckillInfo);
					this.orderInfo = res;
					console.log(d.data.supplyMode)
					var expressFlag=true;
					if(d.data.supplyMode=='0'){
						expressFlag=false;
					}else{
						expressFlag=true;
					}
					this.$dispatch('priceEvent', this.orderInfo.cashPrice);
					this.$dispatch('expressFlagEvent', expressFlag);
					this.$parent.$refs.shippingmethod.expressFlag=expressFlag;
				});

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
	
	.order-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left {
			display: flex;
			align-items:center;
			.title {
				width: rem(210);
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.right{
		}
	}
	
	.order-header dd.order-img img {
		width: rem(50);
		height: rem(50);
	}
	
	.order-header .name {
		font-size: rem(14);
		line-height: rem(18);
		padding-left: rem(10);
	}
	
	.order-header .amount {
		text-align: right;
		padding-left: rem(10);
	}
	
	.order-header .amount .price {
		color: $price;
		font-size: rem(14);
	}
	
	.order-header .amount .price small {
		font-size: rem(12);
		margin-right: rem(3)
	}
	
	.order-header .amount .num {
		font-size: rem(14);
		color: $_666;
		margin-top: rem(5);
		display: inline-block;
	}
	
	.normal-bg-bottom {
		padding-right: 0;
	}
	
	.normal-bg-bottom p {
		clear: both;
		overflow: hidden;
	}
	
	.normal-bg-bottom p:nth-child(1) {
		border-bottom: 1px solid #dedede;
		padding-bottom: rem(15);
	}
	
	.normal-bg-bottom p:nth-child(2) {
		padding-top: rem(15);
	}
	
	.normal-bg-bottom p span:nth-child(2) {
		float: right;
		margin-right: rem(15);
	}
	
	.gray {
		color: $_999;
	}
</style>