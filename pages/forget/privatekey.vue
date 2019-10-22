<template>
	<view class="content">
		<textarea placeholder="请输入私钥找回密码" placeholder-class="input-placeholder" v-model="privateKey"></textarea>
		<button class="blue" @click="next" hover-class="none">下一步</button>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				wallet: {},
				privateKey: ''
			}
		},
		onLoad() {
			this.wallet = this.$Wallet.getCurrentWallet();
		},
		methods: {
			next(){
				if(this.privateKey.trim() === this.wallet.privateKey){
					uni.navigateTo({
						url: 'pwd'
					});
				}else{
					this.app._toast('私钥输入错误，请检查');
				}
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding: 15%;}
	textarea{background-color: #E5F5FF;width: 100%;height: 240upx;border-radius: 12upx;margin-bottom: 60upx;box-sizing: border-box;padding: 20upx;}
</style>
