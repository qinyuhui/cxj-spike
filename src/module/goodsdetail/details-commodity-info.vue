<template>
	<div class="details-commondity-info">
		<div>
			<!--<div class="details-commondity-info-title">{{title}}</div>-->
			<p class="details-commondity-info-content">{{{content}}}</p>
		</div>
	</div>
</template>

<script>
	export default{
		data () {
			return {
				title: '商品详情',
				content: '数据请求中...'
			}	
		},
		events: {
			sendData: function ( msg ) {
				this.content = msg.richText;
				//console.log(msg.richText);
			}
		}
	}
</script>

<style lang="scss">

@import '../../assets/css/_variables.scss';
@import '../../assets/css/_functions.scss';

	.details-commondity-info{
		margin-bottom: rem(48);
    padding-top: rem(20);
		background: $_fff;
		.details-commondity-info-title {
			line-height: rem(42);
			border-bottom: 1px solid $_eee;
			padding-left: rem(15);
			font-size: rem(14);
		}
		.details-commondity-info-content {
			font-size: rem(14);
			padding: rem(10) rem(14);
			line-height: rem(24);
			//text-indent: 2rem;
			p {
				overflow: hidden;
				img {
					width: 100%;
				}
			}
		}
	}

</style>
