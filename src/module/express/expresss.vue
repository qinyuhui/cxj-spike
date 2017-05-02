<template><!-- ../../assets/images/carsmall.jpg -->
	<div class="head h_box"><img :src="imgurl" class="goodImg flex_1">
      <div class="goodInfo flex_1">
        <p>物流状态:<span>{{deliveryStatus}}</span></p>
        <p>物流公司:<span>{{deliveryCompanyName}}</span></p>
        <p>运单编号:<span>{{deliveryNo}}</span></p>
      </div>
    </div>
    <div class="cross"></div>
    <div class="order_container">
      <h1>数据由物流100提供</h1>	
      <ul class="flex_1">
        <li class="line" v-for=" i in  deliveryArr">
          <label>{{i.context}}</label>
          <div class="time">{{i.time}}</div>
        </li>
      </ul>
    </div>
 
</template>
<script type="text/javascript">
	import Vue from 'vue';
	import VueResource from 'vue-resource';
	import '../../utils/remset';
	import common from '../../utils/common';
	console.log(common.isdev());
	Vue.use(VueResource);
	Vue.http.options.emulateJSON = true;

export default {
	data:function(){
		return{
			orderNumber:'161107101001002224000', //订单编号xsxsxs
			orderType:'',
			deliveryCompanyName:'',// 物流公司
			deliveryNo:'543174133', //物流单号
			deliveryArr:[], // 物流文字数组
			deliveryStatus:'', // 物流状态
			imgurl:''

		}
	},
	methods:{
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		}
	},
	ready:function(){ 
		this.orderNumber=this.getQueryString('orderid');
		this.orderType=this.getQueryString('orderType');
		var that=this;

		this.$http.post(common.isdev()+'/prmtcenter/orderDetail/queryDeliveryInfo.htm',{"orderCode":that.orderNumber,"orderType":that.orderType?that.orderType:'0'}).then(function (d) {
			d=d.json();
			if(d.isSuccess){
				var dd=d.data;
				console.log(dd);
				console.log(that.orderNumber);
				if(dd.deliveryCompanyName){
					that.deliveryCompanyName=dd.deliveryCompanyName;
				}else{
					var url=location.href;
					if(url.indexOf('sit')!=-1){
						location.href='//h.jia.chexiangsit.com/errorMsg404.htm?code=404';
					}else if(url.indexOf('chexiangpre')!=-1){
						location.href='//h.jia.chexiangpre.com/errorMsg404.htm?code=404';
					}else if(url.indexOf('chexiang')!=-1){
						location.href='//h.jia.chexiang.com/errorMsg404.htm?code=404';
					}
				}
				
				that.deliveryNo=dd.deliveryInfo.deliveryNo;
				that.deliveryArr=dd.deliveryInfo.deliveryRecordItemVOList;
				var status=dd.deliveryInfo.deliveryStatus;
				switch(status){
					case 0:
					that.deliveryStatus='在途';
					break;
					case 1:
					that.deliveryStatus='揽件';
					break;
					case 2:
					that.deliveryStatus='疑难';
					break;
					case 3:
					that.deliveryStatus='签收';
					break;
					case 4:
					that.deliveryStatus='退签';
					break;
					case 5:
					that.deliveryStatus='派件';
					break;
					case 6:
					that.deliveryStatus='退回';
					break;
					// 0 在途 1：揽件 2：疑难 3：签收 4：退签 5：派件 6：退回

				}
			}
		});	

		that.$http.post(common.isdev()+'/prmtcenter/orderDetail/info.htm',{"orderCode":this.orderNumber}).then(function (d) {
			d=d.json();
			if(d.data.orderInfo){
				that.imgurl=d.data.imageUrl+d.data.orderInfo.orderItemList[0].mdseUrl.substr(1);
			}
			
		});

	}
}


</script>
<style lang="scss" >
@import "../../assets/css/reset.scss";
@import "../../assets/css/common.scss";
@import '../../assets/css/_functions.scss';
@import '../../assets/css/_variables.scss';
.h_box{display:-webkit-box;display:flex;width:100%;}
.flex_1{-webkit-box-flex:1;box-flex:1;}
.head{
	padding: rem(15) rem(15);
	background: $_fff;
	.goodImg{
		display: inline-block;
		width: rem(70);
		height: rem(70);
		border: 1px solid #ccc;
		margin-right: rem(10);
	}
	.goodInfo{
		p{
			font-size: rem(13);
			line-height: rem(19);
			color: $_999 
		}
		p:first-child{
			color: $_333;
			span{
				color:#25ae5f;
			}
		}
		span{
			margin-left: rem(9);
		}
	}
}
.cross{
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	height: rem(15);
	background: $_eee;
}
.order_container{
	background: $_fff;
	h1{
		height: rem(44);
		line-height: rem(44);
		font-size: rem(14);
		color:#000; 
		border-bottom: 1px solid $_eee;
		padding-left: rem(15);
		width:100%;  
	}
	ul.flex_1{
		padding: 0 rem(35) 0 rem(30);
		margin-top: rem(12);
		width:100%;
		overflow: hidden;
	}
	.line{
		margin-bottom: rem(10); 
		line-height: 1;
		position: relative;
		font-size: rem(13);
		padding-left: rem(15); 
		color:$_999;
		&:last-child{
			margin-bottom: 0; 
		}
		&:first-child{
			label{
				color: #000;
			}
			&:before{
				width: rem(10);
				height: rem(10);
				border: rem(2) solid #b9e5cc;;
				background:#25ae5f;
				left: -1.2rem;
				z-index: 1;
				top: 0.3rem;
			}
		}
		label{
			display: block;
			margin-bottom: rem(10);
			line-height: rem(20); 
		}
		.time{
			padding-bottom: rem(10);
			border-bottom: 1px solid $_eee;

		}
		&:last-child{
			.time{
				border-bottom: none;
			}
		}
		&:before{
			content: "";
			position: absolute;
			width: rem(10);
			height: rem(10);
			border-radius: 50%;
			background: #ccc;
			left: -1.02rem;
			top: 0.39rem;
		}
		&:after{
			width: 1px;
			background: #e8e8e8;
			height: 100%;
			position: absolute;
			content: "";
			left: -.554rem;
			top:1.4rem;
		}
	}
	.last{
		&:after{
			width: 0px;
		}
	}
	.active{
		label{
			color: #000;
		}
		&:before{
			width: rem(10);
			height: rem(10);
			border: rem(2) solid #b9e5cc;;
			background:#25ae5f;
			left: -1.2rem;
			z-index: 1;
			top: 0.3rem;
		}
	}
}

</style>	