<template name="page-head">
	<view class="header-content">
		<view class="header-left" @tap="jumpToBack">
			<view class="iconfont">
				&#xe600;
			</view>
		</view>
	</view>
</template>
<script>
	var app = getApp();
	export default {
		name: "page-head",
		methods: {
			jumpToBack() {
				uni.navigateBack({
					delta: 1	
				})
			}
		}
	}
</script>
<style lang="scss">
	.header-content {
		height: 70upx;
		width: 70upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #000;
		margin-top: 42rpx;
		position: relative;

		.header-left {
			position: absolute;
			left: 0;

			.iconfont {
				font-size: 34rpx;
			}

		}
	}
</style>
