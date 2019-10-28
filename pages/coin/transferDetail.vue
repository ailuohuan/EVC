<template>
	<view>
		<view class="block text-center assets-wrap">
			<view class="name">{{coinName}}</view>
			<view class="font-gray">{{detail.from.toLowerCase() == wallet.address.toLowerCase() ? '转账' : '收款'}}</view>
			<view class="font-blue money">{{detail.value}} {{coinName}}</view>
		</view>
		<view class="block transferDetail">
			<view class="flex-between">
				<text class="font-gray">时间</text>
				<text class="value">{{app._formatDate(detail.timeStamp)}}</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">区块高度</text>
				<text class="value">{{detail.blockNumber}}</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">发款地址</text>
				<text class="value">{{detail.from}}</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">收款地址</text>
				<text class="value">{{detail.to}}</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">哈希值</text>
				<text class="value">{{detail.hash}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				wallet: {},
				detail: {},
				coinName: ''
			}
		},
		onLoad(opt) {
			this.coinName = opt.coinname;
			this.detail = JSON.parse(opt.item);
			this.wallet = this.$Wallet.getCurrentWallet();
		},
		methods: {
			
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.block{border-top: 20upx solid #F8F8F8;}
	.assets-wrap{padding: 40upx 0;}
	.assets-wrap .name{font-weight: bold;}
	.assets-wrap .money{font-weight: bold;font-size: 48upx;margin-top: 12upx;}
	.transferDetail>.flex-between{padding: 30upx 24upx;}
	.transferDetail .font-gray{width: 200upx;}
	.transferDetail .value{flex: 1;word-break: break-all;text-align: right;}
</style>
