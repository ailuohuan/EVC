<template>
	<view class="content">
		<view class="message-list">
			<navigator class="item" url="detail" v-for="(item,index) in 5" :key="index">
				<view class="flex-between">
					<text>ETH：0.004 转账成功</text>
					<text class="font-small font-gray">2019-09-09 23:34</text>
				</view>
				<view class="font-small font-gray">收款地址：asdfhkasjdfkljsdklfj</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.content{padding-top: 20upx;}
	.message-list{background-color: #FFFFFF;padding: 0 24upx;}
	.message-list .item{border-bottom: 1px solid #F9F9F9;padding: 26upx 0;line-height: 1.8;}
</style>
