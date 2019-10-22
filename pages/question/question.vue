<template>
	<view>
		<navigator class="flex-between block" v-for="(item,index) in questionList" :key="index" :url="'answer?item='+JSON.stringify(item)">
			<text>{{item.Question}}</text>
			<i class="iconfont iconreturn-copy-copy-copy font-gray"></i>
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				questionList: []
			}
		},
		onLoad() {
			this.getData();
		},
		methods: {
			getData(){
				let self = this;
				uni.request({
					url: self.baseUrl + '/common-question',
					method: 'GET',
					data: {},
					success: res => {
						if(res.data.status == 1){
							self.questionList = res.data.data;
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style scoped>
	.block{background-color: #FFFFFF;padding: 30upx 20upx;}
	.block text{margin-right: 40upx;}
</style>
