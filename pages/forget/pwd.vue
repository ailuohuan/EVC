<template>
	<view>
		<view class="input-wrap">
			<view>
				<input :type="hidden ? 'password' : 'text'" placeholder="设置密码(8-20位数字和字母)" placeholder-class="input-placeholder" v-model="pin">
				<i class="iconfont font-gray" :class="hidden ? 'icon-yanjing-biyan' : 'icon-yanjing-zhengyan'" @click="hidden = !hidden"></i>
			</view>
			<view><input type="password" placeholder="确认密码" placeholder-class="input-placeholder" v-model="surepin"></view>
		</view>
		<button class="blue" hover-class="none" :loading="disabled" :disabled="disabled" @click="resetPwd">确认</button>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				hidden: true,
				pin: '',
				surepin: '',
				wallet: {},
				disabled: false,
				mold: 1,//1：忘记密码，2：导入钱包重置密码
				type: 1,//1：助记词导入钱包，2：私钥导入钱包
				value: ''
			}
		},
		onLoad(opt) {
			this.wallet = this.$Wallet.getCurrentWallet();
			this.mold = opt.mold;
			if(this.mold == 2){
				this.type = opt.type;
				this.value = opt.value;
			}
		},
		methods: {
			resetPwd(){
				if(!this.app._checkPwd(this.pin)){
					this.app._toast('密码由8-20位数字和字母组成');return;
				}
				if(this.pin != this.surepin){
					this.app._toast('两次密码输入不一致');return;
				}
				uni.showLoading({
				    title: '提交中'
				});
				if(this.mold == 2){
					if(this.type == 1){
						this.$Wallet.importByMnemonic(this.value,this.pin,this.callback);
					}else{
						this.$Wallet.importByPrivateKey(this.value,this.pin,this.callback);
					}
				}else{
					let walletList = this.$Wallet.getWalletList() , ecodeWalletList = [];
					for(let i = 0 , len = walletList.length; i < len; i++){
						if(walletList[i].privateKey === this.wallet.privateKey){
							walletList[i].pin = this.pin;
						}
						ecodeWalletList.push(this.$Wallet.ecodeDes3JSON(walletList[i]));
					}
					uni.setStorageSync(this.app._cacheWallet,ecodeWalletList);
					uni.hideLoading();
					this.app._toast('密码重置成功');
					setTimeout(function(){
						uni.switchTab({
							url: "../wallet/wallet"
						})
					},300);
				}
			},
			callback(){
				this.app._toast('钱包导入成功');				
				setTimeout(function(){
					uni.hideLoading();
					uni.switchTab({
						url: "../wallet/wallet"
					})
				},300);
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.input-wrap{padding: 100upx 15%;}
	.input-wrap>view{border-bottom: 1px solid #ECECEC;padding: 20upx 0;margin-bottom: 40upx;display: flex;align-items: center;}
	.input-wrap input{flex: 1;}
	button.blue{margin-bottom: 20upx;margin-top: 80upx;}
</style>
