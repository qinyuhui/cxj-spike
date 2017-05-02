<template>
	<div class="seckill-pay-success-index">	
		<seckill-success></seckill-success>
	</div>
</template>

<script>
import Vue from 'vue';
import '../../utils/remset';
import vueResource from 'vue-resource';
Vue.use(vueResource);
	import seckillSuccess from './seckill-success';
	
	export default {
		components: {
			seckillSuccess
		}
	}

	
</script>

<style lang="scss" >
@import "../../assets/css/reset.scss";
@import "../../assets/css/common.scss";
@import '../../assets/css/_functions.scss';
@import '../../assets/css/_variables.scss';
	
</style>