<template>
	<div class="express">
		<expresss></expresss>
	</div>
</template>

<script>
	
	import expresss from './expresss';
	
	export default {
		components: {
			expresss
		},
		ready:function(){
			LoginJS.checkLogin(
					function(data) {
						//console.log('aaa');
					},
					"",
				function() {
				});
		}
	}

	
</script>

<style lang="scss" scoped>
	
</style>