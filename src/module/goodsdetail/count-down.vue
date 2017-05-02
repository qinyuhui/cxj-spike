<template>
	<div class="count-down">
		<!--<div class="residual-time">
			<span>{{ msgTime }}</span>
			<em>{{ hours }}</em>
			<span>时</span>
			<em>{{ minute }}</em>
			<span>分</span>
			<em>{{ second }}</em>
			<span>秒</span>
		</div>-->
		<div class="buy-btn" @click="post()" ca="P_{{goodsName}}$立即购买"> <!-- fail -->
			立即购买
		</div>
	</div>
</template>


<script type="text/javascript">
import common from '../../utils/common';
import { Toast } from 'mint-ui';
export default{

	data:function(){
		return{
			hours:'00',
			minute:'00',
			second:'00',
			isBuy:false, //是否购买过 
			limitNum:0, // 限购数 1
			buied:-1, // 已买数 1
			selled:1, //已售 1
			total:0,// 商品总数 1
			stock:10, //库存 1
			msg:'',
			fail:true, // class 
			activeEnd:false, //活动是否结束
			activeStart:false, // 活动是否开始
			msgTime:'剩余时间',
			activityId:'',
			goodsName:''
		}
	},
	methods:{
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
		},
		toNum:function(num){
			if (num < 10) {
		            return "0" + parseInt(num)
		        }
		    return parseInt(num)
		},
		post:function(){
			//如果没有登录
			if (this.buied<0) {
				// 就去登录
				LoginJS.checkLogin(
					function(data) {
						console.log('已登录');
					},
					"",
					function() {
					});

			}else{
				var that=this;
				if (!this.fail) {
					//参数提交
					this.$http.post(common.isdev() +'/prmtcenter/seckill/execute.json',{
							activityId:this.activityId
						}).then(function(d){
							d=d.json();
							var code=d.code;
							if(code=="2001"){
								window.location.href="confirm"+common.env()+"?activityId="+that.activityId;
							}else if(code=="2005"){
								Toast("库存不足");
							}
						});
				}else{
					return false;
				};
			}
			
		}
	},
	events:{
		sendData:function(msg){
			this.limitNum=msg.maxCount;
			this.total=msg.goodsAmount;
			if(this.buied>=this.limitNum){ //并且购买数大于或等于购买限制数
				if(this.activeEnd){
					this.msg="活动结束";
				}else{
					this.msg="不能再买咯";
				}
				this.fail=true;
			}
			this.goodsName=msg.goodsName;
			
		},
		sendSurplus:function(d){
			this.stock=d;
			this.selled=this.total-this.stock;
		},
		sendBuied:function(d){
			this.buied=parseInt(d);
			if (this.buied>0) {
				this.msg="再次购买";
				this.isBuy=true;
			}else{
				this.isBuy=false;
				this.msg="立即购买";
			};
			if(this.buied>=this.limitNum){ //并且购买数大于或等于购买限制数
				if(this.activeEnd){
					this.msg="活动结束";
				}else{
					this.msg="不能再买咯";
				}
				this.fail=true;
			}
		},
		sendId:function(id){
			this.activityId=id;
		},
		sendTime:function(d){
			
			var that=this;
			// 开始 当前 结束
			var s=that.toData(d[0],d[1]).seconds;
			var wc=0; //如果活动还没开始 记录一下开始时间到当前时间的时间差 开始活动的时候 要减去这个时间差  

			
			var endS=that.toData(d[2],d[1]).seconds;
			if(endS>0){
				this.msg="活动结束";
				this.activeEnd=true;
			}else{
				this.activeEnd=false;
			}
			//如果活动还没开始
			if(s<0){
				this.activeStart=false;
			 	s=that.toData(d[1],d[0]).seconds;
			 	wc=that.toData(d[1],d[0]).seconds;
			}else{ //如果活动开始了
				this.activeStart=true;
				s=that.toData(d[1],d[2]).seconds;
			};

			setInterval(function(){
				s--;
				if(s<=0){
					//如果活动还没开始
					if(!that.activeStart){
						that.activeStart=true; // 那就开始活动
						s=that.toData(d[1],d[2]).seconds-wc;
					}else{
						//如果活动开始了 那就结束活动
						that.activeEnd=true;
						s=0;
					}
				}
				
				var day=Math.floor(s/(60*60*24)); 
				var hour=Math.floor((s-day*24*60*60)/3600);
				var hours=hour+day*24;
				var minute=Math.floor((s-day*24*60*60-hour*3600)/60); 
				var second=Math.floor((s-day*24*60*60-hour*3600)-minute*60);

				that.hours=that.toNum(hours);
				that.minute=that.toNum(minute);
				that.second=that.toNum(second);
			},1000);

			// 如果活动还没开始
			if(!this.activeStart){
				this.msg="即将开始";
				this.fail=true;
				this.msgTime='距开始时间';
			}else{ //活动开始了
				this.fail=false;
				this.msgTime='剩余时间';
				// 如果活动结束了
				if(this.activeEnd){
					this.msg="活动结束";
					this.fail=true;
				}else{ //活动没有结束
					//如果库存大于0
					
					if(this.stock>0){
						
						if(this.buied>=this.limitNum){ //并且购买数大于或等于购买限制数
							if(this.activeEnd){
								this.msg="活动结束";
							}else{
								this.msg="不能再买咯";
							}
							this.fail=true;
						}else{ //用户还能买
							
							//如果用户未购买
							if(!this.isBuy){
								this.msg="立即购买";
							}else{ //如果用户购买过
								this.msg="再次购买";
							}
							this.fail=false;
						}
					}else{ // 没有库存了

						this.msg="秒光了";
						this.fail=true;
					}
				}
			}
			
		},
		
	}, 
	watch: {
	    'activeStart': function () {
	      // 如果活动还没开始
			if(!this.activeStart){
				this.msg="即将开始";
				this.fail=true;
				this.msgTime='距开始时间';
			}else{ //活动开始了
				this.fail=false;
				this.msgTime='剩余时间';
				// 如果活动结束了
				if(this.activeEnd){
					this.msg="活动结束";
					this.fail=true;
				}else{ //活动没有结束

					//如果库存大于0
					if(this.stock>0){
						if(this.buied>=this.limitNum){ //并且购买数大于或等于购买限制数
							if(this.activeEnd){
								this.msg="活动结束";
							}else{

								this.msg="不能再买咯";
							}
							
							this.fail=true;
						}else{ //用户还能买
							
							//如果用户未购买
							if(!this.isBuy){
								this.msg="立即购买";
							}else{ //如果用户购买过
								this.msg="再次购买";
							}
							this.fail=false;
						}
					}else{ // 没有库存了
						this.msg="秒光了";
						this.fail=true;
					}
				}
			}
	    },
	    
	    'buied':function(){
			if (this.buied>0) {
				this.msg="再次购买";
				this.isBuy=true;
			}else{
				this.isBuy=false;
				this.msg="立即购买";
			};
			if(this.buied>=this.limitNum){ //并且购买数大于或等于购买限制数
				if (this.activeEnd) {
					this.msg="活动结束";
				}else{

					this.msg="不能再买咯";
				};
				
				this.fail=true;
			}
	    },
	    'limitNum':function(){
	    	if(this.buied>=this.limitNum){
	    		if(this.stock>0){
	    			if(this.activeEnd){
		    			this.msg="活动结束";
		    		}else{
		    			this.msg="不能再买咯";
		    		}
	    		}else{
	    			this.msg="秒光了";
	    		}
				this.fail=true;
			}
	    },
	    'activeEnd':function(){
	    	if(this.activeEnd){
				this.msg="活动结束";
				this.fail=true;
			}
	    }

	},    
	ready:function(){
		
	}
}

</script>

<style lang="scss">
	@import '../../assets/css/_functions.scss';
	@import '../../assets/css/_variables.scss';
	@import "../../assets/css/toast.scss";
	.count-down {
		font-size: rem(14);
		width: 100%;
		height: rem(48);
		background:#fff;
		border-top:rem(1) solid #eee;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		/*display: flex;*/
		.residual-time{
			width: rem(255);
			height: rem(48);
			font-size: rem(14);
			color: $_333;
			line-height: rem(48);
			text-align: left;
			padding-left:rem(15);
			display:inline-block;
			em {
				width: rem(21);
				height: rem(21);
				background:#333;
				color:#fff;
				font-size: rem(14);
				text-align: center;
				line-height: rem(21);
				border-radius: rem(5);
				display:inline-block;
				white-space:nowrap;

				&:first-of-type{
					padding: 0 rem(2);
					width:auto !important;
					
				}

			}
		}
		.buy-btn{
			/*width: rem(120);*/
			height: rem(48);
			line-height: rem(48);
			text-align: center;
			background:#ff6600;
			color:#fff;
			font-size: rem(18);
			&.fail{
				background:#ccc;
			}
		}
	}


</style>




















