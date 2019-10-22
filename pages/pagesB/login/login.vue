<template>
	<view class="content">
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
			<text class="font-blue forget-password" @tap="jumpToForgetPassword">忘记密码？</text>

		</view>
		<view>
			<button class="blue" hover-class="none" :disabled="disabled" :style="{opacity:opcity}" @click="login">登录</button>
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

	export default {
		
		data() {
			return {
				disabled:true,
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
			//登录
			login() {
				this.disabled = true
				uni.request({
					url: this.baseUrl + "/member-login",
					data: {
						Email: this.emailNum,
						Password:this.password
					},
					method: "POST",
					success: (res) => {
						console.log(res)
						if (res.data.status == 1) {
							uni.setStorageSync("token",res.data.data)
							console.log(uni.getStorageSync('token'))
							this.disabled = true
							uni.navigateTo({
								url:"../index/index"
							})
						} else {
							this.disabled = false
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
					}
				})
			},
			change(e) {
				console.log(e.detail.value.length)
				if (e.detail.value.length >= 3) {
					this.opcity = 1
					this.disabled = false
				} else {
					this.opcity = 0.5
					this.disabled = true
				}
			},
			jumpToForgetPassword(){
				uni.navigateTo({
					url:"./forgetPassword"
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content {		
		padding: 0 56rpx;
		font-size: 24rpx;
		color: #999999;
		.logo {
			width: 86px;
			height: 86rpx;
			margin: 116rpx auto 50rpx;
		}

		.logo-img {
			width: 172rpx;
			height: 172rpx;
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
</style>
