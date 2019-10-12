<template>
	<view class="content">
		<view class="text-center">
			<i class="iconfont icon-xiangmuwancheng font-blue"></i>
			<view class="font-gray font-small tip">请按顺序选择助记词</view>
		</view>
		<view class="mnemonic-input">
			<textarea placeholder="请按顺序选择助记词" placeholder-class="input-placeholder"></textarea>
		</view>
		<view class="mnemonic-wrap">
			<view class="item" v-for="(item,index) in 10" :key="index">adsfsdf</view>
		</view>
		<view class="flex">
			<button class="plain blue" @click="before">上一步</button>
			<button class="blue">确认备份</button>
		</view>
		<navigator class="text-center footer font-blue" hover-class="none">跳过此步，以后备份</navigator>
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
			before(){
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding: 60upx 15% 0;}
	.icon-xiangmuwancheng{font-size: 120upx;}
	.tip{margin: 40upx 0;}
	.mnemonic-input{margin-bottom: 30upx;}
	.mnemonic-input textarea{background-color: #E5F5FF;width: 100%;height: 240upx;padding: 20upx;box-sizing: border-box;border-radius: 12upx;}
	.mnemonic-wrap{display: flex;flex-wrap: wrap;margin-bottom: 30upx;}
	.mnemonic-wrap .item{background-color: #E5F5FF;color: #999999;border-radius: 12upx;padding: 6upx 14upx;margin-right: 20upx;margin-bottom: 20upx;}
	button.plain{margin-right: 20upx;}
	.footer{position: fixed;bottom: 40upx;width: 100%;left: 0;}
</style>
