<template>
	<header class="clearfix">
		<div class="back">
		 	<slot name="back"><router-link to="/"><i class="el-icon-arrow-left"></i></router-link></slot>
		</div>
		<div class="logo">
			<slot name="logo"><img src="../assets/imgs/use_logo.png"></slot>
		</div>
		<div class="right">
			<slot name="right"><router-link to="/orderlist"><p class="address">订单记录</p></router-link></slot>
		</div>
	</header>
</template>

<script>
	
</script>

<style scoped lang="less">
header {
	background: #F9FAFC;
	width: 100%;
	height: 3rem;
	line-height: 3rem;
	a{color:#999;}
	div{
		float: left;
	}
	.back{
		width: 10%;
		font-size: 20px;
	}
	.logo{
		width: 70%;
		display: table-cell;
		vertical-align: middle;
		height: 100%;
		img{
			vertical-align:middle;
			height: 40%;
		}
	}
	.right{
		width: 20%;

	}
	.address{
		font-size: 12px;
		overflow: warp;
		margin-right: 10px;
	}
}
</style>