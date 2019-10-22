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
		<view class="bgbox ">
		</view>
		<view class="box ">
			<view class="name margin-top padding-top">
				{{address}}
			</view>
			<view class="font-gray font20 ">
				该地址仅支持BTC币种充值，最低充值数量1 BTC
			</view>
			<view class="">
				<image class="qrcode-img" :src="img" mode="widthFix"></image>
			</view>

			<view class="">
				<button class="blue" type="primary" @tap="copy">复制地址</button>
			</view>
		</view>
	</view>
</template>

<script>
	import QR from "@/common/wxqrcode.js" // 二维码生成器  	
	export default {
		data() {
			return {
				
				img: '', //二维码图片
				address: '',
				id: '',
				array: [],
				coinList:[],
				arrayenName:[],
				index:0
			};
		},
		onLoad(options) {
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
						var self = this
						for(var i = 0; i < self.coinList.length; i++){
							var coinListName = {enName:self.coinList[i].EnName,id:self.coinList[i].Id}
							self.array.push(coinListName)
						}		
						for(var j=0 ; j<self.array.length;j++){
							this.arrayenName.push(this.array[j].enName)
						}
						this.getAdress()
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
				this.getAdress()
			},
			getAdress(){
				//获取充值地址
				uni.request({
					url: this.baseUrl + "/recharge-address",
					data:{
						Id:this.array[this.index].id
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log('999999999999999')
						// console.log(res.data)
						//  if (res.data.status == 1) {
						// 	this.address = res.data.data.WalletAddress
						// 	this.img = QR.createQrCodeImg(this.address, {
						// 		size: parseInt(300) //二维码大小  
						// 	})
						// } else {
						// 	uni.showToast({
						// 		title: res.data.message,
						// 		icon: "none"
						// 	})
						// }
					}
				})
			},
			copy() {
				console.log(this.address)
				uni.setClipboardData({
					data: this.address,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		height: 1334rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		text-align: center;
		background-color: #fff;

		.box {
			text-align: center;
		}

		.name {
			font-size: 32rpx;
		}

		.top {
			font-size: 30rpx;
			margin-top: 20rpx;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
		}

		.bgbox {
			background-color: #F8F8F8;
			height: 20rpx;
		}

		.logo-img {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 20rpx;
		}

		.transfer-accounts {
			font-size: 26rpx;
			color: #999;
		}

		.qrcode-img {
			height: 256rpx;
			width: 256rpx;
			margin: 34rpx 0 50rpx;
		}

		.font20 {
			font-size: 20rpx;
		}
	}
</style>
