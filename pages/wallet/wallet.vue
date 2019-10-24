<template>
	<view class="wrap">
		<view class="assets-wrap">
			<view class="text-right dott" @click.stop="manage"><i class="iconfont icon-more"></i></view>
			<view class="wallet-address" @click="togglePopup">
				<view>ETH-Wallet</view>
				<view class="flex">
					<text>{{app._addressMethod(wallet.address)}}</text>
					<i class="iconfont icon-erweima"></i>
				</view>
			</view>
			<view class="flex-between">
				<view>
					<text class="money">{{hidden ? '******' : totalMoney}}</text>
					<text>CNY</text>
				</view>
				<i class="iconfont" :class="hidden ? 'icon-yanjing-biyan' : 'icon-yanjing-zhengyan'"  @click="hidden=!hidden"></i>
			</view>
		</view>
		<view class="coin-wrap">
			<view class="title">我的资产</view>
			<view class="coin-list">
				<view class="flex-between coin-item" v-for="(item,index) in coinList" :key="index" @click="goDetail(item)">
					<view class="flex">
						<image :src="item.Logo ? item.Logo : defaultImg" @error="imageError(item)"></image>
						<text class="name">{{item.EnName}}</text>
					</view>
					<view class="text-right">
						<view>{{hidden ? '****' : getSimple(item.EnName)}}</view>
						<view class="font-gray font-small">￥{{hidden ? '****' : getCny(item.Price,getSimple(item.EnName))}}</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="wallet-pop">
				<view class="name">ETH-Wallet</view>
				<view class="font-small font-gray flex" @click="copy">
					<text>{{app._addressMethod(wallet.address)}}</text>
					<i class="iconfont icon-fuzhi"></i>
				</view>
				<view class="address-wrap">
					<text>收款地址</text>
					<view class="ercode"><tki-qrcode ref="qrcode" :val="wallet.address" :size="144" background="#fff" foreground="#000" pdground="#000" :onval="true" :loadMake="true" :show="false" unit="px" :showLoading="false"></tki-qrcode></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>	
	import wallet from "@/common/js/wallet.js";
	import tkiQrcode from "@/components/tki-qrcode.vue"
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		components: {
			uniPopup,
			tkiQrcode
		},
		data() {
			return {
				hidden: false,
				wallet: {},
				coinBalance: {},
				pageHide: false,
				defaultImg: '/static/images/default.png',
				coinList: [],
				totalMoney: '0.0000'
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 1){
				
			}else{
				uni.navigateTo({
					url: 'manage'
				})
			}
		},
		onLoad() {
			this.wallet = this.$Wallet.getCurrentWallet();
			if(!this.wallet){
				uni.redirectTo({
					url: 'create'
				});
				return;
			}
			console.log(JSON.stringify(this.wallet));
			this.coinList = uni.getStorageSync(this.app._cacheCoin) || [];
			if(!this.coinList.length){
				this.getCoinList();
			}else{
				this.getBalance();
			}
		},
		onHide() {
			this.pageHide = true;
		},
		onShow() {
			if(this.pageHide){
				this.pageHide = false;
				this.wallet = this.$Wallet.getCurrentWallet();
				if(!this.wallet.coin){
					this.getBalance();
				}
			}
		},
		onPullDownRefresh() {
			this.getCoinList();
		},
		computed: {
			getSimple(){
				return function(name){
					if(!this.coinBalance[name]){
						return '0.00';
					}else{
						return this.app._toFixed(this.coinBalance[name],2);
					}
				}
			},
			getCny() {
				return function(price,num){
					let temp = price ? price : this.$Wallet.getCNY(item.EnName);
					let money = this.app._accMul(temp,num);
					return this.app._toFixed(money,2);
				}
			}
		},
		methods: {
			togglePopup(){
				this.$refs['popup'].open();
			},
			manage(){
				uni.navigateTo({
					url: 'backup'
				});
			},
			copy(){
				let self = this;
				uni.setClipboardData({
					data: self.wallet.address,
					success: function () {
						uni.showToast({  
						    title: '复制成功',  
						    mask: false,  
						    duration: 1500  
						});  
					}
				});
			},
			getCoinList(){
				let self = this;
				uni.request({
					url: self.baseUrl + '/coin-list',
					method: 'GET',
					data: {},
					success: res => {
						console.log(res.data);
						if(res.data.status == 1){
							self.coinList = res.data.data;
							self.getBalance();
							uni.setStorageSync(self.app._cacheCoin,res.data.data);
							uni.stopPullDownRefresh();
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			getBalance(){
				let self = this , tempCoinBalance = {};
				for(let i = 0 , len = this.coinList.length; i < len; i++){
					this.$Wallet.getBalance(this.wallet.address,this.coinList[i].Ext,this.coinList[i].Decimals,function(balance){
						tempCoinBalance[self.coinList[i].EnName] = balance;
						if(Object.keys(tempCoinBalance).length == len){
							let walletList = self.$Wallet.getWalletList() , ecodeWalletList = [];
							for(let i = 0 , len = walletList.length; i < len; i++){
								if(walletList[i].privateKey === self.wallet.privateKey){
									walletList[i].coin = tempCoinBalance;
								}
								ecodeWalletList.push(self.$Wallet.ecodeDes3JSON(walletList[i]));
							}
							uni.setStorageSync(self.app._cacheWallet,ecodeWalletList);
							self.wallet = self.$Wallet.getCurrentWallet();
							self.coinBalance = JSON.parse(self.wallet.coin);
							self.getTotalMoney();
						}
					});
				}
			},
			getTotalMoney(){
				let temp = 0;
				this.coinList.forEach(item => {
					temp += parseFloat(this.getCny(item.Price,this.coinBalance[item.EnName]));
				});
				this.totalMoney = this.app._toFixed(temp,4);
			},
			goDetail(item){
				let self = this;
				uni.navigateTo({
					url: `../coin/detail?coinItem=${JSON.stringify(item)}&num=${self.getSimple(item.EnName)}&money=${self.getCny(item.Price,self.getSimple(item.EnName))}`
				});
			},
			imageError(item){
				item.Logo = this.defaultImg;
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.wrap{padding: 0 24upx;}
	.assets-wrap{background:linear-gradient(180deg,rgba(0,153,255,1) 0%,rgba(0,135,225,1) 100%);border-radius: 20upx;color: #FFFFFF;padding: 24upx;position: relative;}
	.assets-wrap .dott,.wallet-list .dott{position: absolute;right: 20upx;z-index: 20;}
	.assets-wrap .icon-more,.wallet-list .icon-more{font-size: 50upx;}
	.assets-wrap .money{font-size: 56upx;font-weight: bold;margin-right: 12upx;}
	.assets-wrap .wallet-address{opacity: 0.7;margin: 20upx 0 40upx;}
	.assets-wrap .wallet-address .icon-erweima{font-size: 28upx;margin-left: 12upx;position: relative;top: 2upx;}
	.coin-wrap .title{font-weight: bold;padding: 24upx 0;}
	.coin-list .coin-item{border-bottom: 1px solid #FAFAFA;padding: 26upx 0;}
	.coin-list .coin-item image{width: 56upx;height: 56upx;border-radius: 50%;}
	.coin-list .coin-item .name{font-weight: bold;margin-left: 18upx;}
	.wallet-manage{padding: 24upx;}
	.wallet-title{font-size: 36upx;position: relative;}
	.wallet-title .iconfont{position: absolute;right: 24upx;top: 10upx;}
	.wallet-list{margin-top: 20upx;}
	.wallet-list .item{background:linear-gradient(180deg,rgba(0,153,255,1) 0%,rgba(0,135,225,1) 100%);border-radius: 12upx;margin-bottom: 20upx;color: #FFFFFF;padding: 30upx 20upx;position: relative;}
	.wallet-list .dott{top: 14upx;}
	.wallet-list .address{opacity: 0.7;}
	.wallet-pop{text-align: center;padding: 40upx 60upx;}
	.wallet-pop .name{font-weight: bold;font-size: 32upx;margin-bottom: 12upx;}
	.wallet-pop .ercode{margin-top: 20upx;}
	.wallet-pop .ercode image{width: 200upx;height: 200upx;}
	.wallet-pop .icon-fuzhi{font-size: 24upx;margin-left: 8upx;position: relative;top: 6upx;}
	.wallet-pop .address-wrap{margin-top: 40upx;}
</style>
