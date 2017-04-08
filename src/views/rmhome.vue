<template>
	<div>
		<div>
			<div id="mapcontainer" class="bm-view"></div>
		</div>
		<run-header>
			<router-link to="/runmeninfo" slot="back"><img  class="userinfo" src="../assets/imgs/icon_user.png"></router-link>
		</run-header>
		<div class="card-container timeinfo">
			<el-row :gutter="20">
			  <el-col :span="3" class="icon"><i class="el-icon-date"></i></el-col>
			  <el-col :span="20" class="data">{{nowtime}}</el-col>
			</el-row>
		</div>
		<div class="card-container todayinfo">
			<el-row type="flex" justify="space-between" align="middle" class="box">
			  <el-col :span="7">
				<p class="count">{{this.$store.state.todayinfo.total}}</p>
				<p class="title">今日完成</p>
			  </el-col>
			  <el-col :span="8">
				<div class="headimg"><img src="../assets/imgs/236.png"></div>
				<p class="headerinfo"><i class="el-icon-star-on"></i> 服务指数10.00</p>
			  </el-col>
			  <el-col :span="7">
				<p class="count">{{this.$store.state.todayinfo.getmoney || '0.0'}}</p>
				<p class="title">今日收益</p>
			  </el-col>
			</el-row>
		</div>
		<div class="user-info card-container">
			<el-row type="flex" justify="space-between" align="middle" class="position-box">
			  <el-col :span="4" class="title">
				<el-tag type="warning" color="#E5E9F2">当前位置:</el-tag>
			  </el-col>
			  <el-col :span="12">
				<p class="position">
					{{getPosition}}
				</p>
			  </el-col>
			  <el-col :span="4">
				<router-link to="/usermap"><img src="../assets/imgs/map2.png"></router-link>
			  </el-col>
			</el-row>
		</div>
		<div class="card-container order-ad">
			<div v-if="this.$store.state.runmen.flag==0">
				<div class="search">
					<mt-spinner :type="1" :size="80" color="#13CE66"></mt-spinner>
				</div>
				<p class="search-title">正在听单中...</p>
			</div>
			<div v-else>
				<div class="search2">
					<mt-spinner :type="2" :size="80" color="#13CE66"></mt-spinner>
				</div>
				<p class="search-title">正在任务中...</p>
				<div class="orderinfo"><mt-button type="danger" size="large" @click="goRuningOrder">详情</mt-button></div>
			</div>
		</div>
	</div>
</template>

<script>
import RunHeader from '@/components/runHeader'


export default{
	data () {
		return {
			nowtime:'',
			center:{
				lng: 0, 
				lat: 0
			},
		}
	},
	components:{
		RunHeader
	},
	computed:{
		getPosition () {
			var s = this.$store.state.address.address;
			if(s){
				return s.province+s.city+s.district+s.street;	
			}else{
				return '正在加载中...';
			}
			
		}
	},
	methods:{
		getNowTime () {
			var arr = ['日','一','二','三','四','五','六']
			var time = new Date();
		// 程序计时的月从0开始取值后+1
			var y = time.getFullYear();
		  	var m = time.getMonth() + 1;
		   	var d = time.getDate();
			var s = time.getDay()
		   	return y+'年'+m+'月'+d+'日 '+'星期'+arr[s];
		},
		mapHandler(){
			var _this = this;
			var local = new BMap.Geolocation();
			local.getCurrentPosition(function(GeolocationResult){
				var address = GeolocationResult.address;
				_this.position = address.province+' '+address.city+' '+address.street+' '+address.district;  
			});
		},
		goRuningOrder () {
			var id = this.$store.state.runmen.flag;
			this.$router.push({ path: `/runordermap/${id}`});
		}
	},
	mounted () {
		// 初始化时间
		this.nowtime = this.getNowTime();
		// 百度地图
		// this.mapHandler();
		// 听单循环
	}
}
</script>

<style scoped lang="less">
	.timeinfo{
		margin-top: 0px;
		color: #99A9BF;
		.icon{text-align: right;}
		.data{
			text-align: left;
		}
	}
	.todayinfo{
		.box{
			min-height: 8rem;
		}
		.count{
			font-size: 30px;
			color: orange;
			font-weight: bold;
		}
		.title{
			font-weight: bold;
			font-size: 18px;
		}
		.headimg{
			border-radius: 50%;
			overflow: hidden;
			border:1px solid orange;
			width: 80%;
			margin: auto;
			line-height: 0px;
			img{width: 100%;height: 100%;}
		}
		.headerinfo{
			font-size: 12px;
			color: #8492A6;
		}
	}
	// 地图
	.bm-view{
		display: none; 
	}
	.position-box{
		font-size: 16px;
		min-height: 2rem;
		.position{
			text-align: left;
			font-size: 12px;
			color: #8492A6;
			white-space : normal nowrap 
		}
		img{
			width: 20px;
			height: 20px;
		}
	}
	.user-info{
		margin-top: 0px;
		.title{
			text-align: right;
		}
	}
	// 广告
	.order-ad{
		.ad{
			img{
				width: 100%;
			}
		}
	}
	// 听单中
	.search{
		width: 80px;
		margin: auto;
	}
	.search-title{
		font-size: 20px;
		font-weight: bold;
		color: #99A9BF;
		padding-bottom: .4rem;
	}
	.orderinfo{
		width: 60%;
		margin: auto;
		padding-bottom: .6rem;
	}
</style>