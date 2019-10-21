<template>
	<view class="content">
		<view class="flex-between top padding">
			<view class="flex-row flex">
				<view class="">
					<image class="logo-img" src="../../../static/images/BTC@2x.png" mode=""></image>
				</view>
				<view class="font-middle font-bold">
					{{array[index].enName}}
				</view>
			</view>
			<picker mode="selector" @change="bindPickerChange" :value="index" :range="arrayenName">
			<view class="">
				<text class="font-gray font22">
					切换币种
				</text>
				<text class="iconfont">
					&#xea25;
				</text>
			</view>
			</picker>
		</view>
		<view class="bgbox "></view>
		<view class="list padding">
			<view class="list-top">
				<text>转账数量</text><text class="font22">BTC可用: {{allmoneyNum}}</text>
			</view>
			<view class="list-input font-small">
				<input class="font-small" type="text" value="" v-model="money" placeholder="输入转账数量" />
				<text class="font-blue font-small" @tap="allmoney">全部</text>
			</view>
		</view>
		<view class="list padding">
			<view class="list-top">
				<text>接收地址</text>
			</view>
			<view class="list-input font-small">
				<input class="font-small" type="text" value="" v-model="address" placeholder="输入接收地址" />

			</view>
		</view>
		<view class="list padding">
			<view class="list-top">
				<text>备注</text>
			</view>
			<view class="list-input">
				<input class="font-small" type="text" value="" placeholder="填写备注" v-model="memo" />
			</view>

		</view>
		<view class="font-gray font22 padding">
			手续费：0.00051968 BTC≈1.3502 CNY
		</view>
		<view class="margin-top">
			<button class="blue" type="primary" @tap="sureTransfer">转账</button>
		</view>
		<!-- 输入资金密码的弹窗 -->
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
		
		<!-- 输入验证码的弹窗 -->
		<view class="prompt-box" v-show="showCodeMask" @tap="closeCodeMask"></view>
		<view class="prompt-content" v-show="showCodeMask">
			<view class="font36 font-bold text-left">
				安全验证
			</view>
			<view class="font-gray font-small text-left">验证码
				
			</view>
			<input class="prompt-input" type="text" password v-model="autoCode" placeholder="请填写验证码" />
			<view class="">
				获取验证码
			</view>
			
			<view class="margin-top">
				<button class="blue" @tap="surePay">确认支付</button>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPinMask: false,
				coreId: '',
				money: '',
				address: '',
				charge: '',
				pin: '',
				allmoneyNum: '',
				id: '',
				array: [],
				coinList:[],
				arrayenName:[],
				index:0,
				memo:'',
				password:'',
				autoCode:'',
				PayPassword:'',
				showCodeMask:false
			}

		},
		onLoad(options) {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base._isLogin()
			}
			this.allmoneyNum = options.money
			//我的资产列表
			uni.request({
				url: this.baseUrl + "/coin-list",
				header: {
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base._indexOf(res.data.status)) {
						this.$base._isLogin()
					} else if (res.data.status == 1) {
						this.coinList = res.data.data
						var self = this
						for(var i = 0; i < self.coinList.length; i++){
							var coinListName = {enName:self.coinList[i].EnName,id:self.coinList[i].Id}
							self.array.push(coinListName)
						}		
						for(var j=0 ; j<self.array.length;j++){
							this.arrayenName.push(this.array[j].enName)
						}
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				}
			})

		},
		methods: {
			bindPickerChange(e) {
				this.index = e.target.value
				console.log(this.index)
			},
			allmoney() {
				this.money = this.allmoneyNum
			},
			sureTransfer() {
				this.showPinMask = true
			},
			closePinMask() {
				this.showPinMask = false
			},
			confirm() {
				this.showCodeMask = true
			},
			closeCodeMask(){
				this.showCodeMask = false
			},
			surePay(){
				//点击确定发送资金验证码，验证成功后提现
				uni.request({
					url: this.baseUrl + "/sms-withdraw",
					method:'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 1) {
							//请求成功之后转账
							uni.request({
								url: this.baseUrl + "/recharge",
								data:{
									Id:this.array[this.index].id,
									Money:this.money,
									Address:this.address,
									Memo:this.memo,
									AuthCode:this.autoCode,
									PayPassword:this.password
								},
								method:'POST',
								header: {
									//除注册登录外其他的请求都携带用户token和秘钥
									Authorization: uni.getStorageSync('token')
								},
								success: (res) => {
									// console.log(res.data)
									if (res.data.status == 1) {
										
									} else {
										//提示余额不足
										uni.showToast({
											title: res.data.message,
											icon: "none"
										})
										uni.showModal({
											title: '转账失败',
											content: "点击确认继续转账",
											success: function(res) {
												if (res.confirm) {
													uni.redirectTo({
														url: "./currency-detail"
													})
												} else if (res.cancel) {
													uni.redirectTo({
														url: "./currency-detail"
													})
												}
											}
										});
									}
								}
							})
						} else {
							//提示余额不足
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
							uni.showModal({
								title: '转账失败',
								content: "点击确认继续转账",
								success: function(res) {
									if (res.confirm) {
										uni.redirectTo({
											url: "./currency-detail"
										})
									} else if (res.cancel) {
										uni.redirectTo({
											url: "./currency-detail"
										})
									}
								}
							});
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

<style lang="scss">
	.font36{
		font-size: 36rpx;
	}
	.bgbox {
		background-color: #F8F8F8;
		height: 20rpx;
	}

	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		background-color: #fff;
		height: 1334rpx;
		.top {
			font-size: 30rpx;
			margin-top: 20rpx;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
		}

		.font22 {
			font-size: 22rpx;
		}

		.logo-img {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 20rpx;
		}

		.list-top {
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 28rpx;
			margin-top: 28rpx;
		}

		.list-input {
			height: 100rpx;
			line-height: 100rpx;
			background-color: #F5F5F5;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0 26rpx;
			border-radius: 10rpx;
		}

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
