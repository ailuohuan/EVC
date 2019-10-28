<template>
	<view class="content">
		<view class="input-wrap padding-top">
			<view class="">
				<input class="input-left" placeholder="请输入地址" placeholder-class="input-placeholder" v-model="addr">
			</view>
			<view>

				<input class="input-left" placeholder="请输入验证码" placeholder-class="input-placeholder" v-model="authCode">
				<button class="get-indentify" :disabled="nosendCode" @click="sendCode">{{sendbtn.text}}</button>
			</view>
		</view>
		<view>
			<button class="blue"   @click="comfirme">绑定</button>
		</view>
		<view class="margin-top padding-top">
			<view class="margin-top padding-top">
				温馨提示：为保证您的数字资产安全，请您首先仔细阅读以下内容并绑定提现地址。
			</view>
			<view class="">
				1.该提现地址一经绑定，日后所有提现将只允许提现到该地址。
			</view>
			<view class="">
				2.该提现地址可以为EVC wallet、imtoken等去中心化钱包的地址。
			</view>
			<view class="">
				3.由于是智能合约自动处理，请勿将任何交易所的充值地址绑定为提现地址，绑定交易所充值地址将导致提现时资产丢失。
			</view>
			<view class="">
				4.绑定地址后无法修改和重置，如需重置请联系客服。
			</view>
			<view class="">
				5.请勿在地址头部和地址尾部加入空格，请仔细核对地址。
			</view>


		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				nosendCode: false,
				sendbtn: {
					text: '获取验证码',
					codeTime: 60
				},
				pages:'',
				addr:'',
				authCode:''
			}
		},
		onLoad(options) {
				console.log(uni.getStorageSync('token'))
		this.pages = options.pages
		},
		onReady() {
	
		},
		methods: {
			sendCode(){
				uni.request({
					url: this.baseUrl + "/email-bind-address",
					method: 'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
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
			//绑定地址
			comfirme(){
				uni.request({
					url: this.baseUrl + "/bind-address",
					data: {
						Address: this.addr,
						AuthCode: this.authCode
					},
					method: 'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
							uni.navigateTo({
								url:"./hasBindingAddr"
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
	}

	.footer {
		position: fixed;
		width: 100%;
		text-align: center;
		bottom: 60rpx;
	}
</style>
