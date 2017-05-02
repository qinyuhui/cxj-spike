<template>
	<div class="card-buy-index" id="order-detail" style="display: none;">
		<order-number v-ref:num></order-number>
		<order-address></order-address>
		<order-price></order-price>
		<order-detail></order-detail>
		<order-phone></order-phone>
		<order-pay ></order-pay>
	</div>
</template>

<script>

	import orderNumber from './order-number';
	import orderAddress from './order-address';
	import orderPrice from './order-price';
	import orderDetail from './order-detail';
	import orderPhone from './order-phone';
	import orderPay from './order-pay';

	import Vue from 'vue';
	import VueResource from 'vue-resource';
	import common from '../../utils/common';
	import '../../utils/remset';
	Vue.use(VueResource);
	Vue.http.options.emulateJSON = true;

	


	export default {
		  data:function(){
		  	return{
		  		time:[],
		  		datas:[],
		  		logisticsInfo:[],
		  		imgurl:'',
		  		orderNumber:'',
		  		ps:true
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
		  components: {
		  	orderNumber,
		  	orderAddress,
		  	orderPrice,
		  	orderDetail,
		  	orderPhone,
		  	orderPay
		  },
		  ready:function(){
		  		LoginJS.checkLogin(
					function(data) {
						console.log('aaa');
					},
					"",
				function() {
				});

		  		var that=this;
			  	this.orderNumber=this.getQueryString('orderid');
			  	this.$broadcast('sendNumber', this.orderNumber);

			  	this.$http.post(common.isdev()+'/prmtcenter/orderDetail/info.htm',{"orderCode":this.orderNumber}).then(function (d) {
			  		d=d.json();
			  		if (d.isSuccess==true) {
			  			if(d.data.orderInfo){
			  				that.datas=d.data.orderInfo;
							that.imgurl=d.data.imageUrl;
							if(that.datas.logisticsInfo){
								that.logisticsInfo=that.datas.logisticsInfo;
								that.ps=true;
							}else{
								that.ps=false;
							}
							var endTime=that.datas.deadlineTime;
							var nowTime=d.data.currentDate;
							that.time.push(nowTime,endTime);
							
							
							that.$broadcast('sendPs', that.ps);
	
							that.$broadcast('sendDatas', that.datas);
							that.$broadcast('sendTime', that.time);
							
							that.$broadcast('sendAddress', that.logisticsInfo);
							that.$broadcast('sendImgurl', that.imgurl);
			  			}else if(typeof d.data.orderInfo=='undefined'){
					  			var url=location.href;
								if(url.indexOf('sit')!=-1){
									location.href='//h.jia.chexiangsit.com/errorMsg404.htm?code=404&msg=订单ID解析异常';
								}else if(url.indexOf('chexiangpre')!=-1){
									location.href='//h.jia.chexiangpre.com/errorMsg404.htm?code=404&msg=订单ID解析异常';
								}else if(url.indexOf('chexiang')!=-1){
									location.href='//h.jia.chexiang.com/errorMsg404.htm?code=404&msg=订单ID解析异常';
								}
					  		};
			  			
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

</style>
