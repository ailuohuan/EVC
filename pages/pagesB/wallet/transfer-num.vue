<template>
	<view class="content">
		<view class="flex-between top padding">
			<view class="flex-row flex">
				<view class="">
					<image class="logo-img" :src="array[index].logo" mode=""></image>
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
				<text>转账数量</text><text class="font22">{{array[index].enName}}可用: {{$base1._toFixed(allmoneyNum,4) }}</text>
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
				<input class="font-small" type="text" disabled v-model="address" :placeholder="address" />

			</view>
		</view>
		<view class="list padding">
			<view class="list-top">
				<text>验证码</text>
			</view>
			<view class="list-input font-small flex-between">
				<input class="font-small" type="text" v-model="autoCode" placeholder="请输入验证码" />
				<text class="font-blue" @click="sendCode">{{sendbtn.text}}</text>
			</view>
		</view>
		<view class="list padding">
			<view class="list-top">
				<text>资金密码</text>
			</view>
			<view class="list-input font-small">
				<input class="font-small" type="password" v-model="password" placeholder="请输入资金密码" />
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
			手续费：{{money*chargeFee}} {{array[index].enName}}≈{{money*chargeFee*7}} CNY
		</view>
		<view class="margin-top">
			<button class="blue" type="primary" @tap="sureTransfer">转账</button>
		</view>
		<!-- 输入资金密码的弹窗 -->
		<!-- <view class="prompt-box" v-show="showPinMask" @tap="closePinMask"></view>
		<view class="prompt-content" v-show="showPinMask">
			<view class="">请输入资金密码 <text class="iconfont icon" @tap="closePinMask">&#xe723;</text></view>
			<input class="prompt-input" type="text" password v-model="password" placeholder="请输入资金密码" />
			<view class="font-blue text-right margin-top" @tap="jumpToForgetPassword">
				忘记密码？
			</view>
			<view class="margin-top">
				<button class="blue" @tap="confirm">提交密码</button>
			</view>
		</view> -->

		<!-- 输入验证码的弹窗 -->
		<!-- <view class="prompt-box" v-show="showCodeMask" @tap="closeCodeMask"></view>
		<view class="prompt-content" v-show="showCodeMask">
			<view class="font36 font-bold text-left">
				安全验证
			</view>
			<view class="font-gray font-small text-left">验证码

			</view>
			<view class="flex-row margin-top padding-top">

				<input class="input-left" placeholder="请输入短信验证码" placeholder-class="input-placeholder" v-model="autoCode">
				<button class="get-indentify" :disabled="nosendCode" @click="sendCode">{{sendbtn.text}}</button>
			</view>


			<view class="margin-top">
				<button class="blue" @tap="surePay">确认支付</button>
			</view>
		</view>
 -->
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
				coinList: [],
				arrayenName: [],
				index: 0,
				memo: '',
				password: '',
				autoCode: '',
				PayPassword: '',
				showCodeMask: false,
				chargeFee: '',
				nosendCode: false,
				sendbtn: {
					text: '获取验证码',
					codeTime: 60
				},
				userPhone:'',
				bindingAddr:'',
				isRealName:''
			}

		},
		onLoad(options) {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base1._isLogin()
			}
			//获取用户手机号
			uni.request({
				url: this.baseUrl + "/member-info",
				header: {
					//除注册登录外其他的请求都携带用户token和秘钥
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.userPhone = res.data.data.Phone
						this.address = res.data.data.Address;
						this.bindingAddr = res.data.data.BindAddress
						//获取用户是否实名认证
						this.isRealName = res.data.data.AuthState
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				}
			})
			//我的资产列表
			uni.request({
				url: this.baseUrl + "/coin-list",
				header: {
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.coinList = res.data.data
						//获取所有资产余额
						//获取币种余额
						uni.request({
							url: this.baseUrl + "/coin-balance",
							header: {
								Authorization: uni.getStorageSync('token')
							},
							success: (res) => {
								console.log(res)
								if (res.data.status == 1) {
									this.balanceList = res.data.data
									this.set_balance();
									
									var self = this
									for (var i = 0; i < self.coinList.length; i++) {
										console.log(self.coinList[i].Money)
										if(self.coinList[i].Money){
											var coinListName = {
												enName: self.coinList[i].EnName,
												id: self.coinList[i].Id,
												logo: self.coinList[i].Logo
											}
											self.array.push(coinListName)
										}
										
									}
									for (var j = 0; j < self.array.length; j++) {
										this.arrayenName.push(this.array[j].enName)
									}
									
									this.getChargeFee()
									this.getsingleBanlence()
									
								} else {
									uni.showToast({
										title: res.data.message,
										icon: 'none'
									})
								}
						
							}
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
		methods: {
			set_balance() {
				var self = this;
				for (var i = 0; i < self.coinList.length; i++) {
					for (var j = 0; j < self.balanceList.length; j++) {
						if (self.coinList[i].Id == self.balanceList[j].CoinId) {
							self.coinList[i].Money = self.balanceList[j].Money;
							self.coinList[i].Forzen = self.balanceList[j].Forzen;
							self.coinList[i].Price = (parseFloat(self.balanceList[j].Money) + parseFloat(self.balanceList[j].Forzen)) * self.coinList[i].Price;
						}
					};
				};
				self.coinList = JSON.parse(JSON.stringify(self.coinList))
			
			},
			//转账获取验证码
			sendCode() {
				if(this.userPhone){
					if(this.nosendCode) return;
					this.nosendCode = true;
					uni.request({
						url: this.baseUrl + "/sms-withdraw",
						method: "POST",
						header: {
							//除注册登录外其他的请求都携带用户token和秘钥
							Authorization: uni.getStorageSync('token')
						},
						success: (res) => {
							console.log(res.data)
							if (res.data.status == 1) {
								this.sendMsgCodeTimer()
								uni.showToast({
									title: res.data.message
								})
							} else {
								this.nosendCode =false
								uni.showToast({
									title: res.data.message,
									icon: "none"
								})
							}
						}
					})
				}else{
					uni.showModal({
					    title: '提示',
					    content: '您还未绑定 手机号点击确认绑定手机号',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url:"../personal/binding-phone?pages=1"
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}				
			},
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
			getChargeFee() {
				//id获取币种
				console.log(this.array[this.index].id)
				uni.request({
					url: this.baseUrl + "/single-coin",
					data: {
						Id: this.array[this.index].id,
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 1) {
							//获取转账手续费
							this.chargeFee = res.data.data.WithDrawFee
							console.log(this.chargeFee)
						} else {

							uni.showToast({
								title: res.data.message,
								icon: "none"
							})

						}
					}
				})
				
			},
			getsingleBanlence(){
				//id币种可用余额
				uni.request({
					url: this.baseUrl + "/coin-single-balance",
					data: {
						Id: this.array[this.index].id,
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						// console.log(res.data)
						if (res.data.status == 1) {
							//获取转账手续费
							this.allmoneyNum = res.data.data.Money
							console.log(this.allmoneyNum)
						} else {
				
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
				
						}
					}
				})
			},
			bindPickerChange(e) {
				this.index = e.target.value
				console.log(this.index)

				this.getChargeFee()
				this.getsingleBanlence()
			},
			allmoney() {
				this.money = this.allmoneyNum
			},
			sureTransfer() {
				if(this.bindingAddr ==0){
					uni.showModal({
					    title: '您还未绑定充值地址',
					    content: '点击确定绑定',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url:"../personal/binding-addr"
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return;
				}else if(this.isRealName==0){
					uni.showModal({
					    title: '您还未实名认证',
					    content: '点击确定实名认证',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url:"../personal/real-name"
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				if(!this.money){
					this.app._toast('请输入转账数量');return;
				}
				if(!this.autoCode){
					this.app._toast('请输入验证码');return;
				}
				if(!this.password){
					this.app._toast('请输入资金密码');return;
				}
				uni.request({
					url: this.baseUrl + "/recharge",
					data: {
						Id: this.array[this.index].id,
						Money: this.money,
						Address: this.address,
						Memo: this.memo,
						AuthCode: this.autoCode,
						PayPassword: this.password
					},
					method: 'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						// console.log(res.data)
						if (res.data.status == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
							uni.navigateTo({
								url:"./charging-record"
							})
						} else {
							console.log(res.data.message)
							uni.showModal({
								title: res.data.message,
								content: "点击确认继续转账",
								success: function(res) {
									if (res.confirm) {
										uni.redirectTo({
											url: "./wallet"
										})
									} else if (res.cancel) {
										uni.redirectTo({
											url: "./wallet"
										})
									}
								}
							});
						}
					}
				})
			},
			closePinMask() {
				this.showPinMask = false
			},
			confirm() {
				this.showCodeMask = true
			},
			closeCodeMask() {
				this.showCodeMask = false
			},

			jumpToForgetPassword() {
				uni.navigateTo({
					url: "../login/forgetPassword"
				})
			}

		}
	}
</script>

<style lang="scss">
	page{background: #FFFFFF;}
	.font36 {
		font-size: 36rpx;
	}

	.bgbox {
		background-color: #F8F8F8;
		height: 20rpx;
	}

	.get-indentify {
		height: 70rpx;
		line-height: 70rpx;
		width: 180rpx;
		padding: 0;
		border: none;
		color: #007AFF;
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
			padding: 20rpx 20rpx;
			box-sizing: border-box;
			border-top: 8px solid #F5F5F5;
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
