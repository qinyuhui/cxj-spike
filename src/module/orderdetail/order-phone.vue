<template>
	<div class="order-phone">
		客服电话 <a href="tel:4008 020 666"> 4008 020 666</a>
	</div>
		
</template>

<script type="text/javascript">

export default {
	  methods: {
	  	
	  }
}
	

</script>


<style lang="scss">
	@import "../../assets/css/_functions.scss";	
	@import "../../assets/css/_variables.scss";	
	.order-phone{
		display: flex;
		justify-content:center;
		font-size:rem(13);
		line-height: rem(50);
		color:#666666;
		a{
			margin-left: rem(3);
			color:#03a9f4;
		}

	}
	
</style>