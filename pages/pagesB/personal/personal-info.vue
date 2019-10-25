<template>
	<view class="content">
		<view class="top top2 flex" @tap="changeAvatar">
			<image class="user-photo" :src="avatar" mode=""></image><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top" @tap="jumpToSetNickname">
			<text>{{nickname}}</text><text class="iconfont icon">&#xea25;</text>
		</view>
		<view class="top">
			<text>账号:{{email}}</text>
		</view>
		<view class="top top2">
			<text>个人业绩：{{$base1._toFixed(achievement,4) }} USDT</text>
		</view>
	</view>
</template>

<script>
	import qiniuUploader from '../../../common/qiniuUploader.js'
	export default {
		
		data() {
			return {
				nickname:'',
				avatar:'',
				email:'',
				achievement:'',
				token:''
			}
		},
		onLoad() {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base1._isLogin()
			}
			this.getUserInfo()
		
		},
		methods: {
			changeAvatar(){
				//修改用户头像
				//获取七牛上传token
				uni.request({
					url: this.baseUrl + "/qiniu-upload",
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 1) {
							//获取七牛返回的token
							this.token = res.data.data.token
							console.log(this.token)
							//选择头像图片获取临时地址
							let _self = this
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album', 'camera'], //从相册选择，或打开照相机
								success: function(res) {
									console.log('res1', res);
									//图片临时地址
									qiniuUploader.upload(res.tempFilePaths[0], (success) => {
										console.log('===========' + success.imageURL);
										uni.request({
											url: _self.baseUrl + '/member-modify-avatar',
											method: 'POST',
											header: {
												//除注册登录外其他的请求都携带用户token和秘钥
												Authorization: uni.getStorageSync('token'),
												SecretKey: uni.getStorageSync('SecretKey')
											},
											data: {
												Avatar: success.imageURL
											},
											success: res => {
												console.log(res.data);
												uni.showToast({
													title:res.data.message,
													icon:"none"
												})
												_self.getUserInfo()
												
											},
											fail: () => {},
											complete: () => {}
										});
									}, (error) => {
										console.log(error);
									}, {
										region: 'SCN',
										key: new Date().getTime().toString(),
										uptoken: _self.token
									}, (res) => {
										console.log('上传进度', res.progress);
									})
								},
								error: (e) => {
									console.log(e);
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			jumpToSetNickname(){
				//修改用户昵称
				uni.navigateTo({
					url:"./set-nickname"
				})
			},
			getUserInfo(){
				//获取用户信息
				uni.request({
					url: this.baseUrl + "/member-info",
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							this.nickname = res.data.data.NickName
							this.avatar ='http://ceshi.8kpay.com/' + res.data.data.Avatar
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
