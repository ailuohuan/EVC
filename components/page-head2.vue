<template name="page-head2">
	<view class="header-content">
		<view class="header-left" @tap="jumpToBack">
			<view class="iconfont icon">
				&#xe885;
		   </view>
		</view>
		<view class="header-middle">
			{{headerTitle}}
		</view>		
	</view>
</template>
<script>
	var app = getApp();
	export default {
		name: "page-head2",
		props: {
			headerTitle:{
				type: String,
				required:true
			}
		},
		
		methods:{
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
		height: 88rpx;
		width: 100%;
		background-color: #fff;		
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #333;
		padding-top: 42rpx;
		position: relative;
		.header-left {								
			position: absolute;
			left: 0;						
		}
		.icon {
			font-size: 34rpx;
			font-weight: 600;
			
		}
		.header-middle {	
			width: 100%;
			font-size: 34rpx;
			text-align: center;		
			font-weight: 600;
		}	
	}
</style>
