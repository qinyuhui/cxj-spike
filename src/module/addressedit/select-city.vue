<template>
	<div class="input-wrap">
		<span class="input-name">所在地</span>
		<div class="city-wrap" @click="city()" id="userArea">
			<p class="city-value">{{cityValue[0]}}/{{cityValue[1]}}/{{cityValue[2]}}</p>
			<img src="../../assets/images/arrow.png">
		</div>
		<b v-if='areaFlag' style="right: 0.15rem;">请选择所在地</b>
	</div>
	<div class="select-city" @touchmove.prevent=''>
		<div class="city-top">
			<span class="city-cancel" @click="cancel">取消</span>
			<span class="city-finish" @click="finish">完成</span>
		</div>
		<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>

	</div>
	<div class="mask" @touchmove.prevent=''></div>
</template>

<script type="text/javascript">
	import Vue from 'vue';
	import {
		Picker
	} from 'mint-ui';
	Vue.component(Picker.name, Picker);

	//ajax
	import common from '../../utils/common';

	export default {
		events:{
			areaEvent:function (msg) {
				this.areaFlag=msg;
			}
		},
		methods: {
			cancel: function() {
				document.getElementsByClassName("mask")[0].style.display = "none";
				document.getElementsByClassName("select-city")[0].style.bottom = "-220px";
				
				var cityValueObj = document.getElementsByClassName("city-value")[0];
				let cityValue = cityValueObj.innerHTML;
				cityValueObj.innerHTML = cityValue;
				
				document.getElementById("loadImg").style.opacity = 1;

			},
			finish: function() {
				if(this.cityValue[0]=='台湾省'||this.cityValue[0]=='香港特别行政区'||this.cityValue[0]=='澳门特别行政区'){
					this.cityValue.length=1;
				}
				this.$dispatch('cityValueEvent', this.cityValue);
				this.$dispatch('chooseAddressCodeArrayEvent', this.chooseAddressCodeArray);
				document.getElementsByClassName("mask")[0].style.display = "none";
				let cityValue = document.getElementsByClassName("city-value")[0];
				document.getElementsByClassName("select-city")[0].style.bottom = "-220px";
				cityValue.innerHTML = this.cityValue;
				cityValue.style.color = "#333";
				document.getElementById("loadImg").style.opacity = 1;
				this.areaFlag=false;

			},
			city: function() {
				setTimeout(function () {
					document.getElementsByClassName("select-city")[0].style.bottom = "0";
					document.getElementsByClassName("mask")[0].style.display = "block";
					document.getElementById("loadImg").style.opacity = 0;
				},500)
				
			},
			getQueryString: function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r != null) return unescape(r[2]);
				return null;
			},

			onValuesChange(picker, values) {
				var self = this;

				this.cityValue = picker.getValues();
				var recity = []; //市
				var rearea = []; //区
				var cityArray = [];
				var areaArray = [];
				var proviceArray = this.province;
				
				//滑动省
				for(var i = 0; i < proviceArray.length; i++) {
					// 如果省的name和选中的name一样⁄
					if(proviceArray[i].regionName == picker.getSlotValue(0)) {
						var proviceCode = proviceArray[i].regionCode;
						var cityUrl = common.isdev() + '/prmtcenter/seckill/getDistrictAddr.json';
						var cityData = {
							"parentCode": proviceCode
						};

						this.$http.post(cityUrl, cityData).then(function(d) {
							d = d.json();
							self.chooseAddressCodeArray[0] = proviceCode;
							cityArray = JSON.parse(d.result);
							for(var j = 0; j < cityArray.length; j++) {
								//把选中的省对应的市添加到数组里面
								recity.push(cityArray[j].regionName);

								// 如果市的name和选中的name一样
								if(cityArray[j].regionName == picker.getSlotValue(1)) {
									var cityCode = cityArray[j].regionCode;
									var areaUrl = common.isdev() + '/prmtcenter/seckill/getDistrictAddr.json';
									var areaData = {
										"parentCode": cityCode
									};

									this.$http.post(areaUrl, areaData).then(function(d) {
										d = d.json();
										areaArray = JSON.parse(d.result);
										self.chooseAddressCodeArray[1] = cityCode;
										for(var k = 0; k < areaArray.length; k++) {

											//把选中的市对应的区添加到数组里面
											rearea.push(areaArray[k].regionName);

											if(areaArray[k].regionName == picker.getSlotValue(2)) {
												var areaCode = areaArray[k].regionCode;
												self.chooseAddressCodeArray[2] = areaCode;
											}
										}
										//设置区
										picker.setSlotValues(2, rearea);
										
									})

								}
							}
							//设置市
							picker.setSlotValues(1, recity);
							if(recity.length==0){
								picker.setSlotValues(2, []);			
							}
						})

					}
				}

				//省市区code

			}
		},
		data() {
			return {
				slots: [{
					flex: 1,
					values: '',
					className: 'slot1',
					textAlign: 'center',
					defaultIndex:'0'
				}, {
					flex: 1,
					values: ["市辖区", "县"],
					className: 'slot2',
					textAlign: 'center',
					defaultIndex:'0'
				}, {
					flex: 1,
					values: ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区"],
					className: 'slot3',
					textAlign: 'center',
					defaultIndex:'0'
				}],
				cityValue: [],
				province: [],
				chooseAddressCodeArray: [],
				chooseAddressCodeArrayDefault: [],
				test: '',
				areaFlag:false,
				cityString:''

			};
		},
		ready: function() {
			var self = this;
			var proviceUrl = common.isdev() + '/prmtcenter/seckill/getProviceAddr.json';
			var proviceData = {};
			this.$http.get(proviceUrl, proviceData).then(function(d) {
				d = d.json();
				var provinceArrayOrign = JSON.parse(d.result);
				var provinceArray = [];
				for(var i = 0; i < provinceArrayOrign.length; i++) {
					provinceArray.push(provinceArrayOrign[i].regionName);
				}
				self.slots[0].values = provinceArray;
				self.province = provinceArrayOrign;
				//
				
			})
			var entry = this.getQueryString('entry');
				if(entry == 'edit') {
					this.editFlag = true;
					var editAddressItem = JSON.parse(localStorage.getItem('chooseAddressEdit'));
					var editAddressMap = JSON.parse(localStorage.getItem('chooseAddressMap'));
					self.chooseAddressCodeArray[0] = editAddressItem.province;
					this.test = editAddressItem.province;
					var proviceCode=editAddressItem.province;
					var cityCode = editAddressItem.city;
					var areaCode = editAddressItem.district;
					this.chooseAddressCodeArrayDefault[0]=proviceCode;
					this.chooseAddressCodeArrayDefault[1]=cityCode;
					this.chooseAddressCodeArrayDefault[2]=areaCode;
					this.provinceDescription = editAddressMap[this.chooseAddressCodeArray[0]];
					this.cityDescription = editAddressMap[cityCode];
					this.areaDescription = editAddressMap[areaCode];
					this.cityValue[0] = this.provinceDescription;
					this.cityValue[1] = this.cityDescription;
					this.cityValue[2] = this.areaDescription;
				
					//默认选择城市
					let cityValue = document.getElementsByClassName("city-value")[0];
					cityValue.style.color = "#333";
					cityValue.innerHTML = this.cityValue[0] + '/' + this.cityValue[1] + '/' + this.cityValue[2];
					if(proviceCode=='710000'||proviceCode=='810000'||proviceCode=='820000'){
						cityValue.innerHTML = this.cityValue[0];
					}else{
						cityValue.innerHTML = this.cityValue[0] + '/' + this.cityValue[1] + '/' + this.cityValue[2];
					}
				}else if(entry == 'add'){
					let cityValue = document.getElementsByClassName("city-value")[0];
					cityValue.innerHTML='省/市/区';
					this.cityString=cityValue.innerHTML;
				}
				//省市区
				this.$dispatch('cityValueEvent', this.cityValue);
				this.$dispatch('chooseAddressCodeArrayEvent', this.chooseAddressCodeArrayDefault);
				console.log(this.cityValue,'aaaaaaa');
				console.log(this.chooseAddressCodeArray,'bbbbbbb');
			
		}
	};
</script>

<style lang="scss">
	@import "../../assets/css/_functions.scss";
	@import "../../assets/css/_variables.scss";
	.input-wrap {
		width: rem(360);
		height: rem(44);
		display: block;
		float: right;
		line-height: rem(44);
		border-bottom: 1px solid #dedede;
		position: relative;
		>* {
			display: block;
			float: left;
			overflow: hidden;
			line-height: rem(44);
		}
		span {
			width: rem(75);
			text-align: left;
			font-size: 14px;
			color: #333333;
		}
		input {
			width: rem(285);
			border: none;
			margin-top: rem(1);
			line-height: rem(42);
			color: #333333;
			font-size: rem(14);
		}
		b {
			position: absolute;
			right: 0;
			top: 0;
			font-size: rem(14);
			color: #ff0000;
			padding-right: rem(13);
			font-weight: normal;
		}
		.city-wrap {
			width: rem(285);
			margin-top: rem(1);
			line-height: rem(42);
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			p {
				font-size: rem(14);
				color: #cccccc;
				opacity: 0.8;
			}
			img {
				margin-top: rem(15);
				margin-right: rem(15);
				width: rem(8);
				height: rem(13);
			}
		}
	}
	
	.mask {
		background: rgba(0, 0, 0, 0.50);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9;
		display: none;
	}
	
	.select-city {
		width: rem(375);
		position: fixed;
		transition: 0.3s;
		overflow: hidden;
		bottom: rem(-250);
		background: #ffffff;
		z-index: 99;
		.city-top {
			width: 100%;
			height: rem(50);
			background: #fafbfc;
			display: flex;
			justify-content: space-between;
			span {
				font-size: rem(14);
				color: #0076ff;
				line-height: rem(50);
				padding: 0 rem(10);
				display: block;
				text-align: left;
				cursor: pointer;
			}
		}
	}
	
	.picker-item {
		font-size: rem(14);
	}
	
	.picker-selected {
		// height: rem(50)!important;
		// line-height: rem(50)!important;
		font-size: rem(17);
	}
	
	.slot1 .picker-selected+div {
		opacity: 0.8;
	}
	
	/*.slot1 .picker-selected+div+div {
		transform: skewX(20deg);
		opacity: 0.6;
	}*/
	
	.slot2 .picker-selected+div {
		opacity: 0.8;
	}
	
	.slot2 .picker-selected+div+div {
		opacity: 0.6;
	}
	
	.slot3 .picker-selected+div {
		opacity: 0.8;
		.picker {
			overflow: hidden;
		}
		.picker-toolbar {
			height: rem(44);
		}
		.picker-items {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			justify-content: center;
			padding: 0;
			text-align: right;
			font-size: rem(17);
			position: relative;
		}
		.picker-center-highlight {
			height: rem(44);
			box-sizing: border-box;
			position: absolute;
			left: 0;
			width: 100%;
			top: 50%;
			margin-top: rem(-18);
			pointer-events: none
		}
		.picker-center-highlight:before,
		.picker-center-highlight:after {
			content: '';
			position: absolute;
			height: 1px;
			width: 100%;
			background-color: #eaeaea;
			display: block;
			z-index: 15;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
		.picker-center-highlight:before {
			left: 0;
			top: 0;
			bottom: auto;
			right: auto;
		}
		.picker-center-highlight:after {
			left: 0;
			bottom: 0;
			right: auto;
			top: auto;
		}
		.picker-slot {
			font-size: 18px;
			overflow: hidden;
			position: relative;
			max-height: 100%
		}
		.picker-slot.picker-slot-left {
			text-align: left;
		}
		.picker-slot.picker-slot-center {
			text-align: center;
		}
		.picker-slot.picker-slot-right {
			text-align: right;
		}
		.picker-slot.picker-slot-divider {
			color: #000;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center
		}
		.picker-slot-wrapper {
			-webkit-transition-duration: 0.3s;
			transition-duration: 0.3s;
			-webkit-transition-timing-function: ease-out;
			transition-timing-function: ease-out;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
		}
		.picker-slot-wrapper.dragging,
		.picker-slot-wrapper.dragging .picker-item {
			-webkit-transition-duration: 0s;
			transition-duration: 0s;
		}
		.picker-item {
			height: rem(44);
			line-height: rem(44);
			font-size: rem(17);
			white-space: nowrap;
			position: relative;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #707274;
			left: 0;
			top: 0;
			width: 100%;
			box-sizing: border-box;
			-webkit-transition-duration: .3s;
			transition-duration: .3s;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
		}
		.picker-slot-absolute .picker-item {
			position: absolute;
		}
		.picker-item.picker-item-far {
			pointer-events: none
		}
		.picker-item.picker-selected {
			color: #000;
			-webkit-transform: translate3d(0, 0, 0) rotateX(0);
			transform: translate3d(0, 0, 0) rotateX(0);
		}
		.picker-3d .picker-items {
			overflow: hidden;
			-webkit-perspective: 700px;
			perspective: 700px;
		}
		.picker-3d .picker-item,
		.picker-3d .picker-slot,
		.picker-3d .picker-slot-wrapper {
			-webkit-transform-style: preserve-3d;
			transform-style: preserve-3d
		}
		.picker-3d .picker-slot {
			overflow: visible
		}
		.picker-3d .picker-item {
			-webkit-transform-origin: center center;
			transform-origin: center center;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
			-webkit-transition-timing-function: ease-out;
			transition-timing-function: ease-out
		}
	}
	
	/*.slot3 .picker-selected+div+div {
		transform: skewX(160deg);
		opacity: 0.6;
	}*/
	
	.picker-center-highlight:before,
	.picker-center-highlight:after {
		background-color: #BBBBBB !important;
	}
</style>