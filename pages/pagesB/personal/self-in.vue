<template>
	<view class="content">
		<view class="bgbox">

		</view>
		<navigator url="./set-password">
			<view class="top">
				<text>修改登录密码</text><text class="iconfont icon">&#xea25;</text>
			</view>
		</navigator>
		<navigator url="./set-password">
			<view class="top">
				<text>忘记登录密码</text>
				<text class="iconfont icon">&#xea25;</text>
			</view>
		</navigator>
		<view class="bgbox">
		</view>

		<navigator url="./set-paypassword">
			<view class="top">
				<text>修改交易密码
				</text><text class="iconfont icon">&#xea25;</text>
			</view>
		</navigator>
		<navigator url="./set-paypassword">
			<view class="top">
				<text>忘记交易密码
				</text><text class="iconfont icon">&#xea25;</text>
			</view>
		</navigator>
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
