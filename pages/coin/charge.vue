<template>
	<view>
		<view class="flex-between coin-choose" @click="togglePopup">
			<view class="flex">
				<image class="logo" src="../../static/images/BTC@2x.png"></image>
				<text class="coinname">USDT</text>
			</view>
			<view class="font-gray flex">
				<text class="font-small">切换币种</text>
				<i class="iconfont icon-return-copy-copy-copy font-small"></i>
			</view>
		</view>
		<view class="text-center address-wrap">
			<view class="address">alksdjsadjflkasdjfkldsj</view>
			<view class="font-gray font-small">该地址仅支持BTC币种充值，最低充值数量1 BTC</view>
		</view>
		<view class="ercode text-center">
			<image src="../../static/images/ercode.png"></image>
			<button class="blue">复制地址</button>
		</view>
		<uni-popup ref="coin" type="bottom" :custom="true">
			<view class="coin-list">
				<view class="active">BTC</view>
				<view>ETH</view>
				<view>USDT</view>
				<view>CNY</view>
				<view class="cancle" @click="canclePopup">取消</view>
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
		methods: {
			togglePopup() {
				 this.$refs['coin'].open();
			},
			canclePopup(){
				this.$refs['coin'].close();
			},
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.coin-choose{border-top: 10px solid #F8F8F8;border-bottom: 10px solid #F8F8F8;padding: 24upx;}
	.coin-choose .logo{width: 56upx;height: 56upx;}
	.coin-choose .coinname{font-weight: bold;margin-left: 12upx;}
	.coin-choose .iconfont{position: relative;top: 6upx;}
	.address-wrap{padding-top: 60upx;}
	.address-wrap .address{margin-bottom: 12upx;}
	.ercode image{width: 300upx;height: 300upx;margin: 100upx 0;}
	.coin-list{background-color: #FFFFFF;text-align: center;}
	.coin-list>view{border-bottom: 1px solid #F7F7F7;padding: 30upx 0;}
	.coin-list .cancle{border-top: 20upx solid #F8F8F8;}
	.coin-list .active{color: #0099FF;font-weight: bold;}
</style>
