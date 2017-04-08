<template>
	<div>
		<run-header></run-header>
		<div class="userinfo-box">
		<div class="head-info">
			<div class="head">
				<img src="../assets/imgs/236.png">
			</div>
			<p class="name">吴灿强</p>
			<div class="block">
				<el-rate disabled text-color="#ff9900">
				</el-rate>
			</div>
			<br>
			<div>
				<el-row type="flex" justify="space-between" align="middle">
				  <el-col :span="7">
					<p>0.00</p>
					<p>账户余额</p>
				  </el-col>
				  <el-col :span="7">
				  	<p>跑男编号</p>
				  	<p>31102112</p>
				  </el-col>
				  <el-col :span="7">
					<p>12.00</p>
					<p>信用积分</p>
				  </el-col>
				</el-row>
			</div>
			<div class="level">
				<img src="../assets/imgs/222.png">
			</div>
			<div class="user-credit">
				<el-row type="flex" justify="space-between" align="middle">
				  <el-col :span="12" class="border">
					<p>10.0</p>
					<p class="text">服务指数</p>
				  </el-col>
				  <el-col :span="12">
				  	<p>100%</p>
				  	<p class="text">订单相应率</p>
				  </el-col>
				</el-row>
			</div>
		</div>
	</div>
		<div class="today-achievement">
			<p class="title">今日成就</p>
			<el-row type="flex" justify="space-between" align="middle">
			  <el-col :span="7">
				<p class="inner-title">完成订单</p>
				<p>{{this.$store.state.todayinfo.total}} 笔</p>
			  </el-col>
			  <el-col :span="7">
			  	<p class="inner-title">奔跑里程</p>
			  	<p>0 公里</p>
			  </el-col>
			  <el-col :span="7">
				<p class="inner-title">获得收益</p>
				<p>{{this.$store.state.todayinfo.getmoney||0}}元</p>
			  </el-col>
			</el-row>
		</div>
		<div class="ad">
			<img src="../assets/imgs/333.png">
		</div>
		<div class="operation">
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon1.jpg">
				</div>
				<p>跑跑战队</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon2.jpg">
				</div>
				<p>有奖推荐</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon3.jpg">
				</div>
				<p>跑跑荣誉榜</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon4.jpg">
				</div>
				<p>任务中心</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon5.jpg">
				</div>
				<p>跑跑课堂</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon6.jpg">
				</div>
				<p>U币商城</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon7.jpg">
				</div>
				<p>在线客服</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon8.jpg">
				</div>
				<p>消息通知</p>
			</div>
			<div class="item">
				<div class="icon">
					<img src="../assets/imgs/icon9.jpg">
				</div>
				<p>设置中心</p>
			</div>
		</div>
	</div>
</template>

<script>
import RunHeader from '@/components/runHeader'
export default{
	components:{
		RunHeader
	},
	mounted () {
		console.log(this.$store.state.address)
	}
}
</script>
<style scoped lang="less">
	.userinfo-box{
		background: #D9743C;
		color: #fff;
		padding-top: 10px;
		.head{
			border-radius: 50%;
			overflow: hidden;
			width: 5rem;
			margin: auto;
			img{width: 100%}
		}
		.name{margin: 5px auto;}
		.level{
			margin-top: 10px;line-height: 0px;
			width: 100%;
			img{width: 100%;max-height: 5rem;}
		}
		.user-credit{
			background: #BF5233;
			font-weight: bold;
			.border{
				border-right: 1px solid #E5E9F2;
				padding:1rem;
			}
			.text{
				color: #F4996B;
			}
		}
	}
	.ad{
		width: 100%;
		img{
			width: 100%;
			max-height: 3rem;
		}
	}
	// 今日成就
	.today-achievement{
		background: #fff;
		padding-top: .5rem;
		padding-bottom: .5rem;
		.title{
			font-weight: bold;
		}
		.inner-title{
			font-size: 12px;
			color: #BBBBBB;
		}
	}
	.operation{
		background: #fff;
		display: -webkit-flex; 
		display: flex;
		flex-wrap: wrap;
		font-size: 12px;
		.item{
			width: 33.3%;
			min-height: 4rem;
			padding: 1rem;
			box-shadow:-1px 0px 0px 1px rgba(245,245,245,1);
			.icon{
				margin: auto;
				width: 80%;
			}
		}
	}
</style>