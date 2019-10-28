<template>
	<view>
		<navigator class="flex-between block" url="answer?type=1">
			<text>基础操作</text>
			<i class="iconfont iconreturn-copy-copy-copy font-gray"></i>
		</navigator>
		<navigator class="flex-between block" url="answer?type=2">
			<text>钱包安全</text>
			<i class="iconfont iconreturn-copy-copy-copy font-gray"></i>
		</navigator>
		<navigator class="flex-between block" url="answer?type=3">
			<text>助记词、私钥和Keystore</text>
			<i class="iconfont iconreturn-copy-copy-copy font-gray"></i>
		</navigator>
		<navigator class="flex-between block" url="answer?type=4">
			<text>转账收款</text>
			<i class="iconfont iconreturn-copy-copy-copy font-gray"></i>
		</navigator>
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
		}
	}
</script>

<style scoped>
	.block{background-color: #FFFFFF;padding: 30upx 20upx;}
	.block text{margin-right: 40upx;}
</style>
