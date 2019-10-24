<template>
	<view class="content">
		<view class="bgbox">
			
		</view>
		<view class="product-list">
			<view class="product-list-item" v-for="(item,index) in productList" :key="item.id" @tap="myAdDetail(index)">
				<view class="title">
					<view class="font-bold font-middle">
						{{item.Name}}
					</view>
					<view class="desc">
						{{showStatus(item.State)}}
					</view>
				</view>
				<view class="">
					<text class="percent percent-small">{{$base1._toFixed(item.Ratio*30*100,2) }}%</text> <text class="font-gray">月利率</text>
				</view>
				<view class="title">
					<text class="font-gray">投入金额:{{ $base1._toFixed(item.Number,4) }}USDT</text>
					<button class="blue detail-btn" hover-class="none" >详情</button>
				</view>
				<view class="font-gray">
					周期:10天
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default{
		data(){
			return{
				productList:[],
				
				
			}
		},
		onLoad() {
			//我的广告包
			uni.request({
				url: this.baseUrl + "/my-product",
				data: {
					page: 1,
					count: 100000
				},
				header:{
					Authorization:uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if(res.data.status==1){
						this.productList = res.data.data.List
						
					}else{
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
					
				}
			})
		},
		methods:{
			showStatus(status){
				if(status==0){
					return '未报单'
				}else if(status==1){
					return '已报单'
				}else if(status==2){
					return '已出局'
				}else if(status==3){
					return '已放行'
				}else if(status==4){
					return '违约'
				}
			},
			myAdDetail(index){
				uni.navigateTo({
					//携带参数跳转到详情页
					url:"./detail?id="+this.productList[index].Id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content{
		padding: 0 58rpx;
	}
	

	.product-list-item {
		height: 256rpx;
		width: 100%;
		padding: 30rpx 0;
		box-sizing: border-box;
		border-bottom: 2rpx solid #E6E6E6;
	
		.title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			line-height: 60rpx;
		}
	
		.desc {
			display: inline-block;
			text-align: center;
			line-height: 36rpx;
			font-size: 22rpx;
			width: 88rpx;
			height: 36rpx;
			border-radius: 18rpx;
			color: #38C262;
			background-color: rgba(56, 194, 98, 0.1);
			border: 2rpx solid #38C262;
		}
	}
	.percent {
		margin-top: 20rpx;
		font-size: 58rpx;
		color: #FF3400;
		font-weight: bold;
	}
	
	.percent-small {
		font-size: 36rpx;
	}
	.detail-btn {
		width: 140rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 26rpx;
		margin: 0;
	}
	
</style>
