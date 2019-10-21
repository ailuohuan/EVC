<template>
	<view class="content">
		<view class="input-wrap padding-top">
			<view class="">
				<input class="input-left" placeholder="请输入手机号" placeholder-class="input-placeholder" v-model="phone" @input="change">
			</view>
			<view>

				<input class="input-left" placeholder="请输入短信验证码" placeholder-class="input-placeholder" v-model="code">
				<button class="get-indentify" :disabled="nosendCode" @click="sendCode">{{sendbtn.text}}</button>
			</view>
		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="comfirme">绑定</button>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				phone: '',
				code: '',
				opcity: 0.5,
				nosendCode: false,
				sendbtn: {
					text: '获取验证码',
					codeTime: 60
				},
			}
		},
		onLoad() {

		},
		onReady() {

		},
		methods: {
			sendCode() {
				//请求短信验证码
				uni.request({
					url: this.baseUrl + "/sms-bindphone-code",
					data: {
						Phone: this.phone,
					},
					method: 'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base._indexOf(res.data.status)) {
							this.$base._isLogin()
						} else if (res.data.status == 1) {
							this.sendMsgCodeTimer()
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			comfirme() {
				//修改登录密码
				uni.request({
					url: this.baseUrl + "/bind-phone",
					data: {
						Phone: this.phone,
						AuthCode: this.code,
					},
					method: 'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base._indexOf(res.data.status)) {
							this.$base._isLogin()
						} else if (res.data.status == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
							uni.navigateTo({
								url: "./personal"
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			change(e) {
				if (e.detail.value.length >= 10) {
					this.opcity = 1
				} else {
					this.opcity = 0.5
				}
			},
			
			// 发送短信验证码计时器
			sendMsgCodeTimer() {
				this.timerId = setInterval(() => {
					let codeTime = this.sendbtn.codeTime;
					codeTime--;
					this.sendbtn.codeTime = codeTime;
					this.sendbtn.text = codeTime + "S";
					if (codeTime < 1) {
						clearInterval(this.timerId);
						this.sendbtn.text = "重新获取";
						this.nosendCode = false
						this.sendbtn.codeTime = 60;
						this.$refs.getCode1.$el.style.backgroundColor = "rgba(127, 204, 255, 1)"
					}
				}, 1000);
			},
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
