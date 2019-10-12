<template>
	<view>
		<view class="nav">
			<view class="active">助记词导入</view>
			<view>私钥导入</view>
		</view>
		<view class="text-center import-wrap">
			<image src="../../static/images/import.png" mode="widthFix"></image>
			<view class="font-small font-gray">
				<view>按顺序输入助记词</view>
				<view>助记词之间请用英文“,”隔开</view>
			</view>
			<view class="text-left">
				<textarea placeholder="请输入助记词" placeholder-class="input-placeholder"></textarea>
			</view>
			<view>
				<button class="blue" hover-class="none" @click="importWallet">确认导入</button>
				<view class="font-small text-center">
					<text class="font-gray">导入即表示同意</text>
					<text class="font-blue">《用户服务协议》</text>
				</view>
			</view>
		</view>
		<navigator class="font-blue footer" hover-class="none">创建钱包</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {
			importWallet(){
				uni.navigateTo({
					url: 'resetPin'
				})
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
