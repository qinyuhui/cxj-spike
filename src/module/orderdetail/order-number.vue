<template>
	<div class="order-number mt16">
		<div class="order-l">
			<p>订单编号：</p><span>{{orderNumber}}</span>
		</div>
		<div class="order-r" v-bind:class="{ 'f60': f60, 'blue': blue, 'gray': gray }">{{orderFont}}</div>
	</div>
		
</template>

<script type="text/javascript">

export default {
	data:function(){
		return{
			orderNumber:'', //订单编号
			orderStatus:1, //订单状态
			orderFont:'未支付',
			deliver:1,  //发货状态
			f60:false,
			blue:false,
			gray:false,
			ps:true, // 配送
			tk:''  // 退款

		}
	},
	ready:function(){
		
	},
	events:{
		sendNumber:function(d){
			this.orderNumber=d;
		},
		sendPs:function(d){
			this.ps=d;
		},
		sendDatas:function(d){
			console.log(d);
			//如果需要配送
			if(this.ps){
				if(d.logisticsInfo){
					this.deliver=d.logisticsInfo.distributionStatus;
				}
				
			}

			this.tk=d.executionStatus?d.executionStatus:'';


			//this.orderNumber=d.logisticsInfo.orderCode;
			this.orderStatus=d.status;
//			this.deliver=d.logisticsInfo.distributionStatus;
			switch(this.orderStatus)
			{
				case 1:
				  this.orderFont="待支付";
				  this.f60=true;
				  break;
				case 3:
				  this.orderFont="已取消";
				  this.gray=true;
				  break; 
				case 4: //已支付
				  this.blue=true;
				  //如果要配送
				  if (this.ps) {
				  		switch(this.tk){ // 已支付的退款状态
					  	case '':
						  	switch(this.deliver){
							  case 1:
							  	this.orderFont="未发货";
							  	break;
							  case 2:
							  	this.orderFont="备货中";
							  	break; 
							  case 3:
							  	this.orderFont="已发货";
							  	break;		 
						  }
						  break;
						case 8:
						  this.orderFont="退款中";
						  break;
						case 9:
						  this.orderFont="退款成功";
					      break;	
					  }
				  }else{
				  	this.orderFont="已完成";
				  }
				  
				  break;
				case 5:
					  this.blue=true;
					  //如果要配送
					  if (this.ps) {
						  	switch(this.tk){  // 已发货的退款状态
						  	case '':
							  this.orderFont="已发货";
							break;
							case 8:
							  this.orderFont="退款中";
							  break;
							case 9:
							  this.orderFont="退款成功";
						      break;	
						  }
					 }else{
					 	this.orderFont="已完成";
					 };
					 break;
					  
			}
		}
		
	}
	  
}
	

</script>


<style lang="scss">
	@import "../../assets/css/_functions.scss";	
	@import "../../assets/css/_variables.scss";	
	.order-number{
		width: rem(375);
		height: rem(44);
		line-height: rem(44);
		background: #fff;
		padding: 0 rem(15);
		font-size:rem(14);
		color:#333333;
		display: flex;
		justify-content:space-between;
		.order-l{
			display: flex;
			justify-content:flex-start;

		}
		.order-r{
			color:#ff6600;
		}
		.gray{
			color:#666 !important;
		}
		.f60{
			color:#ff6600 !important;
		}
		.blue{
			color:#0299f6 !important;
		}

	}
	
</style>