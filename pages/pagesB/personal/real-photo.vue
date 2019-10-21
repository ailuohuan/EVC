<template>
	<view class="content">
		<uni-steps class="steps1" :options="list1" :active="active" :activeColor="activeColor" />
		<view class="flex-between margin-top">
			<view class="">
				<view class="text-center margin-top">
					请上传身份证正面
				</view>
				<view class="photo-box margin-top">
					<image class="photo-in" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="text-center margin-top">
					请上传身份证背面
				</view>
				<view class="photo-box margin-top">
					<image class="photo-in" src="../../../static/images/pagesA/my/id-car2.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="font-blue margin-top tip-text ">
			注意事项：请上传手持身份证的正反面图片
		</view>

		<view class="">
			<view class="flex-between ">
				<view class="photo-box2 margin-top">
					<image class="photo-in2 photo-in4" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>
				
				<view class="photo-box2 margin-top">
					<image class=" photo-in2 photo-in5" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>

				<view class="photo-box2 margin-top">
					<image class=" photo-in2 photo-in6" src="../../../static/images/pagesA/my/id-car3.png" mode=""></image>
				</view>

				<view class="photo-box2 margin-top">
					<image class=" photo-in2 photo-in7" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>
			</view>
			<view class=" tip-text2 flex-between text-center">
				<view class="photo-tip">
					标准
				</view>
				<view class="photo-tip photo-tip1">
					边框缺失
				</view>
				<view class="photo-tip photo-tip2">
					照片模糊
				</view>
				<view class="photo-tip photo-tip3">
					闪光强烈
				</view>
			</view>
			<view class="bottom-btn">
				<button class="blue margin-top" hover-class="none" :style="{opacity:opcity}" @click="backupMnemonic">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSteps from '@/components/uni-steps.vue'
	export default {
		components: {

			uniSteps
		},
		data() {
			return {
				activeColor: "#4C70FF",
				list1: [{
					title: '',
					desc: '请填写身份信息'
				}, {
					title: '',
					desc: '请上传身份证反面'
				}],
				active: 3,
				emailNum: '',
				password: '',
				opcity: 0.5
			}
		},
		onLoad() {

		},
		onReady() {

		},
		methods: {
			backupMnemonic() {
				uni.navigateTo({
					url: "backupMnemonic1"
				})
			},
			change(e) {
				console.log(e.detail.value.length)
				if (e.detail.value.length >= 3) {
					this.opcity = 1
				} else {
					this.opcity = 0.5
				}
			}

		}
	}
</script>

<style scoped lang="scss">
	.content {
		background-color: #fff;
		padding: 0 32rpx;
		color: #333;
		height: 1624rpx;

		.photo-box {
			height: 252rpx;
			width: 328rpx;
			background-color: rgba(229, 245, 255, 1);
			border-radius: 10rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.photo-in {
				width: 200rpx;
				height: 128rpx;
			}
		}

		.photo-box2 {
			height: 110rpx;
			width: 150rpx;
			background-color: rgba(229, 245, 255, 1);
			border-radius: 10rpx;
		
			position: relative;
			.photo-in2 {
				position: absolute;
				top: 24rpx;
				width: 100rpx;
				height: 62rpx;
			}
			.photo-in4{
				left: 26rpx;
			}
			.photo-in5{
				left: 66rpx;
			}
			.photo-in6{
				left: 20rpx;
			}
			.photo-in7{
				left: 26rpx;
			}
		}
	}

	button.blue {
		margin-bottom: 20rpx;
		margin-top: 80rpx;
		opacity: 0.5;
	}
	.bottom-btn{
		margin-top: 150rpx;
	}
	.tip-text{
		margin-top: 80rpx;
	}
	.photo-tip{
		width: 150rpx;
		text-align: center;
	}

	.tip-text2{
		margin-top: 20rpx;
	}
	
</style>
