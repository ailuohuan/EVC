<template>
	<view class="content">
		<view class="logo">
			<image class="logo-img" src="../../../static/images/pagesA/login/logo.png" mode="aspectFill"></image>
		</view>
		<view class="input-wrap">
			<view class="">
				<input class="input-left" type="password" placeholder="请输入8-20位字母数字组成的密码" placeholder-class="input-placeholder" v-model="password">
			</view>
			<view class="">
				<input class="input-left" type="password" placeholder="请再次输入密码" placeholder-class="input-placeholder"  v-model="password2">
			</view>
			<view class="">
				<input class="input-left" type="password" placeholder="请输入8-20位字母数字组成的资金密码" placeholder-class="input-placeholder" v-model="transactionPassword" >
			</view>
			<view class="">
				<input class="input-left" type="password" placeholder="请再次输入资金密码" placeholder-class="input-placeholder" v-model="transactionPassword2" >
			</view>
			<view class="">
				<input class="input-left"  placeholder="请填写邀请码(必填)" placeholder-class="input-placeholder" v-model="inviteCode">
			</view>
			<view class="font-small text-center">
				<label class="radio"><radio :checked="check" @tap="checked" /></label>
				<text class="font-gray">我已阅读并同意</text>
				<text class="font-blue">《服务条款》</text>
			</view>

		</view>
		<view>
			<button class="blue" hover-class="none" :disabled="disabled" :style="{opacity:opcity}" @click="register">注册</button>
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
	export default {
		data() {
			return {
				emailNum: '',
				password: '',
				password2:'',
				transactionPassword:'',
				transactionPassword2:'',
				inviteCode:'',
				opcity: 0.5,
				check:false,
				disabled:true,
				checkCode :''
			}
		},
		onLoad(options) {
			this.checkCode = options.checkCode 
			this.emailNum = options.emailNum
		},
		onReady() {

		},
		methods: {
			//设置密码
			register() {
				//注册
					uni.request({
						url: this.baseUrl + "/member-register",
						data: {
							Email: this.emailNum,
							Password : this.password,
							RepeatPassword:this.password2,
							PayPassword :this.transactionPassword,
							RepeatPayPassword:this.transactionPassword2,
							InviteCode:this.inviteCode,
							// InviteCode:280951,
							AuthCode:this.checkCode
							// AuthCode:101101
						},
						method: "POST",
						success: (res) => {
							console.log(res)
							if (res.data.status == 1) {
								uni.showToast({
									title: res.data.message,
									icon: 'none'
								})
								uni.navigateTo({
									url:"./login"
								})
							} else {
								uni.showToast({
									title: res.data.message,
									icon: 'none'
								})
							}
						}
					})
			},
			checked(){
				this.check =!this.check
				if (this.check == true) {
					this.opcity = 1
					this.disabled = false
				} else {
					this.opcity = 0.5
					this.disabled =true
				}
			}
		}
	}
</script>

<style  lang="scss">
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
			margin: 118rpx auto 50rpx;
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
</style>
