<template>
	<view class="content">
		<view class="recommend-product">
			<view class="hot">
				V1
			</view>
			<view class="title">
				1
			</view>
			<view>
				<text class="percent">2%</text><text class="font-gray">月利率</text>
			</view>
			<view class="profit">
				周期10天
			</view>
		</view>
		<view class="bgbox">
			
		</view>
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
					
			};
		},
		
		onLoad(options) {
			
		},
		onPullDownRefresh() {
			
		  },
		methods:{
		
		}
	}
</script>

<style scoped lang="scss">
	.content {
		background-color: #fff;
		font-size: 24rpx;
		color: #333;
		height: 1334rpx;
		
		.recommend-product {
			position: relative;
			margin: 20rpx 0;
			height: 262rpx;
			width: 100%;
			text-align: center;
			line-height: 60rpx;
			.percent {
				margin-top: 20rpx;
				font-size: 58rpx;
				color: #FF3400;
				font-weight: bold;
			}
			.title {
				padding-top: 30rpx;
				font-weight: bold;
				font-size: 30rpx;
			}
			.profit {
				font-size: 24rpx;
			}
		
			.hot {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				width: 84rpx;
				height: 34rpx;
				background: linear-gradient(#FF727C, #FFA8AE);
				border-bottom-right-radius: 10rpx;
				border-top-left-radius: 10rpx;
				font-size: 20rpx;
				color: #fff;
				text-align: center;
				line-height: 34rpx;
			}
		}
		.bgbox{
			background-color: #F8F8F8;
			height: 20rpx;
		}
	}
</style>
