<template>
	<div class="seckill-index">
		<seckill-edit></seckill-edit>
		
	</div>
	<div class="btn"  @click='toConfirmAdd' v-if='addFlag' ca="P_秒杀添加地址$完成">
			完成
	</div>
	<div class="btn"  @click='toConfirmEdit' v-if='editFlag' ca="P_秒杀编辑地址$完成">
			保存
	</div>
</template>

<script>
//common
import Vue from 'vue';
import { Toast } from 'mint-ui';
import '../../utils/remset';

	
	import seckillEdit from './seckill-edit-index';
	import selectCity from './select-city';
	//ajax
	import common from '../../utils/common';
	
	
	export default {
		data(){
			return {
				username:'',
				mobile:'',
				address:'',
				cityValue:[],
				chooseAddressCodeArray:[],
				chooseDefaultFlag:'2',
				editFlag:false,
				addFlag:false,
				editAddressid:'',
				cityString:'省/市/区',
				activityId:'',
				nameT:true,
				addressT:true,
				mobileT:true
				
			}
		},
		components: {
			seckillEdit,selectCity
		},
		events:{
			userNameEvent:function (msg) {
				this.username=msg;
			},
			mobileEvent:function (msg) {
				this.mobile=msg;
			},
			addressEvent:function (msg) {
				this.address=msg;
			},
			cityValueEvent:function (msg) {
				this.cityValue=msg;
			},
			chooseAddressCodeArrayEvent:function (msg) {
				this.chooseAddressCodeArray=msg;
			},
			chooseDefaultEvent:function (msg) {
				this.chooseDefaultFlag=msg;
					
			},
			chooseDefaultEvent02:function (msg) {
				this.chooseDefaultFlag=msg;
			}
		},
		methods:{
			validate:function () {
				//校验
				if(this.username==''){
					this.$broadcast('userFlagEvent',true);
					this.nameT=false;
				}else{
					var s = /^[\da-zA-Z\u4E00-\u9FA5]{1,10}$/;
					if(!s.test(this.username)){
						this.$broadcast('userFlag02Event',true);
						this.nameT=false;
					}else{
						this.nameT=true;
					}
				}
				var mobileRep=/^1\d{10}$/;
				if(this.mobile==''){
					this.$broadcast('mobileFlagEvent',true);
				}else if(!mobileRep.test(this.mobile)){
					this.$broadcast('mobileFlag02Event',true);
					this.mobileT=false;
				}else if(mobileRep.test(this.mobile)){
					this.mobileT=true;
				}
				if(this.cityValue==''){
					this.$broadcast('areaEvent',true);
				};

				

				if(this.address==''){
					this.addressT=false;
					this.$broadcast('addressFlagEvent',true);
				}else if(this.address.length<4){
					this.addressT=false;
					this.$broadcast('addressFlag02Event',true);
				}else {
					var s = /^[\da-zA-Z\u4E00-\u9FA5-_]{1,50}$/;
					if(!s.test(this.address)){
						this.$broadcast('addressFlag03Event',true);
						this.addressT=false;
						return;
					}else{
						this.addressT=true;
					}
				};
				

			},
			toConfirmAdd:function () {
				this.validate();
				if(this.nameT&&this.addressT&&this.mobileT){
					if(this.username!=''&&this.mobile.length==11&&this.cityValue.length&&this.address.length>=4){
					var addUrl=common.isdev()+'/prmtcenter/seckill/createAddress.htm';
					if(this.chooseAddressCodeArray[0]=='710000'||this.chooseAddressCodeArray[0]=='810000'||this.chooseAddressCodeArray[0]=='820000'){
							this.chooseAddressCodeArray[1]=0;
							this.chooseAddressCodeArray[2]=0;
						}
					var addData={
							consignee:this.username,
							province:this.chooseAddressCodeArray[0],
							city:this.chooseAddressCodeArray[1],
							district:this.chooseAddressCodeArray[2],
							addressName:this.address,
							telephone:this.mobile,
							def:'1',
							defaultFlag:this.chooseDefaultFlag
					};
					this.$http.post(addUrl,addData).then(function (d) {
						d=d.json();
						if(d.status=='01'){
								location.replace('./addresslist'+common.env()+'?flag=confirm&activityId='+this.activityId);//重新载入上一页
						}
					})
				}
				}else{
					return false;
				}
				
				
				
				
			},
			toConfirmEdit:function () {
				this.validate();
				if(this.nameT&&this.addressT&&this.mobileT){
					if(this.username!=''&&this.mobile.length==11&&this.cityValue.length&&this.address.length>=4){
						var addressid=this.getQueryString('addressId');
						this.editAddressid=addressid;
						var editUrl=common.isdev()+'/prmtcenter/seckill/updateAddress.htm';
						if(this.chooseAddressCodeArray[0]=='710000'||this.chooseAddressCodeArray[0]=='810000'||this.chooseAddressCodeArray[0]=='820000'){
							this.chooseAddressCodeArray[1]=0;
							this.chooseAddressCodeArray[2]=0;
						}
						var editData={
								adrId:this.editAddressid,
								def:'1',
								defaultFlag:this.chooseDefaultFlag,
								consignee:this.username,
								province:this.chooseAddressCodeArray[0],
								city:this.chooseAddressCodeArray[1],
								district:this.chooseAddressCodeArray[2],
								addressName:this.address,
								telephone:this.mobile,
						};
						
							
						this.$http.post(editUrl,editData).then(function (d) {
							d=d.json();
							if(d.status=='01'){
									location.replace('./addresslist'+common.env()+'?flag=confirm&activityId='+this.activityId);//重新载入上一页
							}
						})
					}
				}else{
					return false;
				}
				
				
				

				
			},
			getQueryString: function(name) {
					var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r != null) return unescape(r[2]);
					return null;
				}
		},
		ready:function () {
			//登陆
				LoginJS.checkLogin(
					function(data) {
					},
					"",
					function() {
					});
			var entry=this.getQueryString('entry');
			this.activityId = this.getQueryString('activityId');
			if(entry=='edit'){
				this.editFlag=true;
				document.title='编辑地址';
				
			}else if(entry=='add'){
				this.addFlag=true;
				document.title='添加地址';
			}
		}
	}

	
</script>

<style lang="scss" >
@import "../../assets/css/reset.scss";
@import "../../assets/css/common.scss";
@import '../../assets/css/_functions.scss';
@import '../../assets/css/_variables.scss';
	.btn{
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		height: rem(48);
		line-height: rem(48);
		background-color: #fff;
		text-align: center;
		font-size: rem(16);
		min-width: 320px;
		max-width: 640px;
		margin: 0 auto;
	}
</style>