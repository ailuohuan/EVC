<template>
	<view>
		<view class="user-wrap">
			<view class="user-bg">
				<view class="tx"><image src="../../static/images/tx.png"></image></view>
				<view class="address text-overflow">{{app._addressMethod(wallet.address)}}</view>
			</view>
		</view>
		<navigator class="block flex-between item" url="../wallet/manage">
			<view class="flex">
				<i class="iconfont icon-qianbao"></i>
				<text>钱包管理</text>
			</view>
			<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
		</navigator>
		<view class="block item-wrap">
			<navigator class="item flex-between" url="../question/question">
				<view class="flex">
					<i class="iconfont icon-bangzhu"></i>
					<text>帮助与反馈</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			</navigator>
			<navigator class="item flex-between" url="about?type=1">
				<view class="flex">
					<i class="iconfont icon-bianji"></i>
					<text>用户协议</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			</navigator>
			<navigator class="item flex-between" url="about?type=2">
				<view class="flex">
					<i class="iconfont icon-zhuye"></i>
					<text>关于我们</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			</navigator>
		</view>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				pageHide: false,
				wallet: {}
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				uni.navigateTo({
					url: '../message/message'
				})
			}
		},
		onHide() {
			this.pageHide = true;
		},
		onShow() {
			if(this.pageHide){
				this.pageHide = false;
				this.wallet = this.$Wallet.getCurrentWallet();
			}
		},
		onLoad() {
			this.wallet = this.$Wallet.getCurrentWallet();
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.user-wrap{background-color: #0099FF;height: 400upx;padding-top: var(--status-bar-height);}
	.user-bg{padding-top: 100upx;}
	.user-bg .tx{width: 160upx;height: 160upx;border-radius: 50%;overflow: hidden;background-color: #FFFFFF;margin: 0 auto 20upx;}
	.user-bg .tx image{width: 100%;height: 100%;}
	.user-bg .address{width: 65%;margin: 0 auto;color: #FFFFFF;text-align: center;}
	.block{background-color: #FFFFFF;}
	.item-wrap{margin-top: 20upx;}
	.item{padding: 30upx 24upx;}
	.item .flex .iconfont{margin-right: 16upx;position: relative;top: 4upx;}
</style>
