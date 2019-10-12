<template>
	<view class="content">
		<view class="flex-between" @click="togglePopup">
			<text>导出助记词</text>
			<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
		</view>
		<view class="flex-between" @click="togglePopup">
			<text>导出私钥</text>
			<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
		</view>
		<uni-popup ref="password" type="bottom" :custom="true">
			<view class="password-wrap">
				<view class="title">
					<text>请输入PIN码</text>
					<i class="iconfont icon-guanbi1" @click="canclePopup"></i>
				</view>
				<view class="input-wrap">
					<input type="password" />
					<button class="blue">确认</button>
				</view>
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
		methods: {
			togglePopup() {
				 this.$refs['password'].open();
			},
			canclePopup(){
				this.$refs['password'].close();
			},
		}
	}
</script>

<style scoped>
	.content{padding-top: 20upx;}
	.content>.flex-between{padding: 30upx 24upx;background-color: #FFFFFF;}
	.password-wrap{background-color: #FFFFFF;}
	.password-wrap .title{text-align: center;position: relative;padding: 30upx 0;}
	.password-wrap .title .iconfont{position: absolute;right: 20upx;top: 32upx;}
	.password-wrap .input-wrap{display: flex;align-items: center;padding: 30upx 50upx 60upx;}
	.password-wrap input{border: 1px solid #EDEDED;margin-right: 30upx;width: 90%;height: 80upx;border-radius: 12upx;padding: 0 20upx;box-sizing: border-box;}
	.password-wrap button{height: 80upx;line-height: 80upx;opacity: 0.5;}
</style>
