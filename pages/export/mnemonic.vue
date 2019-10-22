<template>
	<view class="content">
		<view class="text-center">
			<i class="iconfont icon-xiangmuwancheng font-blue"></i>
			<view class="font-gray font-small tip">
				<view>为了保证您的钱包安全，请勿截屏</view>
				<view>建议您抄写在纸上，以防止助记词被人盗用</view>
			</view>
		</view>
		<view class="mnemonic-wrap">
			<view class="item" v-for="(item,index) in mnemonic" :key="index">{{item}}</view>
		</view>
		<button class="blue" hover-class="none" @click="next">完成</button>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				mnemonic: []
			}
		},
		onLoad() {
			this.mnemonic = this.$Wallet.getCurrentWallet().mnemonic.split(' ');
			console.log(this.mnemonic);
		},
		methods: {
			next(){
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding: 60upx 15% 0;}
	.icon-xiangmuwancheng{font-size: 120upx;}
	.tip{margin: 40upx 0 60upx;}
	.mnemonic-wrap{display: flex;flex-wrap: wrap;margin-bottom: 30upx;}
	.mnemonic-wrap .item{background-color: #E5F5FF;color: #999999;border-radius: 12upx;padding: 6upx 14upx;margin-right: 20upx;margin-bottom: 20upx;}
	button{width: 100%;margin-top: 60upx;}
</style>
