<template>
  <div class="seckill-details-index">
    <seckill-pic></seckill-pic>
    <seckill-details-basic-info></seckill-details-basic-info>
    <!--<pro-count></pro-count>-->
    <details-commodity-info></details-commodity-info>
    <count-down class="count-down"></count-down>
    <div class="callcenter">
      <a href="tel:4008020666">客服</a>
    </div>
  </div>
</template>

<script>

  import seckillPic from './seckill-pic';
  import detailsCommodityInfo from './details-commodity-info';
  import countDown from './count-down';
  import seckillDetailsBasicInfo from './seckill-details-basic-info';
  import proCount from './pro-count';
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import common from '../../utils/common';
  import '../../utils/remset';
  console.log(common.isdev());
  Vue.use(VueResource);
  Vue.http.options.emulateJSON = true;


  // 优惠  是否全国包邮
  //goodsAmount  商品数量  maxCount 限购数量

  // 优惠= 市场价-现金价
  export default {

    data: function () {
      return {
        time: [],
        data: [],
        surplus: '', // 库存
        buied: '-1', //商品已购买数量
        activityId: ''
      }
    },
    components: {
      seckillPic, detailsCommodityInfo, countDown, seckillDetailsBasicInfo, proCount
    },
    methods: {
      getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    },
    ready: function () {
      var domain = ".chexiang.com";
      if (window.location.hostname.indexOf(".chexiangsit.com") != -1) {
        domain = ".chexiangsit.com";
      } else if (window.location.hostname.indexOf(".chexiangpre.com") != -1) {
        domain = ".chexiangpre.com";
      }

      var ua = navigator.userAgent;
      console.info('ua=' + ua);

      if (ua.indexOf("userToken") != -1) {
        console.info("手机");
        var token = JSON.parse(ua).userToken;
        console.info(token);
        if (token != '') {
          console.info(token + 'token');
          var expires = new Date();
          expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);//1 天
          document.cookie = "sc_s=" + token + ";expires=" + expires.toGMTString() + ";path=/;domain=" + domain;
        } else {
          console.info('token是空的');
        }


      } else {
        console.log("是pc");
      }

      var _this = this;

      this.activityId = this.getQueryString('activityId');
      _this.$broadcast('sendId', _this.activityId);

      this.$http.get(common.isdev() + '/prmtcenter/seckill/' + this.activityId + ".json", {}).then(function (d) {
        d = d.json();
        if (d.isSuccess) {
          var ps = d.data.supplyMode;
          // 2016-12-29 10:25:00

          // var startTime="2016-12-29 10:25:00";
          // var nowTime="2016-12-29 10:24:00";
          // var endTime="2016-12-30 10:24:00";
          var nowTime = d.data.nowTime;
          var startTime = JSON.parse(d.data.seckillInfo).activityStarttime;
          var endTime = JSON.parse(d.data.seckillInfo).activityEndtime;
          _this.data = JSON.parse(d.data.seckillInfo);
          _this.surplus = d.data.surplus;

          _this.time.push(startTime, nowTime, endTime);

          // 向子级传值
          _this.$broadcast('sendSurplus', _this.surplus);
          _this.$broadcast('sendTime', _this.time);
          _this.$broadcast('sendData', _this.data);
          _this.$broadcast('sendps', ps);
        } else if (d.code == '4001') {
          var url = location.href;
          if (url.indexOf('sit') != -1) {
            location.href = '//h.jia.chexiangsit.com/errorMsg404.htm?code=4001&msg=活动ID解析异常';
          } else if (url.indexOf('chexiangpre') != -1) {
            location.href = '//h.jia.chexiangpre.com/errorMsg404.htm?code=4001&msg=活动ID解析异常';
          } else if (url.indexOf('chexiang') != -1) {
            location.href = '//h.jia.chexiang.com/errorMsg404.htm?code=4001&msg=活动ID解析异常';
          }
        }


      });


      this.$http.post(common.isdev() + '/prmtcenter/seckill/queryPlayCount.htm', {"activityId": this.activityId}).then(function (d) {
        d = d.json();
        if (d.isSuccess) {
          _this.buied = d.data;
        }
        _this.$broadcast('sendBuied', _this.buied);


      });


    }
  }


</script>
<style lang="scss">
  @import "../../assets/css/reset.scss";
  @import "../../assets/css/common.scss";
  @import '../../assets/css/_functions.scss';
  @import '../../assets/css/_variables.scss';
  .callcenter{
    padding: rem(10);
    background-color: #fff;
    border-radius: rem(4);
    box-shadow:0 0 5px 0 rgba(0,0,0,0.10);
    text-align: center;
    position: fixed;
    right: rem(20);
    bottom: rem(100);
    width: rem(60);
    height: rem(60);
      a {
        margin: 0 auto;
        padding-top: rem(30);
        background: url("../../assets/images/icon-callcenter.png") center top no-repeat;
        background-size: 80% auto;
        width: rem(30);
        font-size: rem(12);
        color: #333;
        display: inline-block;
      }
  }
</style>
