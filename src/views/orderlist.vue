<template>
	<div class="box">
		<run-header>
			<i slot="right"></i>
		</run-header>
		<ul
		  v-infinite-scroll="loadMore"
		  :infinite-scroll-disabled="false"
		  infinite-scroll-distance="10">
		<!-- <ul> -->
		  <li  v-for="listone in showlist">
		  	<el-card class="box-card" :key="listone.ordertype" :body-style="{ padding: '0px' }">
				<div  slot="header">
					<el-row>
					  <el-col :span="6"><el-tag :color="listone.ordertype | getcolor">{{listone.ordertype | gettype}}</el-tag></el-col>
					  <el-col :span="10" class="order-time">{{listone.time}}</el-col>
					  <el-col :span="6">{{listone.commission | currency}}</el-col>
					</el-row>
					<p class="orderinfo">{{listone.stade | getstate}}</p>
				</div>
				<div>
					<mt-cell-swipe
					  :title="'厦门高崎国际机场--'+listone.sendaddress1"
					  :right="[
					    {
					      content: '收藏订单',
					      style: { background: '#13CE66', color: '#FFF' },
					      handler: collect
					    }
					]"></mt-cell-swipe>
				</div>
			</el-card>		  		
		  </li>
		</ul>
	</div>
</template>

<script>
import RunHeader from '@/components/runHeader'
import { InfiniteScroll } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { CellSwipe } from 'mint-ui';
import { MessageBox } from 'mint-ui';

export default{
	data () {
		return {
			end:false,
			showlist:[],
			index:0
		}
	},
	components:{
		RunHeader,
		MessageBox
	},
	filters:{
		currency(value){
			var value = value*1;
		  return  value.toFixed(2)+'元';
		},
		getstate(val){
			var state = val*1;
			var str;
			switch(state){
				case 0:
					str = '未开始';
				break;
				case 1:
					str = '进行中';
				break;
				case 2:
					str = '已完成';
				break;
			}
			return str;
		},
		getcolor(val){
			var state = val*1;
			var color = '#333';
			switch(state){
				case 0:
					color = '#FF8AAE';
				break;
				case 1:
					color = '#58D5EF';
				break;
				case 2:
					color = '#B5E275';
				break;
				case 3:
					color = '#FFC853';
				break;
			}
			return color;
		},
		gettype(val){
			var state = val*1;
			var type = '';
			switch(state){
				case 0:
					type = '帮我买';
				break;
				case 1:
					type = '帮我送';
				break;
				case 2:
					type = '带排队';
				break;
				case 3:
					type = '帮我取';
				break;
			}
			return type;
		}
	},
	methods:{
		loadMore() {
			if(this.end){return;}
		  	Indicator.open({
		  		text: '加载中...',
		  		spinnerType: 'fading-circle'
			});
			this.getcontent(5);
		},
		collect () {
			MessageBox('收藏成功!');
		},
		getcontent (num) {
			this.$http({
		    	method:'post',
		    	body:{id:this.$store.state.runid,start:this.index,number : num},
		        url:'/hx160803/tp/index.php/admin/prot/runGetOrder',
		    }).then((data)=>{
		    	var orders = data.body;
			    if(orders.length<5){
					this.end = true;
			    }else{
			    	this.index += num;
			    }
			    for(var i=0;i<orders.length;i++){
			    	this.showlist.push(orders[i]);
			    }
			    Indicator.close();
			})
		}
	},
	mounted () {
		this.getcontent(5);
	}
}
</script>
<style scoped lang="less">
	li{
		display: block;
		margin: 5px 0px;
	}
	.orderinfo{
		text-align: center;
		color:#D3DCE6;
	}
	.order-time{
		font-size: 12px;
	}
</style>