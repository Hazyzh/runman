<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';

export default {
  name: 'app',
  methods:{
    mapHandler(){
      var _this = this;
      var local = new BMap.Geolocation();
      local.getCurrentPosition(function(GeolocationResult){
        var address = GeolocationResult;
        _this.$store.state.address = address;
        Indicator.close();
      });
    },
    userHandler(){
      var _this = this;
      this.$http({
          method:'post',
          body:{runid:this.$store.state.runid},
          url:'/hx160803/tp/index.php/home/user/getOne',
        }).then(function(data){
          var runmen = data.body[0];
          this.$store.commit('setinfo', runmen);
      })
      // 今日完成情况
      this.$http({
          method:'post',
          body:{runid:this.$store.state.runid},
          url:'/hx160803/tp/index.php/admin/prot/runGetMoney',
        }).then(function(data){
          var today = data.body[0];
          this.$store.commit('settoday', today);
      })
    },
    socketHander(){
      var _this = this;
      var uid = 'running'+this.$store.state.runid;
      var socket = io('http://cykj.online:2120');
      // socket连接后以uid登录
      socket.on('connect', function(){
        socket.emit('login', uid);
      });
      // 后端推送来消息时
      socket.on('new_msg', function(msg){
          if(msg.startsWith('runok')){
            var id = msg.substring(5);
            // index.php/home/order/orderOne
            _this.$http({
                method:'post',
                body:{id},
                url:'/hx160803/tp/index.php/home/order/orderOne',
            }).then((data)=>{
                var commission = data.body[0].commission;
                MessageBox({
                  title: '恭喜完成新订单',
                  message: '订单'+data.body[0].otype+'已完成,获得佣金奖励'+commission+'元<br/>奔跑起来吧!',
                  showCancelButton: false
                }).then(action => {
                  if(action=='confirm'){
                    _this.$router.push({ path: `/`});
                  }
                });
            })
              // 今日完成情况
            _this.$http({
                method:'post',
                body:{runid:_this.$store.state.runid},
                url:'/hx160803/tp/index.php/admin/prot/runGetMoney',
              }).then(function(data){
                var today = data.body[0];
                _this.$store.commit('settoday', today);
            })
          }
      });  
    }
  },
  mounted () {
    Indicator.open();
    this.mapHandler();
    // 跑男基本信息
    this.userHandler();
    // 初始化socket
    var _this = this;
    function init(){
      if(window.io){
        clearInterval(t);
          // 初始化地图
        _this.socketHander();
      }
    }
    var t = setInterval(init,200);
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size:.8rem;
  height: 100%;
  margin-bottom: 0px;
  padding-top:1px;
}
html,body{
  height: 100%;
}
li{
  display: inline-block;
}
@import './assets/css/run.css';
</style>
