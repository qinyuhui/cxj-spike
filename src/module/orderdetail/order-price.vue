<template>
	<div class="order-price mt16">
		<div class="price-wrap">
			<img :src="picurl">
			<div class="price-c">
				{{name}}
			</div>
			<div class="price-r">
				<p>¥ {{price}}</p>
			</div>
		</div>
		<div class="price-b">
			<p>{{pFont}}</p>
			<span class="price">¥ {{total}}</span>
		</div>
	</div>
		
</template>

<script type="text/javascript">

export default {
	data:function(){
		return{
			name:'固特异 EFF 215/50R17 91V固特异 EFF 215/50R17 91V固特异 EFF 215/50R17 91V固特异 EFF 215/50R17 91V…',
			price:'299.00', //单价
			num:2, //数量
			total:0, //总价
			pic:'',
			picurl:'',
			pFont:''
		}
	},
	events:{
		sendDatas:function(d){
			var dd=d.orderItemList[0];
			this.name=dd.skuName;
			this.price=dd.paidCash;
			this.num=dd.quantity;
			this.total=this.price*this.num;
			this.pic=dd.mdseUrl;
			console.log(d.status);
			if(d.status=="4"||d.status=="5"){
				this.pFont="已付金额";
			}else{
				this.pFont="应付金额";
			}
		},
		sendImgurl:function(d){
			this.picurl=d+this.pic.substr(1);
		}
	},
	ready:function(){
		
	}
}

</script>


<style lang="scss">
	@import "../../assets/css/_functions.scss";	
	@import "../../assets/css/_variables.scss";	
	.order-price{
		width: rem(375);
		height: auto;
		overflow: hidden;
		background: #fff;
		.price-wrap{
			margin-left: rem(15);
			padding-right: rem(15);
			width: rem(360);
			border-bottom: rem(1) solid #dedede;
			padding:rem(15) rem(15) rem(15) 0;
			display: flex;
			justify-content:space-around ;
			align-items: center;
			img{
				width: rem(50);
				height: rem(50);
			}
			.price-c{
				width: rem(201);
				margin-left: rem(10);
				margin-right: rem(25);
				font-size:rem(14);
				color:#333333;
				letter-spacing:0px;
				line-height: rem(16);
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2; 
				-webkit-box-orient: vertical; 
				text-overflow:ellipsis;

			}
			.price-r{
				text-align: right;
				font-size:rem(14);
				color:#333333;
				line-height: rem(16);
				letter-spacing:0px;
				text-align:right;
				span{
					color:#666666;
				}
			}
		}
		.price-b{
			display: flex;
			padding: 0 rem(15);
			justify-content:space-between;
			width: rem(375);
			height: rem(44);
			line-height: rem(44);
			font-size:rem(14);	
			color:#333333;
			span{
				font-size:rem(14);;
				color:#f55923;
			}

		}

	}
	
</style>