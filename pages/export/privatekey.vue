<template>
	<view class="content">
		<textarea placeholder="请输入私钥找回密码" placeholder-class="input-placeholder" :value="wallet.privateKey" disabled="true"></textarea>
		<button class="blue" @click="copy" hover-class="none">复制</button>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				wallet: {},
			}
		},
		onLoad() {
			this.wallet = this.$Wallet.getCurrentWallet();
		},
		methods: {
			copy(){
				let self = this;
				uni.setClipboardData({
					data: self.wallet.privateKey,
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
	.content{padding: 15%;}
	textarea{background-color: #E5F5FF;width: 100%;height: 240upx;border-radius: 12upx;margin-bottom: 60upx;box-sizing: border-box;padding: 20upx;}
</style>
