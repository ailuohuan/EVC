<template>
	<view>
		<view class="text-center address-wrap">
			<view class="address">{{wallet.address}}</view>
			<view class="font-gray font-small">该地址仅支持ERC2.0币种充值</view>
		</view>
		<view class="ercode text-center">
			<view class="qrcode-wrap"><tki-qrcode ref="qrcode" :val="wallet.address" :size="144" background="#fff" foreground="#000" pdground="#000" :onval="true" :loadMake="true" :show="false" unit="px" :showLoading="false"></tki-qrcode></view>
			<button class="blue" @click="copy">复制地址</button>
		</view>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	import tkiQrcode from "@/components/tki-qrcode.vue"
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				wallet: {}
			}
		},
		onLoad() {
			uni.showLoading({
			    title: '二维码生成中'
			});
			this.wallet = this.$Wallet.getCurrentWallet();
			setTimeout(() => {
				uni.hideLoading();
			},500);
		},
		methods: {
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
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.address-wrap{padding: 60upx 60upx 0;;}
	.address-wrap .address{margin-bottom: 12upx;word-break: break-all;}
	.qrcode-wrap{width: 288upx;margin: 60upx auto;}
</style>
