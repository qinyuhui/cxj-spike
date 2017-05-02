<template>
	<div class="white-bg mt15">
		<div class="list-bg" @click='showContent' ca="P_秒杀确认订单$发票"><span>需要发票</span><span class="gray">发货30天后，寄送到收货地址<i class="radio iconfont icon-checked" :class='{"active":showContentFlag}'></i></span></div>
		<div class="ticket-content" v-show='showContentFlag'>
			<div class="tab">
				<div @click='personal' :class="{'active':personalClassFlag}">个人</div>
				<div :class="{'active':companyClassFlag}" @click='company'>公司</div>
			</div>
			<div class="list-bg no-border-b" v-show='showCompanyNameFlag'><input type="text" class="base-ipt" placeholder="请输入公司名称" v-model='companyName' @input='writeAddress' maxlength="100" /></div>
		</div>

	</div>
</template>
<script>
	export default {
		data() {
				return {
					showCompanyNameFlag: false,
					companyClassFlag: false,
					personalClassFlag: true,
					showContentFlag:false,
					invoiceType:'',
					companyName:'',
					content:'',
					idNeedVoice:'0'
				}
			},
			methods: {
				company: function() {
					this.showCompanyNameFlag = true;
					this.companyClassFlag = true;
					this.personalClassFlag = false;
					this.invoiceType='2';
					this.idNeedVoice='1';
					
					this.$dispatch('invoiceTypeEvent',this.invoiceType);
					
					this.$dispatch('idNeedVoiceEvent',this.idNeedVoice);
					

				},
				personal: function() {
					this.showCompanyNameFlag = false;
					this.personalClassFlag = true;
					this.companyClassFlag = false;
					this.invoiceType='1';
					this.idNeedVoice='1';
					this.$dispatch('invoiceTypeEvent',this.invoiceType);
					this.$dispatch('idNeedVoiceEvent',this.idNeedVoice);
				},
				writeAddress:function () {
					var s = /^[\da-zA-Z\u4E00-\u9FA5()（）]{1,50}$/;
					if(!s.test(this.companyName)){
						this.companyName=this.companyName.slice(0,this.companyName.length-1);
					}
					this.$dispatch('companyNameEvent',this.companyName);
				},
				showContent:function () {
					this.showContentFlag=!this.showContentFlag;
					if(this.showContentFlag){
						this.invoiceType='1';
						this.idNeedVoice='1';
						this.personalClassFlag = true;
						this.companyClassFlag = false;
						this.showCompanyNameFlag=false;
					}else{
						this.invoiceType='';
						this.idNeedVoice='0';
						this.personalClassFlag =false;
						this.companyClassFlag = false;
						this.showCompanyNameFlag=false;
					}
					this.$dispatch('invoiceTypeEvent',this.invoiceType);
					this.$dispatch('idNeedVoiceEvent',this.idNeedVoice);
					
				}
			},
			ready:function () {
					this.$dispatch('invoiceTypeEvent',this.invoiceType);
					this.$dispatch('companyNameEvent',this.companyName);
					this.$dispatch('idNeedVoiceEvent',this.idNeedVoice);
			}
	}
</script>
<style lang="scss" scoped>
	@import '../../assets/css/_functions.scss';
	@import '../../assets/css/_variables.scss';
	.white-bg {
		background-color: $_fff;
		margin-bottom: rem(60);
	}
	
	.gray {
		color: $_999;
	}
	
	.list-bg cite {
		display: inline-block;
		padding: rem(6) rem(10);
		background-color: #f4f4f4;
		color: $_333;
		border-radius: rem(5);
		font-size: rem(12);
		margin-right: rem(10);
	}
	
	.list-bg cite.active {
		display: inline-block;
		padding: rem(6) rem(10);
		background-color: #0299f6;
		color: $_fff;
		border-radius: rem(5);
	}
	
	.base-ipt {
		border: none;
		background: none;
		width: rem(345);
		color: #999;
		font-size: rem(14);
	}
	
	.list-bg {
		height: rem(44);
		background-color: $_fff;
		padding-left: 0;
		margin-left: rem(15);
		font-size: rem(14);

		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.tab {
		width: rem(360);
		height: rem(48);
		display: flex;
		align-items: center;
		border-top: 1px solid #dedede;
		margin-left: rem(15);
		div {
			width: rem(46);
			height: rem(28);
			line-height: rem(28);
			text-align: center;
			background: #f4f4f4;
			border-radius: rem(4);
			font-size: rem(12);
			&.active {
				background: #0299f6;
				color: #fff;
			}
		}
		div:nth-of-type(2){
			margin-left: rem(15);
		}
	}
	
	.small-pd {
		padding: rem(10) rem(15);
		padding-left: 0;
	}
	
	.fl-r {
		float: right;
	}
	
	i.radio {
		display: inline-block;
		width: rem(20);
		height: rem(20);
		line-height: rem(20);
		border: 1px solid $_999;
		border-radius: 100%;
		margin-left: rem(5);
	}
	
	i.active {
		background-color: #0299f6;
		border: 1px solid #0299f6;
	}
	
	.list-bg span {
		display: block;
		text-align: center;
		i {
			font-size: rem(14);
			color: #0299f6;
		}
	}
	
	.list-bg span:nth-of-type(2) {
		height: rem(44);
		display: flex;
		align-items: center;
		margin-right: rem(15);
		font-size: rem(13);
		i {
			color: #fff;
		}
	}
	
	.no-border-b {
		border-bottom: none;
	}
	
	.mt-3 {
		margin-top: rem(-3);
	}
</style>