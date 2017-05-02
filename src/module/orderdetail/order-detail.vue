<template>
	<div class="order-detail mt16">
		<div class="detail-wrap"  v-if="ps">
			<p>配送方式</p>
			<span>全国包邮</span>
		</div>
		<div class="detail-wrap">
			<p>付款方式</p>
			<span>在线支付</span>
		</div>
		<div class="detail-wrap nobottom"  v-if="ps">
			<p>发票信息</p>
			<span>{{invoiceFont}}</span>
		</div>	
		<div class="detail-wrap" v-if="isInvoice==1&&invoiceType==2&&ps">
			<p>单位名称</p>
			<span>{{company}}</span>
		</div>
	</div>
		
</template>

<script type="text/javascript">

export default {
	data:function(){
		return {
			isInvoice:1,
			company:'上海赛可电子商务有限公司',
			invoiceFont:'无需发票',
			invoiceType:2,
			ps:true
		}
	},
	methods: {

		
	},
	events:{
		sendDatas:function(d){
			var dd=d.invoiceVO;
			//console.log();
			this.isInvoice=dd.isInvoice;
			//this.invoiceType=dd.invoiceType?dd.invoiceType:1;
			//判断有没有发票
			if(this.isInvoice==0){
				this.invoiceFont="无需发票";
			}else{ //如果有发票  设置发票类型

				this.invoiceType=dd.invoiceType;
				//如果是个人发票
				if(this.invoiceType==1) {
					this.invoiceFont="个人发票";
				}else{
					this.invoiceFont="公司发票";
					this.company=dd.invoiceCompanyname;
				}
			}
		},
		sendPs:function(d){
			this.ps=d;
		}
	}

}
	

</script>


<style lang="scss">
	@import "../../assets/css/_functions.scss";	
	@import "../../assets/css/_variables.scss";	
	.order-detail{
		width: rem(375);
		height: auto;
		overflow: hidden;
		background: #fff;
		.detail-wrap{
			display: flex;
			justify-content:space-between ;
			width: rem(360);
			height: rem(44);
			line-height: rem(44);
			margin-left: rem(15);
			padding-right: rem(15);
			border-bottom: rem(1) solid #dedede;
			font-size:rem(14);
			color:#999999;
			span{
				color:#333333;
				width:rem(250);
				text-align: right;
				overflow: hidden;
				text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			&:last-child{
				border-bottom:none;
			}
		}
		.nobottom{
			border-bottom:none;
		}
	}
	
</style>