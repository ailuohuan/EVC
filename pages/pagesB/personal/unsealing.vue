<template>
	<view>
		<view class="user-wrap text-center">
			<view class="user-bg">
				<view class="img">
					<image class="img" src="../../../static/images/pagesA/personal/unsealing.png" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="font26 margin-top">
					解封需支付
				</view>
				<view class="font-big font-bold font-red margin-top">
					50USDT
				</view>
			</view>
			<view class="padding-top">
				<button class="blue" @tap="unsealing">确认解封</button>
			</view>
			<view class="font-gray font22">
				提示：如预约成功后，未在当日18:00之前购买并激活广告包，系统将对此账号进行禁封；禁封后此账号所有收益停止，并清空收益账户，如需解封须支付50USDT的解封费用，解封后收益正常产生，且保证金不退。
			</view>
		</view>
		<!-- 解封交易密码输入的弹框 -->
		<view class="prompt-box" v-show="showPinMask" @tap="closePinMask"></view>
		<view class="prompt-content" v-show="showPinMask">
			<view class="">请输入资金密码 <text class="iconfont icon" @tap="closePinMask">&#xe723;</text></view>
			<input class="prompt-input" type="text" password v-model="password" placeholder="请输入资金密码" />
			<view class="font-blue text-right margin-top" @tap="jumpToForgetPassword">
				忘记密码？
			</view>
			<view class="margin-top">
				<button class="blue" @tap="confirm">提交密码</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPinMask:false,
				password:''
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				uni.navigateTo({
					url: '../message/message'
				})
			}
		},

		onLoad() {
			
		},
		methods: {
			closePinMask(){
				this.showPinMask = false
			},
			unsealing() {
				this.showPinMask = true
			},
			confirm(){
				//状态解封
				uni.request({
					url: this.baseUrl + "/unsealing",
					method: "POST",
					data:{
						PayPassword:this.password
					},
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
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			jumpToForgetPassword(){
				uni.navigateTo({
					url:"../login/forgetPassword"
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page{
		background-color: #fff;
	}
	.font22 {
		font-size: 22rpx;
	}
	.font26 {
		font-size: 26rpx;
	}

	.user-wrap {
		background-color: #0099FF;
		height: 400upx;
		padding-top: var(--status-bar-height);
	}

	.user-bg {
		height: 426rpx;
		background: linear-gradient(#0099FF, #C1E6FF, #FFFFFF);
	}

	.top {
		width: 686rpx;
		height: 306rpx;
		border-radius: 10rpx;
		background-color: #fff;
		position: absolute;
		top: 188rpx;
		left: 32rpx;
	}
	.img{
		margin: 0 auto;
		height: 232rpx;
		width: 240rpx;
	}

	.prompt-box {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 11;
		background: rgba(0, 0, 0, 0.3);
	}
	
	.prompt-content {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 20;
		width: 80%;
		height: 380upx;
		max-width: 600upx;
		border: 2upx solid #ccc;
		border-radius: 8rpx;
		box-sizing: bordre-box;
		transform: translate(-50%, -50%);
		overflow: hidden;
		background: #fff;
		padding: 34rpx 50rpx 56rpx;
	
		.icon {
			position: absolute;
			right: 52rpx;
			top: 36rpx;
		}
	
	}
	
	.prompt-input {
		margin-top: 80rpx;
		width: 100%;
		height: 88rpx;
		background-color: #F5F5F5;
		border-radius: 8rpx;
		font-size: 24rpx;
		text-align: left;
		padding-left: 26rpx;
	}
	
</style>
