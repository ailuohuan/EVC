<template>
	<view>
		<view class="block text-center assets-wrap">
			<view class="name">USDT</view>
			<view class="font-gray">收款/转账</view>
			<view class="font-blue money">00.234234 BTC</view>
		</view>
		<view class="block transferDetail">
			<view class="flex-between">
				<text class="font-gray">时间</text>
				<text class="value">2019-09-09 23:23:23</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">区块高度</text>
				<text class="value">24352345</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">接收地址</text>
				<text class="value">adfasdfasdfdf</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">哈希值</text>
				<text class="value">asdgsdfgsdfgsdfgsasdgs</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
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
