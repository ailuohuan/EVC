<template>
	<view class="content">
		<view class="flex-between" @click="type=1;togglePopup()">
			<text>导出助记词</text>
			<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
		</view>
		<view class="flex-between" @click="type=2;togglePopup()">
			<text>导出私钥</text>
			<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
		</view>
		<uni-popup ref="password" type="bottom" :custom="true">
			<view class="password-wrap">
				<view class="title">
					<text>请输入资金密码</text>
					<i class="iconfont icon-guanbi1" @click="canclePopup"></i>
				</view>
				<view class="pwd-pop-content">
					<view class="input-wrap">
						<input type="password" v-model="pwd"/>
					</view>
					<navigator class="text-right font-blue" url="../forget/privatekey" hover-class="none">忘记密码?</navigator>
				</view>
				<button class="blue" @click="validatePwd">提交密码</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				pwd: '',
				type: 1,//1：导出助记词，2：导出私钥
			}
		},
		onHide() {
			this.$refs['password'].close();
		},
		onLoad() {
			this.wallet = this.$Wallet.getCurrentWallet();
		},
		methods: {
			togglePopup() {
				 this.$refs['password'].open();
			},
			canclePopup(){
				this.$refs['password'].close();
			},
			validatePwd(){
				if(!this.pwd){
					this.app._toast('请输入资金密码');
				}else if(this.pwd != this.wallet.pin){
					this.app._toast('资金密码输入错误，请检查');
				}else{
					if(this.type == 1){
						uni.navigateTo({
							url: '../export/mnemonic'
						});
					}else{
						uni.navigateTo({
							url: '../export/privatekey'
						});
					}
				}
			}
		}
	}
</script>

<style scoped>
	.content{padding-top: 20upx;}
	.content>.flex-between{padding: 30upx 24upx;background-color: #FFFFFF;}
	.password-wrap{background-color: #FFFFFF;padding: 0 0 60upx;}
	.password-wrap .title{text-align: center;position: relative;padding: 30upx 0;}
	.password-wrap .title .iconfont{position: absolute;right: 20upx;top: 32upx;}
	.pwd-pop-content{padding: 0 60upx 40upx;}
	.password-wrap input{border: 1px solid #EDEDED;width: 100%;height: 80upx;border-radius: 12upx;padding: 0 20upx;box-sizing: border-box;margin-bottom: 20upx;}
	.password-wrap button{height: 80upx;line-height: 80upx;}
</style>
