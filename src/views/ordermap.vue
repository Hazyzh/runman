<template>
	<div class="box">
		<div id="container">
		</div>
		<router-link to="/"><el-button type="primary" class="button2">返回</el-button></router-link>
		<el-button type="danger" class="button" @click="doOrder">接单</el-button>
	</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';

export default{
	data () {
		return {
			map:{},
			userid:null,
		}
	},
	methods:{
		initmaps(){
			var point = this.$store.state.address.point;
			this.map = new BMap.Map("container");
			this.map.centerAndZoom(point, 15);
		},
		addControl () {
			var opts = {
				type: BMAP_NAVIGATION_CONTROL_ZOOM ,
				anchor:BMAP_ANCHOR_BOTTOM_RIGHT
			} 
			this.map.addControl(new BMap.GeolocationControl(opts));
			this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT}));	
			this.map.addControl(new BMap.ScaleControl({anchor:BMAP_ANCHOR_TOP_RIGHT}));
		},
		addOverlay (frompoint,topoint,order) {
			var _this = this;
			var point = this.$store.state.address.point;

			var point1 = frompoint;
			var point2 = topoint;
			var orderinfo = order;
			//自定义图片
			var myIcon = new BMap.Icon("/static/imgs/font-508.png", new BMap.Size(30,30), { 
					imageSize: new BMap.Size(30,30),
			 });      
			// 创建标注对象并添加到地图 
				  // 出发点 
			 var marker1 = new BMap.Marker(point1, {
			 	icon: myIcon,
			 	offset:new BMap.Size(10,10),
			 });
			marker1.addEventListener("click", function(){
			 	var content = orderinfo.formaddres1+'<p>联系人:'+orderinfo.formphone+'</p>'+'<p>佣金:'+orderinfo.commission+'</p>'+'<p>订单时间:'+orderinfo.time+'</p>';
			 	showinfo(point1,orderinfo.otype,content);
			}); 
			this.map.addOverlay(marker1);
				 // 到达点
			var marker2 = new BMap.Marker(point2, {
			 	icon: myIcon,
			 	offset:new BMap.Size(10,10),
			 });
			 marker2.addEventListener("click", function(){ 
			 	var content = orderinfo.sendaddress1+'<p>联系人:'+orderinfo.formphone+'</p>'+'<p>佣金:'+orderinfo.commission+'元</p>'+'<p>订单时间:'+orderinfo.time+'</p>';   
			 	showinfo(point2,orderinfo.otype,content);    
			}); 
			this.map.addOverlay(marker2);	 

			// 添加驾车路线
			var driving = new BMap.DrivingRoute(this.map, 
				{renderOptions:
					{
						map: this.map, 
						autoViewport: true
					}
				}
			);
			driving.search(point1, point2);
			
			function showinfo(infopoint,title,content){
				// 提示信息窗口
				var opts = {    
					width : 250,     // 信息窗口宽度    
					height: 160,     // 信息窗口高度    
					title : title  // 信息窗口标题   
				}
				var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象  
				_this.map.openInfoWindow(infoWindow, infopoint);      // 打开信息窗口
			}
			Indicator.close();
		},
		// 接单
		doOrder(){
			MessageBox({
	          title: '接收订单',
	          message: '确认要接收此订单吗?',
	          showCancelButton: true
	        }).then(action => {
	          if(action=='confirm'){
	          	console.log(this.$store.state.runmen)
				// 提交数据库
				this.$http({
			    	method:'post',
			    	body:{runid :this.$store.state.runid,id : this.$route.params.id},
			        url:'/hx160803/tp/index.php?s=admin/prot/runmanGetOrder',
			    }).then(function(data){
			    	if(data.body==2){
						MessageBox('接单失败', '正在任务中不能接单!');
			    	}else if(data.body==1){
			    		this.$store.state.runmen.flag=this.$route.params.id;
			    		console.log(this.$store.state.runmen.flag);
			    		MessageBox({
		                  title: '接单成功',
		                  message: '奔跑起来吧!',
		                  showCancelButton: false
		                }).then(action => {
		                  if(action=='confirm'){
		                    this.$router.push({ path: `/runordermap/${this.$route.params.id}`});
		                  }
		                });
			    		// 通知对方
			            var touid = 'runuser'+this.userid;
						var content = 'orderok'+this.$route.params.id;
						this.$http({
					    	method:'post',
					    	body:{to:touid,content},
					        url:'/hx160803/socket/test.php',
					    }).then((data)=>{
					    	console.log(data)
						})
			    	}else if(data.body==0){
						MessageBox('接单失败', '订单已经被其他跑男接单!');
			    	}
				})
	          }
	        });		
		}
	},
	mounted () {
		var _this = this;
		Indicator.open();
		function init(){
			if(_this.$store.state.address.point){
				clearInterval(t);
					// 初始化地图
				_this.initmaps();
				// 添加控件
				_this.addControl();

				_this.$http({
			    	method:'post',
			    	body:{id:_this.$route.params.id},
			        url:'/hx160803/tp/index.php/home/order/orderOne',
			    }).then(function(data){
			    	var order = data.body[0];
					_this.userid = order.uname;
				    	// 添加覆盖物
					var marker1 = new BMap.Point(order.formpointlan,order.formpointlat);
					var marker2 = new BMap.Point(order.sendpointlan,order.sendpointlat);
					_this.addOverlay(marker1,marker2,order);
				})
			}
		}
		var t = setInterval(init,200);
	}
}
</script>
<style scoped lang="less">
 .box{height: 100%}
 #container{height:100%}
 .button{
 	position: absolute;
 	top: 10px;left: 90px;
 }
 .button2{
 	position: absolute;
 	top: 10px;left: 10px;
 }
</style>