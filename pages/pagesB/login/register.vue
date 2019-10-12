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
				<input class="input-left"  placeholder="请输入短信验证码" placeholder-class="input-placeholder" v-model="password">
				<button ref="getCode1" class="get-indentify" :disabled="nosendCode" @click="sendMsgCodeTimer">{{sendbtn.text}}</button>				
			</view>
		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="backupMnemonic">下一步</button>
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
	import pageHead2 from '../../../components/page-head2.vue';
	export default {
		components: {
			pageHead2
		},
		data() {
			return {
				headerTitle: '邮箱注册',
				emailNum:'',
				password:'',
				opcity:0.5,
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
			backupMnemonic() {
				uni.navigateTo({
					url: "backupMnemonic1"
				})
			},
			change(e){
				console.log(e.detail.value.length)
				if (e.detail.value.length >= 3) {
					this.opcity = 1
				}else{
					this.opcity = 0.5
				}
			},
			// 发送短信验证码绑定手机号
			// sendCode(e) {
			// 	// 防止表单重复提交方案
			// 	rpx.nosendCode = true
			// 	// 请求短信验证码
			// 	this.$api.userSmscode({
			// 		phone: this.userPhone
			// 	}).then(res => {
			// 		this.smsCode = res.data.data.smsCode;
			// 		this.$refs.getCode1.$el.style.backgroundColor = "#aaaaaa"
			// 		this.sendMsgCodeTimer();
			// 		uni.showToast({
			// 			title: '短信已发送',
			// 			icon: 'none'
			// 		})
			
			// 	}).catch(err => {
			// 		this.nosendCode = false
			// 		uni.showToast({
			// 			title: err.data.data,
			// 			icon: "none"
			// 		})
			// 	});
			// },
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
		.forget-password{
			margin-left: 500rpx;
		}
		.bottom{
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
