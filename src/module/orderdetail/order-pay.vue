<template>
	
	<div class="order-pay" v-if="isTrue"><!-- -->
		<!-- 如果是未支付 -->
		<div class="wrap" v-if="orderStatus==1">  <!--  -->
			<div class="pay-l">
				请在<span>{{date}}分钟</span>内完成付款		

				<!-- <p>付款剩余时间</p>
				<div class="residual-time">
					<em>{{ hours }}</em>
					<span>时</span>
					<em>{{ minute }}</em>
					<span>分</span>
					<em>{{ second }}</em>
					<span>秒</span>
				</div> -->
			</div>
			<span class="pay-c" @click="cancel" ca="P_秒杀订单详情$取消订单">取消订单</span>
			<span class="pay-r" @click="payment" ca="P_秒杀订单详情$立即支付">立即支付</span><!--  立即支付-->
		</div>

		<!-- 如果是已支付或者已完成 并且 已发货    (this.orderStatus==4||this.orderStatus==5)&&this.deliver==3 -->  
		<div @click="send()" class="logistics" v-if="this.deliver==3">
			查看物流
		</div>
	</div>
	

	<div class="mask-wrap" v-show="show">
		<div class="box">
			<p>交易未完成，是否要取消订单</p>
			<div class="box-b">
				<span @click="no">否</span>
				<span @click="yes">是</span>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

import common from '../../utils/common';
import { Toast } from 'mint-ui';
export default {
	data:function(){
		return{
			orderNumber:'', //订单编号
			orderStatus:0, //订单状态
			deliver:0,  //发货状态
			show:false,
			hours:'00',
			minute:'00',
			second:'00',
			isTrue:true,
			aaa:true,
			ps:true,
			orderHeadCode:'',
			tk:'', // 退款
			date:'00'



		}
	},
	methods:{
		cancel:function(){
			this.show=true;
		},
		no:function(){
			this.show=false;
		},
		yes:function(){ // 取消订单
			//数据提交  ?=161104999999002223956 common.isdev()+
			var that=this;
			this.$http.post(common.isdev()+'/prmtcenter/orderDetail/cancle.json',{"orderHeadCode":this.orderHeadCode}).then(function (d) {
				d=d.json();
				if(d.isSuccess){
					that.isTrue=false;
					that.$parent.$refs.num.orderFont="已取消";
					that.$parent.$refs.num.gray=true;
					that.$parent.$refs.num.f60=false;
					that.$parent.$refs.num.blue=false;
				}else{
					Toast(d.message);
					window.location.reload()
				}
			});
			//确认取消框
			this.show=false;
		},
		payment:function () {
			var id=this.orderHeadCode;
			var submitForm = "<form id = \"paymentForm\" action=\"" + common.isdev()+"/payment/toAlipay.htm\" method=\"post\" style=\"display:none\">" + "<input name=\"orderHeadCode\" value="+id+" type=\"hidden\" />"  + "</form>";
			$(submitForm).appendTo(document.body).submit();
		},
		toNum:function(num){
			return num<10?'0'+num:num;
		},
		send:function(){
			window.location.href="express"+common.env()+"?orderid="+this.orderNumber;
		},
		dataNumber:function(time){
			var time = time.substring(0,19);    
			time = time.replace(/-/g,'/'); 
			var timestamp = new Date(time).getTime();
			return timestamp;
		},
		toData:function(startData,endData){
			var startData=this.dataNumber(startData);
			var endData=this.dataNumber(endData);
			var seconds=(endData-startData)/1000;
			return {
				seconds
			}
		}
	},
	events:{
		sendNumber:function(d){
			this.orderNumber=d;
		},
		sendPs:function(d){
			this.ps=d;
		},
		sendDatas:function(d){
			this.orderStatus=d.status;
			//this.orderNumber=d.logisticsInfo.orderCode;
			
			//如果需要配送
			if(this.ps){
				this.deliver=d.logisticsInfo.distributionStatus;
			};
			this.tk=d.executionStatus?d.executionStatus:'';
			//this.deliver=d.logisticsInfo.distributionStatus;
			this.orderHeadCode=d.orderHeadCode;
			// 如果未支付
			// if(this.orderStatus==1){
			// 	this.isTrue==true;
			// //如果已支付或者已完成 并且已发货
			// }else if((this.orderStatus==4||5)&&this.deliver==3){
			// 	this.isTrue==true;
			// }else{
			// 	this.isTrue=false;
			// };
		},
		sendTime:function(d){
			var that=this;
			var s=that.toData(d[0],d[1]).seconds;  // 0是now 1是end

			var day1=Math.floor(s/(60*60*24)); 
			var hour1=Math.floor((s-day1*24*60*60)/3600);
			var hours1=hour1+day1*24;
			var minute1=Math.floor((s-day1*24*60*60-hour1*3600)/60); 
			var second1=Math.floor(s-day1*24*60*60-hour1*3600-minute1*60); 
			if(second1>30){
				this.date=day1*3600+hours1*60+minute1+1;
			}else{
				this.date=day1*3600+hours1*60+minute1;
			}
			
			//如果时间小于0  说明不能支付了 订单取消了 或者已经支付发了物流了
			console.log(this.orderStatus +"订单状态");
			console.log(this.deliver +"物流状态");
			if(s<=0){
				console.log("33333333");
				// 如果未支付
				if(this.orderStatus==1){
					that.isTrue=false;
					that.$parent.$refs.num.orderFont="已取消";
					that.$parent.$refs.num.gray=true;
					that.$parent.$refs.num.f60=false;
					that.$parent.$refs.num.blue=false;
				//如果已支付或者已完成 并且已发货 这里是有物流的 
				}else if((this.orderStatus==4||this.orderStatus==5)&&this.deliver==3){
					console.log("11111111111");
					this.isTrue=true;
				}else{// 那就是已取消了
					console.log("2222222");
					this.isTrue=false;
				};

				console.log(this.isTrue);

				// if(this.orderStatus==1){
				// 	that.isTrue=false;
				// 	that.$parent.$refs.num.orderFont="已取消";
				// 	that.$parent.$refs.num.gray=true;
				// 	that.$parent.$refs.num.f60=false;
				// 	that.$parent.$refs.num.blue=false;
				// }
				
				
			}else{ //时间大于0 说明还需要支付
				console.log("444444");

				//如果订单是未支付状态就倒计时  这里是有倒计时的
				if(this.orderStatus==1){
					that.isTrue=true;
					setInterval(function(){
						s--;
						if(s<=0){
							s=0; 
							that.isTrue=false;
							that.$parent.$refs.num.orderFont="已取消";
							that.$parent.$refs.num.gray=true;
							that.$parent.$refs.num.f60=false;
							that.$parent.$refs.num.blue=false;
						}
						var day=Math.floor(s/(60*60*24)); 
						var hour=Math.floor((s-day*24*60*60)/3600);
						var hours=hour+day*24;
						var minute=Math.floor((s-day*24*60*60-hour*3600)/60); 
						var second=Math.floor(s-day*24*60*60-hour*3600-minute*60); 
						

						that.hours=that.toNum(hours);
						that.minute=that.toNum(minute);
						that.second=that.toNum(second);
					},1000);
					console.log("555555");
					console.log(this.isTrue);
				//如果已支付或者已完成 并且已发货 这里是有物流的 
				}else if((this.orderStatus==4||this.orderStatus==5)&&this.deliver==3){
					console.log("11111111111");
					this.isTrue=true;
				}else{// 那就是已取消了
					console.log("2222222");
					this.isTrue=false;
				};
				
			}

			
			
		}
		
	},
	watch:{
		'isTrue':function(){
			this.isTrue=this.isTrue;
		}
	},
	ready:function(){

	}
	  

}
	

</script>


<style lang="scss">
	@import "../../assets/css/_functions.scss";	
	@import "../../assets/css/_variables.scss";	
	@import "../../assets/css/toast.scss";
	.order-pay{
		position: fixed;
		bottom: 0;
		width: rem(375);
		height: rem(48);
		background:#ffffff;
		box-shadow:0px 0px 0px 0px #c8c7cc;
		display: flex;
		justify-content:flex-end;
		.wrap{
			display: flex;
			justify-content:flex-start;
			// .pay-l{
			// 	width: rem(150);
			// 	padding-left: rem(12);
			// 	overflow: hidden;
			// 	p{
			// 		font-size:rem(13);
			// 		color:#333333;
			// 		margin-top: rem(6);
			// 		line-height: rem(15);
			// 		margin-bottom: rem(3);
			// 	}
			// 	.residual-time{
			// 		width: rem(153);
			// 		font-size: rem(14);
			// 		color: $_333;
			// 		text-align: left;
			// 		display:inline-block;
			// 		em {
			// 			color:#ff6600;
			// 			font-size: rem(13);
			// 			text-align: left;
			// 			line-height: rem(21);
			// 			border-radius: rem(5);
			// 			display:inline-block;

			// 		}
			// 	}
			// }
			.pay-l{
				width: rem(152);
				text-align: center;
				align-items:center;
				font-size: rem(13);
				height: rem(48);
				line-height: rem(48);
				color:#333;
				>span{
					color:#ff6600;
				}
			}
			.pay-c,.pay-r{	
				display:block;
				color: #fff;
				width: rem(111);
				height: rem(48);
				line-height: rem(48);
				font-size: rem(18);
				text-align: center;
			}
			.pay-c{
				background:#999999;
			}
			.pay-r{
				background:#ff6600;
			}
		}
		.logistics{
			display:block;
			color: #fff;
			width: rem(111);
			height: rem(48);
			line-height: rem(48);
			font-size: rem(18);
			text-align: center;
			background:#0299f6;
			cursor: pointer;
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