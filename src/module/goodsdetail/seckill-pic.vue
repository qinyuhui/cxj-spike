<template>
	<div class="seckill-pic">
		<img :src="pic" >
	</div>
</template>

<script>
	export default {
		data:function(){
			return{
				pic:''
			}
		},
		events:{
			sendData:function(d){
				this.pic=d.mainImage;

			}
		}
	}
</script>

<style lang="scss">

	@import '../../assets/css/_variables.scss';
	@import '../../assets/css/_functions.scss';
	.seckill-pic{
		display: flex;
		justify-content: center;
		align-content: center;
		background: #fff;
		width:rem(375);
		min-height:rem(250);
		align-items:center;
		overflow: hidden;
		&>img{
			display:block;
			max-width: 100%;
		}
	}
	
	
</style>