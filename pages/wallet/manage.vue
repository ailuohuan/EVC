<template>
	<view>
		<view class="wallet-list">
			<view class="item" v-for="(item,index) in 3" :key="index">
				<view class="text-right dott" @click.stop="manage"><i class="iconfont icon-more"></i></view>
				<view class="address">
					<view class="title">ETH-Wallet</view>
					<view class="text-overflow font-small">asdfasdfhlasdfgsdfgsdfg</view>
				</view>
				<image src="../../static/images/ETH@2x.png" class="bg" mode="widthFix"></image>
			</view>
		</view>
		<!-- 底部钱包操作弹窗 -->
		<uni-popup ref="wallet" type="bottom" :custom="true">
			<view class="wallet-operate">
				<navigator class="item" url="create">创建钱包</navigator>
				<navigator class="item" url="import">导入钱包</navigator>
				<view class="cancle" @click="canclePopup">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				this.togglePopup();
			}
		},
		methods: {
			togglePopup() {
				 this.$refs['wallet'].open();
			},
			canclePopup(){
				this.$refs['wallet'].close();
			},
			manage(){
				uni.navigateTo({
					url: 'backup'
				});
			}
		}
	}
</script>

<style scoped>
	.wallet-list{padding: 24upx;}
	.wallet-list .dott{position: absolute;right: 20upx;top: 14upx;z-index: 20;}
	.wallet-list .icon-more{font-size: 50upx;}
	.wallet-list .item{background:linear-gradient(180deg,rgba(0,153,255,1) 0%,rgba(0,135,225,1) 100%);border-radius: 12upx;margin-bottom: 20upx;color: #FFFFFF;padding: 34upx 20upx;position: relative;}
	.wallet-list .address{position: relative;}
	.wallet-list .address .title{opacity: 0.9;margin-bottom: 10upx;}
	.wallet-list .address .font-small{opacity: 0.7;}
	.wallet-operate{background-color: #FFFFFF;}
	.wallet-operate .item{border-bottom: 1px solid #F7F7F7;text-align: center;padding: 30upx 0;}
	.wallet-operate .cancle{border-top: 20upx solid #F8F8F8;padding: 30upx 0;text-align: center;}
	.wallet-list .bg{position: absolute;width: 40upx;right: 30upx;bottom: 0;}
</style>
