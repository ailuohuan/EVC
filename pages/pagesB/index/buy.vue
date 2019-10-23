<template>
	<view class="content">
		<view class="bgbox">
		</view>
		<view class="recommend-product">
			<view class="hot" :style="{background:showLevelBgc(level)}">
				V{{level}}
			</view>
			<view class="title">
				{{name}}
			</view>
			<view>
				<text class="percent">{{$base1._toFixed(ratio*30*100,2) }}%</text><text class="font-gray">月利率</text>
			</view>
			<view class="profit">
				周期:10天
			</view>
		</view>
		<view class="bgbox">

		</view>
		<view class="padding">
			<view class="font-middle rule flex-between">
				<text class="font-middle">合计金额</text><text class="font-gray">可用：{{$base1._toFixed(balance,4) }}USDT</text>
			</view>
			<view class="">
				<input class="input-num" type="text" value="10USDT" />
			</view>
			<view class="">
				<view class="font-gray">
					温馨提示：
				</view>
				<view class="font-gray">
					如预约成功后，未在当日18:00之前购买并激活广告包，系统将对此账号进行禁封；禁封后此账号所有收益停止，并清空收益账户，如需解封须支付50USDT的解封费用，解封后收益正常产生，且保证金不退。
				</view>
			</view>
			<view class="margin-top">
				<button class="blue" @tap="comfirmBook">确认预约</button>
			</view>
		</view>

		<!-- 点击确认预约之后输入密码的弹窗 -->
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
		components: {

		},
		data() {
			return {
				showPinMask: false,
				id: '',
				level: '',
				ratio: '',
				name: '',
				password:'',
				balance:''
			};
		},

		onLoad(options) {
			this.id = options.id
			//产品详情
			uni.request({
				url: this.baseUrl + "/product-detail",
				data: {
					Id: this.id
				},
				header: {
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.level = res.data.data.NeedLevel
						this.name = res.data.data.Name
						this.ratio = res.data.data.Ratio

					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				}
			})
			//单个币种余额
			uni.request({
				url: this.baseUrl + "/coin-single-balance",
				data: {
					Id:10
				},
				header: {
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.balance = res.data.data.Money
					
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				}
			})
		},
		onPullDownRefresh() {

		},
		methods: {
			closePinMask() {
				this.showPinMask = false
			},
			comfirmBook() {
				this.showPinMask = true
			},
			showLevelBgc(level){
				if(level==1){
					return  'linear-gradient(#FF727C, #FFA8AE)'
				}else if(level==2){
					return  'linear-gradient(#7FCCFF, #0099FF)'
				}else if(level==3){
					return  'linear-gradient(#FFC744, #FF9100)'
				}
			},
			confirm() {
				//提交密码预约
				uni.request({
					url: this.baseUrl + "/plan-product",
					data: {
						Id: this.id,
						PayPassword: this.password
					},
					method: 'POST',
					header: {
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							this.showPinMask = false
							uni.showModal({
								title: '预约中..',
								content: '请耐心等待预约结束',
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});


						} else {
							this.showPinMask = false
							uni.showModal({
								title: '预约失败',
								content: res.data.message,
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					}
				})
			},
			jumpToForgetPassword(){
				this.showPinMask = false
				uni.navigateTo({
					url:"../personal/forget-pay-password"
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
	
		font-size: 24rpx;
		color: #333;
		

		.recommend-product {
			position: relative;
			margin: 20rpx 0;
			height: 262rpx;
			width: 100%;
			text-align: center;
			line-height: 60rpx;

			.percent {
				margin-top: 20rpx;
				font-size: 58rpx;
				color: #FF3400;
				font-weight: bold;
			}

			.title {
				padding-top: 30rpx;
				font-weight: bold;
				font-size: 30rpx;
			}

			.profit {
				font-size: 24rpx;
			}

			.hot {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				width: 84rpx;
				height: 34rpx;
				background: linear-gradient(#FF727C, #FFA8AE);
				border-bottom-right-radius: 10rpx;
				border-top-left-radius: 10rpx;
				font-size: 20rpx;
				color: #fff;
				text-align: center;
				line-height: 34rpx;
			}
		}



		.rule {

			height: 100rpx;
			line-height: 100rpx;

			.ruled-detail {
				display: inline-block;
				word-wrap: break-word;
				width: 280rpx;
				height: 100rpx;
				line-height: 40rpx;
				text-align: center;
			}

			.width100 {
				width: 150rpx;
			}
		}

		.book {
			line-height: 60rpx;
		}

		.input-num {
			height: 100rpx;
			background-color: #F8F8F8;
			font-size: 58rpx;
			font-weight: bold;
			text-align: center;
		}


	}

	/*弹窗样式*/
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
		top: 40%;
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
		text-align: center;
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
