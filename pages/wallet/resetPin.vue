<template>
	<view>
		<view class="input-wrap">
			<view>
				<input :type="hidden ? 'password' : 'text'" placeholder="设置PIN(8-20位数字和字母)" placeholder-class="input-placeholder" v-model="pin">
				<i class="iconfont font-gray" :class="hidden ? 'icon-yanjing-biyan' : 'icon-yanjing-zhengyan'" @click="hidden = !hidden"></i>
			</view>
			<view><input type="password" placeholder="确认PIN" placeholder-class="input-placeholder" v-model="surepin"></view>
		</view>
		<button class="blue" hover-class="none">确认</button>
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
				wallet: ''
			}
		},
		onLoad() {
			this.wallet = this.$Wallet.getCurrentWallet();
		},
		methods: {

		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.input-wrap{padding: 100upx 15%;}
	.input-wrap>view{border-bottom: 1px solid #ECECEC;padding: 20upx 0;margin-bottom: 40upx;display: flex;align-items: center;}
	.input-wrap input{flex: 1;}
	button.blue{margin-bottom: 20upx;margin-top: 80upx;opacity: 0.5;}
</style>
