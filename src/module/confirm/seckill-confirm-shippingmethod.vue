<template>
    <div class="normal-bg mt15 normal-bg-bottom" v-if=expressFlag>
       <p ><span>配送方式</span><span>全国包邮</span></p>
       <p><span>付款方式</span><span>在线支付</span></p>
	</div>
	<div class="normal-bg mt15  no-express" v-else>
       <p><span>付款方式</span><span>在线支付</span></p>
	</div>
</template>
<script >
	export default {
		data:function () {
			return {
				expressFlag:true
			}
		}
	}
</script>

	<style lang="scss" scoped>
	@import '../../assets/css/_functions.scss';
	@import '../../assets/css/_variables.scss';
	
  
	.normal-bg{
       background-color: $_fff;
       padding: rem(14) rem(15);
       font-size: rem(14);
	}
   
    .normal-bg-bottom{
    	padding-right: 0;
    }
    .normal-bg-bottom p{clear: both;overflow: hidden;}
    .normal-bg-bottom p:nth-child(1){
    	border-bottom: 1px solid #dedede;
    	padding-bottom: rem(15);
    }
    .normal-bg-bottom p:nth-child(2){
    	padding-top: rem(15);
    }
    .no-express{
    	overflow: hidden;
    }
    .no-express p span{
    	display: block;
    }
    .no-express p span:nth-child(1){
    	float: left;
    	
    }
    .no-express p span:nth-child(2){
    	float: right;
    }
    .normal-bg-bottom p span:nth-child(2){
    	float: right;
    	margin-right: rem(15);
    }
    .gray{
    	color: $_999;
    }

</style>