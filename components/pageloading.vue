<template>
	<view class="loading-wrap">
		<view class="loading">
			<view class="spinner">
				<view class="rect1"></view>
				<view class="rect2"></view>
				<view class="rect3"></view>
				<view class="rect4"></view>
				<view class="rect5"></view>
			</view>
		</view>
		<view class="loading-text">数据加载中，请稍后...</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.loading-wrap{padding: 200upx 0;}
	.loading{
		//loading动画
		display: flex;
		justify-content: center;
		@keyframes stretchdelay {
			0%, 40%, 100% {
				transform: scaleY(0.6);
			}
			20% {
				transform: scaleY(1.0);
			}
		}
		.spinner {
			margin: 0;
			width: 60upx;
			height: 100upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			view {
				background-color: #0099FF;
				height: 50upx;
				width: 6upx;
				border-radius: 6upx;
				animation: stretchdelay 1.2s infinite ease-in-out;
			}
			.rect2 {
			  animation-delay: -1.1s;
			}
			.rect3 {
			  animation-delay: -1.0s;
			}
			.rect4 {
			  animation-delay: -0.9s;
			}
			.rect5 {
			  animation-delay: -0.8s;
			}
		}
	}
	.loading-text{text-align: center;color: #999999;font-size: 24upx;}
</style>
