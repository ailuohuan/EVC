<template>
	<view class="content">
		<view class="bgbox">

		</view>
		<view class="top" @tap="jumpToproblemDetail">
			<text>如何登录?</text><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top">
			<text>如何注册？
			</text><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top">
			<text>忘记交易密码怎么办？
			</text><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top">
			<text>如何邀请朋友？
			</text><text class="iconfont icon">&#xea25;</text>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				headerTitle: '常见问题'
			}
		},
		onLoad() {
			
		},
		methods: {
			jumpToproblemDetail() {
				uni.navigateTo({
					url: "./problem-deail"
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		background-color: #F7F7F7;
		height: 1334rpx;

		.top {
			height: 110rpx;
			line-height: 110rpx;
			background-color: #fff;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 0 26rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #F1F1F1;

			.icon {
				color: #999;
				font-size: 30rpx;
				margin-left: 24rpx;
			}
		}


	}
</style>
