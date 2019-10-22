<template>
	<view class="content">
		<view class="input-wrap">
			<view>	
				<input class="input-num margin-top" placeholder="请输入昵称" placeholder-class="input-placeholder" v-model="nickname" @input="change" />
			</view>
		</view>
		<view class="margin-top">
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="setNickName">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: '',
				opcity: 0.5
			}
		},
		onLoad() {
		},
		onReady() {

		},
		methods: {
			setNickName() {
				//修改用户昵称
				uni.request({
					url: this.baseUrl + "/member-modify-nick",
					method:"POST",
					data:{
						NickName:this.nickname
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
							uni.navigateTo({
								url:"./personal-info"
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			change(e) {
				console.log(e.detail.value.length)
				if (e.detail.value.length >= 1) {
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
		font-size: 24rpx;
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
