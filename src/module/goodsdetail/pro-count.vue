<template>
	<div class="pro-count mt16 mb16">
		<div class="h_box pro-count-wrap">
			<div class="pro-count-content">
				<div class="pro-count-number">限购数量</div>
				<div class="pro-count-text">每人限购{{limitNum}}件</div>
				<div class="pro-count-text" v-if="isShow">您已下单{{buied}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data:function(){
			return{
				limitNum:0, // 限购数 1
				buied:'-1', // 已买数 
				isShow:true
			}
		},
		events:{
			sendData:function(d){
				this.limitNum=d.maxCount;
			},
			sendBuied:function(d){
				this.buied=d;
				if (parseInt(d)>=0) {
					this.isShow=true;
				}else{
					this.isShow=false;
				}
			}
		},
		watch:{
			//如果已购买数大于等于0 
			'buied':function(){
				console.log(this.buied);
				if (parseInt(this.buied)>=0) {
					this.isShow=true;
				}else{
					this.isShow=false;;
				}
			}
		},
		// ready:function(){
		// 	var that=this;
		// 	setInterval(function(){
		// 		if (parseInt(that.buied)>=0) {
		// 			that.isShow=true;
		// 		}else{
		// 			that.isShow=false;;
		// 		};
		// 		console.log(that.buied);
		// 		console.log(that.isShow);
		// 		console.log("执行过了");
		// 	},1000);
		// }
	}
</script>

<style lang="scss">

	@import '../../assets/css/_variables.scss';
	@import '../../assets/css/_functions.scss';
	
	.pro-count {
		background: $_fff;
		@include hlh(44px);
		font-size: rem(14);
		padding: 0 rem(15);
		.pro-count-wrap {
			justify-content: space-between; 
			.pro-count-content {
				display: flex;
				justify-content: space-between; 
			}
		}
		.pro-count-text {
			margin: 0 rem(10);
		}
		.pro-count-jj {
			em {
				@include hlh(22px);
				background: #f1f1f1;
				color: $_999;
				width: rem(22);
				text-align: center;
				display: inline-block;
			}
			span{
				margin:0 rem(10);
			}
		}
	}
</style>