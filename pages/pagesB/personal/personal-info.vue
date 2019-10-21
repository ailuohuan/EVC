<template>
	<view class="content">
		<view class="top top2 flex" @tap="changeAvatar">
			<image class="user-photo" :src="avatar" mode=""></image><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top" @tap="jumpToSetPassword">
			<text>{{nickname}}</text><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top" @tap="jumpToResetPin">
			<text>账号:{{email}}</text>
		</view>
		<view class="top top2" @tap="jumpToResetPin">
			<text>个人业绩：{{achievement}} USDT</text>
		</view>
	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				nickname:'',
				avatar:'',
				email:'',
				achievement:''
				
			}
		},
		onLoad() {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base._isLogin()
			}
			//获取用户信息
			uni.request({
				url: this.baseUrl + "/member-info",
				header: {
					//除注册登录外其他的请求都携带用户token和秘钥
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data)
					if (this.$base._indexOf(res.data.status)) {
						this.$base._isLogin()
					} else if (res.data.status == 1) {
						this.nickname = res.data.data.NickName
						this.avatar = res.data.data.Avatar
						this.email = res.data.data.Email
						this.achievement = res.data.data.Achievement
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				}
			})
		
		},
		methods: {
			jumpToBindingPhoneNum() {
				uni.navigateTo({
					url: "./binding-phonenum"
				})
			},
			jumpToSetPassword() {
				uni.navigateTo({
					url: "./authentication?id=6"
				})
			},
			jumpToResetPin() {
				if (this.unBindingPhone == true) {
					uni.showModal({
						title: '未绑定手机号',
						content: '点击确定跳转到绑定手机号',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "./binding-phonenum"
								})
							} else if (res.cancel) {

							}
						}
					});
				} else {
					uni.navigateTo({
						url: "./authentication?id=1"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		background-color: #F7F7F7;
		height: 1334rpx;

		.top {
			height: 110rpx;
			line-height: 110rpx;
			background-color: #fff;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			
			padding: 0 26rpx;
			box-sizing: border-box;

			.icon {
				color: #999;
				font-size: 30rpx;
				margin-left: 24rpx;
			}
		}

		.top2 {
			margin-top: 20rpx;
		}
		.user-photo{
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			overflow: hidden;
		}

	}
</style>
