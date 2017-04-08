<template>
	<div class="box">
		<div id="container">
		</div>
		<router-link to="/"><el-button type="primary" class="button">返回</el-button></router-link>
	</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';

export default{
	data () {
		return {
			map:'',
		}
	},
	methods:{
		initmaps(){
			var point = this.$store.state.address.point;
			// var point = new BMap.Point(118.166146,24.480682);
			this.map = new BMap.Map("container");
			this.map.centerAndZoom(point, 13);
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
		addOverlay () {
			var _this = this;

			var point = this.$store.state.address.point;
			// var point = new BMap.Point(point);	
			//自定义图片
			var myIcon = new BMap.Icon("/static/imgs/moto-courier.png", new BMap.Size(30,30), { 
					imageSize: new BMap.Size(30,30),
			 });      
			// 创建标注对象并添加到地图   
			var marker = new BMap.Marker(point, {
			 	icon: myIcon,
			 	enableMassClear:false,
			 });
			 marker.addEventListener("click", function(){    
			 	MessageBox.alert('拖拽跑男位置可查看其他区域订单', '当前区域内的订单');   
			});
			marker.enableDragging();   
			this.map.addOverlay(marker);
			
			// 任务车手拖动后
			marker.addEventListener("dragend", function(e){    
			 	// console.log(e);
			 	_this.map.clearOverlays();
			 	// 改变地图的中心点
				_this.map.panTo(e.point);
			 	// 圆形区域改变
			 	createRegion(e.point);
			 	// 添加订单信息
			 	addOrderInfo(e.point);
			})
			// 添加圆形区域
			function createRegion(pointinfo){
				var region = new BMap.Circle(pointinfo,5000,{
					strokeColor:'#13CE66',
					fillColor:'#fff',
					strokeWeight:'3px',
					fillOpacity:.4,
				});
				_this.map.addOverlay(region);
			}
			createRegion(point);
			// 添加订单信息
			function addOrderInfo(pointinfo){
				// 远程搜索订单信息
				_this.$http({
		          	method:'post',
		          	body:pointinfo,
		          	url:'/hx160803/tp/index.php/admin/prot/getOrder',
		        }).then(function(data){
		          	var orderarr = data.body;
		          	for(let i=0;i<orderarr.length;i++){
		    			var orderinfo = orderarr[i]; 
						var orderpoint = new BMap.Point(orderinfo.formpointlan,orderinfo.formpointlat);
						var orderMarker = new BMap.Marker(orderpoint);
						// 添加折线
						var polyline = new BMap.Polyline([orderpoint,pointinfo],    
						 {strokeColor:"#333", strokeWeight:3, strokeOpacity:0.5}    
						);
						// 添加事件
						orderMarker.addEventListener("click", function(e){
							var orderinfos = orderarr[i];

							var info = orderarr[i].otype+' '+orderarr[i].formAddres1+' ('+30+'元)';
							MessageBox({
							  title: '订单内容',
							  message: info,
							  confirmButtonText:'前往查看订单详情',
							  showCancelButton: true
							}).then(action => {
								if(action=='confirm'){
									var orderinfo = orderarr[i];
									_this.$router.push({ path: `/ordermap/${orderinfo.id}`});
								}
							});
						});
						_this.map.addOverlay(orderMarker);
						_this.map.addOverlay(polyline);
					}
		      	})
			}
			addOrderInfo(point);
			Indicator.close();
		}
	},
	mounted () {
		var _this = this;
		Indicator.open({
	  		text: '加载中...',
	  		spinnerType: 'fading-circle'
		});
		function init(){
			if(_this.$store.state.address.point){
				clearInterval(t);
					// 初始化地图
				_this.initmaps();
				// 添加控件
				_this.addControl();
				// 添加覆盖物
				_this.addOverlay();
			}
		}
		var t = setInterval(init,200);
	}
}
</script>
<style scoped lang="less">
 .box{height: 100%;}
 #container{height:100%;}
 .button{
 	position: absolute;
 	top: 10px;left: 10px;
 }
</style>