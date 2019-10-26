<template>
	<view class="content">
		<view class="bgbox">

		</view>
		<view class="text-center top">
			<view class="">
				<view class="">
					总资产(USDT)
				</view>
			</view>
			<view class="">
				<view class="font-big font-bold margin-top">
					{{$base1._toFixed(money,4) }}
				</view>
			</view>
			<view class="flex-between margin-top padding">
				<view class="" @tap="jumToQrcode">
					<view class="iconfont font-bold font-big font-blue">
						&#xe7e4;
					</view>
					<view class="font-small">
						充值
					</view>
				</view>
				<view class="" @tap="jumpToTransferNum">
					<view class="iconfont font-bold font-big font-blue">
						&#xe7e5;
					</view>
					<view class="font-small">
						提现
					</view>
				</view>
				<view class="" @tap="jumpToMyBill">
					<view class="iconfont font-bold font-big font-blue">
						&#xe7e3;
					</view>
					<view class="font-small">
						账单
					</view>
				</view>
			</view>
		</view>

		<view class="bgbox">

		</view>
		<view class="font-bold flex title padding font-middle flex-between" @tap="jumpToRecord">
			<text class="font-bold">我的资产</text> <text class="iconfont">&#xea25;</text>
		</view>
		<view class="padding">
			<view class="list-item border-bottom flex-between flex" @tap="jumpTocurrencyDetail(index)" v-for="(item,index) in coinList"
			 :key="item.id">
				<view class="flex-row flex">
					<view class="">
						<image class="img" :src="item.Logo" mode=""></image>
					</view>
					<view class="">
						<view class="">
							{{item.EnName}}
						</view>
						<view class="">
							{{$base1._toFixed(item.Money,4) }}
						</view>
					</view>
				</view>
				<view class="">
					<view class="">
						<view class="">
							冻结
						</view>
						<view class="">
							{{$base1._toFixed(item.Forzen,4)}}
						</view>
					</view>
				</view>
				<view class="">
					<view class="">
						<view class="">
							折合(CNY)
						</view>
						<view class="">
							<!-- {{$base1._toFixed(item.Price,2)}} -->
							{{getCNY(item.Price)}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<evc-tabbar :tag="'wallet'" :fontColor2="fontColor2" :walletImg="walletImgSelect"></evc-tabbar>
	</view>
</template>

<script>
	import evcTabbar from '@/components/evcTabbar.vue'
	export default {
		components: {

			evcTabbar
		},
		data() {
			return {
				fontColor2: '#0099FF',
				walletImgSelect: '../../../static/images/evctabbar/walletselect.png',
				money: '',
				coinList: [],
				balanceList: []
			};
		},
		computed: {
			getCNY() {
				return function(price){
					let t_price = price || 0;
					return this.app._toFixed(this.app._accMul(t_price,7),4);
				}
			}
		},
		onLoad(options) {
			
			//总资产
			uni.request({
				url: this.baseUrl + "/total-balance",
				header: {
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.money = res.data.data
						
						
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
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
					if (res.data.status == 1) {
						this.coinList = res.data.data
						console.log(JSON.stringify(this.coinList));
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
		onBackPress(options) {
			var idtag=1
			console.log(idtag)
			if (idtag==1) {
				console.log('222')
				uni.switchTab({
					url:"../../wallet/wallet"
				})
				return true;
			}
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
			jumpToRecord() {
				uni.navigateTo({
					url: "./charging-record"
				})
			},
			jumpToTransferNum() {
				if(!this.money){
					uni.showToast({
						title:"您没有可用余额，不能进行提现操作"
					})
				}else{
					uni.navigateTo({
						url: "./transfer-num"
					})
				}
			
			},
			jumToQrcode() {
				uni.navigateTo({
					url: "./receivables-qrcode"
				})
			},
			jumpToMyBill() {
				uni.navigateTo({
					url: "../personal/my-bill"
				})
			},
			jumpTocurrencyDetail(index) {
				uni.navigateTo({
					url: "./currency-detail?coinId=" + this.coinList[index].Id + "&money=" + this.coinList[index].Money + "&forzen=" +
						this.coinList[index].Forzen + "&price=" +this.getCNY(this.coinList[index].Price)  + "&logo=" + this.coinList[index].Logo + "&Name=" + this.coinList[index].EnName
				})
				uni.setStorageSync('currencyName',this.coinList[index].EnName)
				 

			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.content {

		font-size: 24rpx;
		color: #333;

		.top {
			height: 318rpx;
			font-size: 30rpx;
			margin-top: 20rpx;
			padding: 40rpx 20rpx;
			box-sizing: border-box;

		}

		.list-item {
			height: 134rpx;

			.img {
				height: 72rpx;
				width: 72rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
			}
		}

		.title {
			height: 100rpx;
		}

		.rule {
			height: 140rpx;
		}

	}
</style>
