<template>
	<view class="content">
		<view class="text-center">
			<i class="iconfont icon-xiangmuwancheng font-blue"></i>
			<view class="font-gray font-small tip">助记词是您管理、导入EVC钱包的唯一凭证请务必牢记备份。</view>
		</view>
		<view class="mnemonic-wrap">
			<view class="item" v-for="(item,index) in 10" :key="index">adsfsdf</view>
		</view>
		<button class="blue" hover-class="none" @click="next">下一步</button>
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
			next(){
				uni.navigateTo({
					url: 'backupMnemonic'
				})
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding: 60upx 15% 0;}
	.icon-xiangmuwancheng{font-size: 120upx;}
	.tip{margin: 40upx 0 60upx;}
	.mnemonic-wrap{display: flex;flex-wrap: wrap;margin-bottom: 30upx;}
	.mnemonic-wrap .item{background-color: #E5F5FF;color: #999999;border-radius: 12upx;padding: 6upx 14upx;margin-right: 20upx;margin-bottom: 20upx;}
	button{width: 100%;margin-top: 60upx;}
</style>
