<template>
	<div class="seckill-details-basic-info">
    <h4 class="prod-title">{{title}}</h4>
		<div class="basicinfo-con1">
			<!--名称-->
			<!-- <span v-if="isapp" class="share" @click="share">分享</span> -->
			<!-- 价格 -->
			<!-- prod-price-wrap -->
			<div class="prod-price-wrap">
				<div class="prod-price">
          <p>
            <span class="yang-pic">¥</span>
            <em class="big-price">{{price}}</em>
          </p>
          <p class="old-price">原价&nbsp;¥{{marketPrice}}</p>
					<!--<div class="prod-price-depreciate-ellipsis">已省 <span>￥{{discount}}</span></div>-->
				</div>
				<div class="prod-price-depreciate">
					<div class="free-shipping" v-if="shipping">免运费</div>
				</div>
			</div>
			<!-- end prod-price-wrap -->
		</div> 
		<div class="sale">
			<div>已售 <span>{{selled}}</span>件</div>
			<!--<div class="sale-stock">(库存还剩下<span>{{stock}}</span>件)</div>-->
		</div>	
	</div>
	
</template>

<script type="text/javascript">

	export default {
		data:function(){
			return{
				title:'',
				price:0,  //商品价格 1
				discount:0, //优惠 1
        marketPrice:0,
				shipping:true, //是否包邮
				selled:1, //已售 1
				total:1,// 商品总数 1
				stock:1, //库存 1
				isapp:false,
				imgUrl:''
			}
		},
		methods:{
			checkAppcode:function(){
				var ua = window.navigator.userAgent;//获取ua
		        if(ua.indexOf("MongoToC")>=0){
                   this.isapp =  true;
		        }
			},
			share:function(){
        var surl = window.location.href;
        var title = this.title;
        var content = "我在车享家发现了个不错的服务商品";
        var imgUrl = this.imgUrl;
        var opt = {
            url:surl,
        title:title,
        content:content,
        imgUrl:imgUrl
        };
        if(surl&&title&&content&&imgUrl){
					lb.shareInfo(opt ,function (data) {})
        }else{
          Toast("分享失败:"+JSON.stringify(opt));
        }
			}
		},
		ready:function () {
			 this.checkAppcode();
		},
		events:{
			sendData:function(d){
				this.price=d.cashPrice; 
				this.title=d.goodsName;
				this.marketPrice = d.markmarketPrice;
				this.discount=(d.marketPrice-d.cashPrice).toFixed(2);  //市场价- 现金
				this.total=d.goodsAmount;	
				this.imgUrl=d.mainImage;
				this.selled=this.total-this.stock;
			},
			sendSurplus:function(d){
				this.stock=d;
			},
			sendps:function(d){
				console.log(d);
				if (d=='0') {
					this.shipping=false;
				}else{
					this.shipping=true;
				};
			}
			

		}
	}

</script>

<style lang="scss" scoped>

	@import '../../assets/css/_variables.scss';
	@import '../../assets/css/_functions.scss';
	
	.seckill-details-basic-info {
		/*margin-top:rem(1);*/
		padding-top: rem(30);
    padding-left: rem(20);
    padding-right: rem(20);
    padding-bottom: rem(20);
		background: $_fff;
		font-size: rem(12);
      h4 {
        padding-bottom: rem(20);
        font-size: rem(20);
        color: $_243742;
        line-height: rem(22);
      }
		.basicinfo-con1 {
			/*padding: 0 rem(15);*/
			position:relative;
      float: left;
      width: 35%;
			.share{
        display:inline-block;
				float:right;
				line-height:rem(25);
				height: rem(25);
				font-size: rem(14);
				padding-left: rem(16);
				background: transparent url(../../assets/images/share.png) no-repeat left center;
				background-size: rem(13) rem(13);
				position: absolute;
				right: 0.15rem;
				top: 0;
			}
			.prod-price-wrap {
				overflow: hidden;
				font-size: rem(20);
				/*line-height: rem(48);
				width:rem(345);
				display:flex;
				justify-content: space-between; */
				.prod-price {
					color:#f55923;
					margin-right: rem(0);
          float: left;
					white-space:nowrap;
					/*display:flex;
					justify-content: flex-start;
					align-items:center;*/
					.yang-pic{
						font-size: rem(16);
						display:inline-block;
						white-space:nowrap;
					}
					.big-price{
						font-size: rem(18);
						/*padding-left: rem(5);*/
						padding-right: rem(10);
						display:inline-block;
						white-space:nowrap;
					}
					.prod-price-depreciate-ellipsis {
						line-height: rem(12);
						padding: 0 rem(2);
						border-radius: rem(2);
						background: $_ff6600;
						color: $_fff;
						font-size: rem(10);
						height: rem(12);
						display: flex;
						align-items: center;
						padding-top: 0.01rem;
            box-sizing: content-box;
					}
				}
				.old-price {
          padding-top: rem(5);
          font-size: rem(12);
          color: #8392a0;
        }
				.prod-price-depreciate {
          /*margin-left: 2rem;*/
          padding-top: rem(5);
					overflow: hidden;
          float: right;
					font-size: rem(12);
					color: #999;
					/*display: flex;
					justify-content: space-between ;
					align-items: center;*/

					.free-shipping {
						padding: rem(3) rem(4);
						/*padding-top: 0.01rem;*/
						background: #fda861;
						border-radius: rem(5);
						font-size: rem(10);
						color: $_fff;
						line-height: 1;
						/*height: rem(13);*/
						/*display: flex;
						align-items: center;
						box-sizing: content-box;*/
					}
				}
				.place-order {
					@include hlh(18px);
					color: $_ff6600;
					font-size: rem(10);
					border-radius: rem(2);
					border: 1px solid $_ff6600;
					padding: 0 rem(2);
					margin-left: rem(4);
					margin-top: rem(10);
				}
			}
		}
		.sale {
			margin-left: rem(15);	
			/*border-top: 1px solid $_eee;*/
			line-height: rem(36);
			color: $_999;
      float:right;
			span {
				color: #f55923;
				padding: 0 rem(4);
			}
			.sale-stock {
				padding-left: rem(10);
			}
		}
	}
  .seckill-details-basic-info:before,.seckill-details-basic-info:after {
    content: "";
    display: block;
    clear: both;
  }
</style>