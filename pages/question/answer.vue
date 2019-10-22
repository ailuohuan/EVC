<template>
	<view class="content">
		<view class="block">问：{{answer.Question}}</view>
		<view>{{answer.Answer}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageLoad: false,
				answer: {}
			}
		},
		onLoad(opt){
			this.answer = JSON.parse(opt.item);
		},
		methods: {
		}
	}
</script>

<style scoped>
	.content>view{padding: 30upx 20upx;}
	.block{background-color: #FFFFFF;}
</style>
