<template>
	<view class="content">

		<view class="input-wrap">
			<view>	
				<input class="input-num margin-top" placeholder="请输入昵称" placeholder-class="input-placeholder" v-model="emailNum" @input="change" />
			</view>
		</view>
		<view class="margin-top">
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="backupMnemonic">提交</button>
		
		</view>

	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				activeColor: "#4C70FF",
				list1: [{
					title: '',desc:'请填写身份信息'
				}, {
					title: '',desc:'请上传身份证反面'
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
		padding: 0 56rpx;
		font-size: 24rpx;
		color: #333;
		height: 1334rpx;

		.logo {
			width: 86px;
			height: 86rpx;
			margin: 60rpx auto 50rpx;
		}

		.logo-img {
			width: 160rpx;
			height: 160rpx;
		}

		.forget-password {
			margin-left: 500rpx;
		}
	}


	.input-wrap>view {
		
		padding: 20rpx 0;
		margin-bottom: 40rpx;
	}

	.input-num{
		background-color: rgba(229, 245, 255, 1);
		height: 100rpx;
		font-size: 12rpx;
		border-radius: 10rpx;
		padding-left: 20rpx;
	}
	.input-wrap input {
		flex: 1;
	}

	button.blue {
		margin-bottom: 20rpx;
		margin-top: 140rpx;
		opacity: 0.5;
	}

	.footer {
		position: fixed;
		width: 100%;
		text-align: center;
		bottom: 60rpx;
	}
</style>
