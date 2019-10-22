<template>
	<view class="content">
		<view class="text-center">
			<i class="iconfont icon-xiangmuwancheng font-blue"></i>
			<view class="font-gray font-small tip">请按顺序选择助记词</view>
		</view>
		<view class="mnemonic-input">
			<text v-for="(item,index) in chooseMnemonic" :key="index">{{item}}</text>
		</view>
		<view class="mnemonic-wrap">
			<view class="item" v-for="(item,index) in mnemonic" :key="index" @click="inputMnemonic(item)">{{item}}</view>
		</view>
		<view class="flex">
			<button class="plain blue" @click="before">上一步</button>
			<button class="blue" @click="sureBackup">确认备份</button>
		</view>
		<navigator class="text-center footer font-blue" hover-class="none" url="wallet" open-type="switchTab">跳过此步，以后备份</navigator>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				mnemonic: [],
				chooseMnemonic: []
			}
		},
		onLoad() {
			this.mnemonic = this.$Wallet.getCurrentWallet().mnemonic.split(' ');
			this.mnemonic = this.mnemonic.sort(function() {
			    return .5 - Math.random();
			});
			console.log(this.mnemonic);
		},
		methods: {
			before(){
				uni.navigateBack({
					delta: 1
				})
			},
			inputMnemonic(item){
				this.chooseMnemonic.push(item);
			},
			sureBackup(){
				if(this.mnemonic.toString() == this.chooseMnemonic.toString()){
					uni.switchTab({
						url: "wallet"
					})
				}else{
					this.app._toast('助记词错误，请检查');
				}
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding: 60upx 15% 0;}
	.icon-xiangmuwancheng{font-size: 120upx;}
	.tip{margin: 40upx 0;}
	.mnemonic-input{margin-bottom: 30upx;background-color: #E5F5FF;border-radius: 12upx;height: 240upx;padding: 20upx;box-sizing: border-box;word-wrap:break-word;word-break:break-all;}
	.mnemonic-input text{margin-right: 20upx;}
	.mnemonic-wrap{display: flex;flex-wrap: wrap;margin-bottom: 30upx;}
	.mnemonic-wrap .item{background-color: #E5F5FF;color: #999999;border-radius: 12upx;padding: 6upx 14upx;margin-right: 20upx;margin-bottom: 20upx;}
	button.plain{margin-right: 20upx;}
	.footer{position: fixed;bottom: 40upx;width: 100%;left: 0;}
</style>
