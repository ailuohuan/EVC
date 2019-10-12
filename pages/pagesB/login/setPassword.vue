<template>
	<view class="content">
		<page-head2 :headerTitle="headerTitle"></page-head2>
		<view class="logo">
			<image class="logo-img" src="../../../static/images/pagesA/login/logo.png" mode="aspectFill"></image>
		</view>
		<view class="input-wrap">

			<view class="">
				<input class="input-left" type="password" placeholder="请输入8-20位字母数字组成的密码" placeholder-class="input-placeholder" v-model="emailNum" @input="change">
			</view>
			<view class="">
				<input class="input-left" type="password" placeholder="请再次输入密码" placeholder-class="input-placeholder"  >
			</view>
			<view class="">
				<input class="input-left" type="password" placeholder="请输入8-20位字母数字组成的交易密码" placeholder-class="input-placeholder"  >
			</view>
			<view class="">
				<input class="input-left" type="password" placeholder="请再次输入交易密码" placeholder-class="input-placeholder" >
			</view>
			<view class="">
				<input class="input-left"  placeholder="请填写邀请码(选填)" placeholder-class="input-placeholder"  >
			</view>
			<view class="font-small text-center">
				<label class="radio"><radio :checked="check" @tap="checked()" /></label>
				<text class="font-gray">我已阅读并同意</text>
				<text class="font-blue">《服务条款》</text>
			</view>

		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="backupMnemonic">注册</button>
			<navigator url="./login">
				<view class="font-small text-center">
					<text class="font-gray">已有账号?</text>
					<text class="font-blue">去登录</text>
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
				headerTitle: '设置密码',
				emailNum: '',
				password: '',
				opcity: 0.5,
				check:false
	
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
			},
			checked(){
				this.check =!this.check
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

		.bottom {
			margin-top: 280rpx;
			text-align: center;
		}

		.get-indentify {
			height: 70rpx;
			line-height: 70rpx;
			width: 180rpx;
			padding: 0;
			border: none;
			color: #007AFF;
		}

	}
	.input-wrap {
		margin-top: 100rpx;
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
