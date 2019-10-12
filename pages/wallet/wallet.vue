<template>
	<view class="wrap">
		<view class="assets-wrap">
			<view class="text-right dott" @click.stop="manage"><i class="iconfont icon-more"></i></view>
			<view class="wallet-address" @click="togglePopup">
				<view>ETH-Wallet</view>
				<view class="flex">
					<text>hadoifjasldfjaklsdasdfasdf</text>
					<i class="iconfont icon-erweima"></i>
				</view>
			</view>
			<view class="flex-between">
				<view>
					<text class="money">00000.0000</text>
					<text>CNY</text>
				</view>
				<i class="iconfont icon-yanjing-zhengyan"></i>
			</view>
		</view>
		<view class="coin-wrap">
			<view class="title">我的资产</view>
			<view class="coin-list">
				<navigator class="flex-between coin-item" url="../coin/detail" v-for="(item,index) in 5" :key="index">
					<view class="flex">
						<image src="../../static/images/BTC@2x.png"></image>
						<text class="name">BTC</text>
					</view>
					<view class="text-right">
						<view>0</view>
						<view class="font-gray font-small">￥0.00</view>
					</view>
				</navigator>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="wallet-pop">
				<view class="name">ETH-Wallet</view>
				<view class="font-small font-gray flex">
					<text>asdfasdfasdfasd</text>
					<i class="iconfont icon-fuzhi"></i>
				</view>
				<view class="address-wrap">
					<text>收款地址</text>
					<view class="ercode"><image src="../../static/images/ercode.png"></image></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>	
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				
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
		methods: {
			togglePopup(){
				this.$refs['popup'].open();
			},
			manage(){
				uni.navigateTo({
					url: 'backup'
				});
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
	.coin-list .coin-item image{width: 56upx;height: 56upx;}
	.coin-list .coin-item .name{font-weight: bold;margin-left: 18upx;}
	.wallet-manage{padding: 24upx;}
	.wallet-title{font-size: 36upx;position: relative;}
	.wallet-title .iconfont{position: absolute;right: 24upx;top: 10upx;}
	.wallet-list{margin-top: 20upx;}
	.wallet-list .item{background:linear-gradient(180deg,rgba(0,153,255,1) 0%,rgba(0,135,225,1) 100%);border-radius: 12upx;margin-bottom: 20upx;color: #FFFFFF;padding: 30upx 20upx;position: relative;}
	.wallet-list .dott{top: 14upx;}
	.wallet-list .address{opacity: 0.7;}
	.wallet-pop{text-align: center;padding: 40upx 100upx;}
	.wallet-pop .name{font-weight: bold;font-size: 32upx;margin-bottom: 12upx;}
	.wallet-pop .ercode{margin-top: 20upx;}
	.wallet-pop .ercode image{width: 200upx;height: 200upx;}
	.wallet-pop .icon-fuzhi{font-size: 24upx;margin-left: 8upx;position: relative;top: 6upx;}
	.wallet-pop .address-wrap{margin-top: 40upx;}
</style>
