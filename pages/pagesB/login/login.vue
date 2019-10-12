<template>
	<view class="content">
		<page-head2 :headerTitle="headerTitle"></page-head2>
		<view class="logo">
			<image class="logo-img" src="../../../static/images/pagesA/login/logo.png" mode="aspectFill"></image>
		</view>
		<view class="input-wrap">
			<view>
				<view class="iconfont font-blue font-big">
					&#xe649;
				</view>
				<input class="input-left" placeholder="邮箱号" placeholder-class="input-placeholder" v-model="emailNum" @input="change">
			</view>
			<view>
				<view class="iconfont font-blue font-big">
					&#xe63d;
				</view>
				<input class="input-left" type="password" placeholder="密码" placeholder-class="input-placeholder" v-model="password">
			</view>
			<text class="font-blue forget-password">忘记密码？</text>

		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="backupMnemonic">登录</button>
			<navigator url="./register">
				<view class="font-small text-center">
					<text class="font-gray">还没有账号?</text>
					<text class="font-blue">去注册</text>
				</view>
			</navigator>
		</view>

	</view>
</template>

<script>
	import pageHead2 from '../../../components/page-head2.vue';
	export default {
		components: {
			pageHead2
		},
		data() {
			return {
				headerTitle: '登录',
				emailNum: '',
				password: '',
				opcity: 0.5
			}
		},
		onLoad() {

		},
		onReady() {

		},
		methods: {
			backupMnemonic() {
				uni.navigateTo({
					url: "backupMnemonic1"
				})
			},
			change(e) {
				console.log(e.detail.value.length)
				if (e.detail.value.length >= 3) {
					this.opcity = 1
				} else {
					this.opcity = 0.5
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		background-color: #fff;
		padding: 0 56rpx;
		font-size: 24rpx;
		color: #999999;
		height: 1334rpx;

		.logo {
			width: 86px;
			height: 86rpx;
			margin: 60rpx auto 50rpx;
		}

		.logo-img {
			width: 160rpx;
			height: 160rpx;
		}

		.forget-password {
			margin-left: 500rpx;
		}
	}



	.input-wrap {
		margin-top: 120rpx;
	}

	.input-wrap>view {
		border-bottom: 1px solid #ECECEC;
		padding: 20rpx 0;
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;
	}

	.input-wrap input {
		flex: 1;
	}

	button.blue {
		margin-bottom: 20rpx;
		margin-top: 80rpx;
		opacity: 0.5;
	}

	.footer {
		position: fixed;
		width: 100%;
		text-align: center;
		bottom: 60rpx;
	}
</style>
