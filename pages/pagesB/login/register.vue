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
				<input class="input-left" placeholder="请查看邮箱输入邮箱验证码" placeholder-class="input-placeholder" v-model="checkCode">
				<button class="get-indentify" :disabled="nosendCode" @click="sendCode">{{sendbtn.text}}</button>
			</view>
		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="next">下一步</button>
			<navigator url="./login">
				<view class="font-small text-center">
					<text class="font-gray">已有账号?</text>
					<text class="font-blue">去登录</text>
				</view>
			</navigator>
			<view class="bottom">
				<text class="font-blue">使用邮箱注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emailNum: '',
				
				opcity: 0.5,
				nosendCode: false,
				sendbtn: {
					text: '获取验证码',
					codeTime: 60
				},
				checkCode:''
			
			}
		},
		onLoad() {

		},
		onReady() {

		},
		methods: {
			change(e) {
				if (e.detail.value.length >= 3) {
					this.opcity = 1
				} else {
					this.opcity = 0.5
				}
			},
			//发送邮箱注册验证码
			sendCode(e) {
				this.nosendCode = true
				uni.request({
					url: this.baseUrl + "/email-register-code",
					data: {
						Email: this.emailNum
					},
					method: "POST",
					success: (res) => {
						console.log(res)
						if (res.data.status == 1) {
							this.sendMsgCodeTimer()
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						} else {
							this.nosendCode = false
							uni.showToast({
								title: res.data.message,
								icon: 'none'
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
					}
				}, 1000);
			},
			//跳转到下一步
			next(){
				if(this.checkCode!=''&&this.opcity==1){
					uni.navigateTo({
						url:"./setPassword?checkCode="+this.checkCode+"&emailNum="+this.emailNum
					})
				}else{
					uni.showToast({
						title:"请输入验证码",
						icon:"none"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
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
