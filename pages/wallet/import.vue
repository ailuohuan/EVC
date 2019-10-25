<template>
	<view>
		<view class="nav">
			<view :class="type == 1 ? 'active' : ''" @click="typeChange(1)">助记词导入</view>
			<view :class="type == 2 ? 'active' : ''" @click="typeChange(2)">私钥导入</view>
		</view>
		<view class="text-center import-wrap">
			<image src="../../static/images/import.png" mode="widthFix"></image>
			<view class="font-small font-gray" v-if="type == 1">
				<view>按顺序输入助记词</view>
				<view>助记词之间请用英文“,”隔开</view>
			</view>
			<view class="font-small font-gray" v-if="type==2">
				<view>请输入正确私钥</view>
				<view>如未导出私钥，请选择助记词导入</view>
			</view>
			<view class="text-left">
				<textarea :placeholder="type == 1 ? '请输入助记词' : '请输入私钥'" placeholder-class="input-placeholder" v-model="value"></textarea>
			</view>
			<view>
				<button class="blue" hover-class="none" @click="importWallet">确认导入</button>
				<view class="font-small text-center">
					<text class="font-gray">导入即表示同意</text>
					<text class="font-blue">《用户服务协议》</text>
				</view>
			</view>
		</view>
		<navigator open-type="navigateBack" class="font-blue footer" hover-class="none">创建钱包</navigator>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				type: 1,//1：助记词导入钱包，2：私钥导入钱包
				value: ''
			}
		},
		methods: {
			typeChange(val){
				this.type = val;
				if(val == 1){
					uni.setNavigationBarTitle({
						title: '助记词导入'
					})
				}else{
					uni.setNavigationBarTitle({
						title: '私钥导入'
					})
				}
			},
			importWallet(){
				let wallet = this.$Wallet.getWalletList();
				let templist = wallet.filter(item => {
					return item.privateKey == this.value || item.mnemonic == this.value;
				});
				if(templist.length){
					this.app._toast('钱包已经存在，不需再次导入');return;
				}
				if(!this.value){
					if(this.type == 1) this.app._toast('请输入助记词');
					else this.app._toast('请输入私钥');
				}else{
					let self = this;
					uni.navigateTo({
						url: `../forget/pwd?mold=2&type=${self.type}&value=${self.value}`
					})
				}
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.nav{display: flex;justify-content: space-around;color: #999999;font-size: 32upx;padding: 30upx 0;}
	.nav .active{font-weight: bold;color: #1F91F2;}
	.nav .active:after{content: '';display: block;background-color: #1F91F2;height: 8upx;width: 80upx;border-radius: 10upx;margin: 10upx auto;}
	.import-wrap{padding: 0 15%;}
	.import-wrap image{width: 140upx;margin: 60upx 0 40upx;}
	textarea{background-color: #E5F5FF;width: 100%;height: 240upx;padding: 20upx;box-sizing: border-box;border-radius: 12upx;margin: 40upx 0 60upx;}
	button.blue{margin-bottom: 20upx;}
	.footer{position: fixed;width: 100%;text-align: center;bottom: 60upx;}
</style>
