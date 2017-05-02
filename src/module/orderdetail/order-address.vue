<template>
	<div class="order-address mt16" v-if='ps'>
		<div class="address-l">
			<div class="name">
				<p>收货人：</p>
				<span class="people">{{name}}</span>
				<span class="phone">{{phone}}</span>
			</div>  
			
			<div class="address-wrap"> 
				<p>收货地址：<span class="address">{{address}}</span></p>
			</div>

		</div>
		
	</div>
</template>

<script type="text/javascript">

export default {
	data:function(){
		return{
			name:'tony',
			phone:'15921067110',
			address:'中山北路3671弄11号502',
			isPay:false, //是否支付
			orderStatus:0, //订单状态 
			ps:true
		}
	},
	methods:{
		
	},
	events:{
		sendPs:function(d){	
			this.ps=d;
		},
		sendAddress:function(d){
			if(this.ps){
				this.name=d.receiverName;
				this.phone=d.receiverMobile;
				var a='',
				b='',
				c='',
				e='';

				if (d.provinceDescription) {
					if (d.provinceDescription=="undefined") {
						a='';
					}else{
						a=d.provinceDescription;
					};
				};

				if (d.cityDescription) {
					if (d.cityDescription=="undefined") {
						b='';
					}else{
						b=d.cityDescription;
					};
				};

				if (d.areaDescription) {
					if (d.areaDescription=="undefined") {
						c='';
					}else{
						c=d.areaDescription;
					};
				};
				if (d.receiverAddress) {
					if (d.receiverAddress=="undefined") {
						e='';
					}else{
						e=d.receiverAddress;
					};
				};
				this.address=a+b+c+e;
			}
			
		}
		
	},
	ready:function(){

	}
}

</script>


<style lang="scss">
	@import "../../assets/css/_functions.scss";	
	@import "../../assets/css/_variables.scss";	
	.order-address{
		width: rem(375);
		padding: 0 rem(15);
		display: flex;
		justify-content:space-between;
		height: auto;
		overflow: hidden;
		background: #fff;
		.address-l{
			width: rem(320);
			height: auto;
			padding:rem(12) 0;
			font-size:rem(14);
			color:#333333;
			line-height:rem(22);
			.name{
				display: flex;
				justify-content:flex-start;
				.people{
					margin-right: rem(10);
				}
			}
			.address-wrap{
				display: flex;
				justify-content:flex-start;
				
			}


		}
		.address-r{
			position: relative;

			>img{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				width: rem(8);
				height: rem(13);
			}
		}


	}
	
</style>