<template>
	<div class="box">
		<div id="container">
		</div>
		<router-link to="/"><el-button type="primary" class="button2">返回</el-button></router-link>
		<el-button type="danger" class="button" @click="sureOrder">申请完成</el-button>
	</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';

export default{
	data () {
		return {
			map:{},
			local:{},
			orderuser:null,
		}
	},
	methods:{
		initmaps(){
			var point = this.$store.state.address.point;
			this.map = new BMap.Map("container");
			this.map.centerAndZoom(point, 18);
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
			 	var content = orderinfo.formaddres1+'<p>联系人:'+orderinfo.formphone+'</p>'+'<p>金币:'+orderinfo.price+'</p>'+'<p>订单时间:'+orderinfo.time+'</p>';
			 	showinfo(point1,orderinfo.otype,content);
			}); 
			this.map.addOverlay(marker1);
				 // 到达点
			var marker2 = new BMap.Marker(point2, {
			 	icon: myIcon,
			 	offset:new BMap.Size(10,10),
			 });
			 marker2.addEventListener("click", function(){ 
			 	var content = orderinfo.sendaddress1+'<p>联系人:'+orderinfo.formphone+'</p>'+'<p>金币:'+orderinfo.price+'元</p>'+'<p>订单时间:'+orderinfo.time+'</p>';   
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
					height: 100,     // 信息窗口高度    
					title : title  // 信息窗口标题   
				}
				var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象  
				_this.map.openInfoWindow(infoWindow, infopoint);      // 打开信息窗口
			}
			// 动态定位
				//自定义图片
			var myIcon = new BMap.Icon("/static/imgs/moto-courier.png", new BMap.Size(30,30), { 
					imageSize: new BMap.Size(30,30),
			 });      
				// 创建标注对象并添加到地图 
					  // 出发点 
			 
			function addicon (point,text){
				var markers = new BMap.Marker(point, {
				 	icon: myIcon,
				 	offset:new BMap.Size(10,10),
				 }); 
				markers.addEventListener("click", function(){
				 	showinfo(point,'当前位置',text);
				}); 
				_this.map.addOverlay(markers);
			}
			this.local = new BMap.Geolocation();
			function setselfPosition () {
			    _this.local.getCurrentPosition(function(GeolocationResult){
			      	var address = GeolocationResult.point;
			      	var adr = GeolocationResult.address;

			      	var content = '<br/><b>'+adr.city+'</b><span>'+adr.district+'</span><p>'+adr.street+'</p>';
			      	addicon(address,content);
			    });
			}
			setselfPosition();
		},
		// 确认订单
		sureOrder(){
			var touid = 'runuser'+this.orderuser;
			var content = 'runok'+this.$route.params.id;
			MessageBox({
			  title: '提交订单',
			  message: '确认申请完成订单',
			  showCancelButton: true
			}).then(action => {	
				if(action=='confirm'){
					this.$http({
				    	method:'post',
				    	body:{to:touid,content},
				        url:'/hx160803/socket/test.php',
				    }).then(function(data){
				    	console.log(data);
					})
					this.$http({
				    	method:'post',
				    	body:{runid:this.$store.state.runid},
				        url:'/hx160803/tp/index.php/admin/prot/orderEnd',
				    }).then((data)=>{
				    	if(data.body==1){
				    		this.$store.state.runmen.flag=0;
				    		MessageBox.alert('操作成功').then(action => {
							 	this.$router.push({ path: `/`});
							});
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
			    	_this.orderuser = order.uname;
				    	// 添加覆盖物
					var marker1 = new BMap.Point(order.formpointlan,order.formpointlat);
					var marker2 = new BMap.Point(order.sendpointlan,order.sendpointlat);
					_this.addOverlay(marker1,marker2,order);
					Indicator.close();
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