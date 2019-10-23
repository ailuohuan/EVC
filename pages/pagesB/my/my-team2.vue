<template>
	<view class="content padding">
		<view class="middle text-center" >
			<view class="all">
				<text>团队总业绩(社区收益{{ratio}}%)</text>
			</view>
			<view class="all-num ">
				<text class="font-bold">{{$base1._toFixed(teamAchievement,4) }}</text>  <text class="font-middle">USDT</text>
			</view>
			<view class="flex-between">
				<text>团队人数：{{$base1._showZero(team) }}</text>｜<text>有效直推人数：{{$base1._showZero(invite)}}</text>
			</view>
			<view class="level">
				<image class="level-img" :src="showLevelImg(level)" mode=""></image>
				<text>{{level}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				team:'',
				teamAchievement:'',
				ratio:'',
				level:'',
				invite:''
			};
		},
		onLoad() {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base1._isLogin()
			}
			this.initData()
		},
		onReady() {
		},
		onPullDownRefresh() {
			this.initData()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			initData() {
				//我的团队上面蓝色框框的数据
				uni.request({
					url: this.baseUrl + "/member-invite",
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							this.team = res.data.data.Team
							this.teamAchievement = res.data.data.TeamAchievement
							this.ratio = res.data.data.Ratio
							this.level = res.data.data.Level
							this.invite = res.data.data.Invite
							
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			showLevelImg(level){
				if(level=="普通会员"){
					return ''
				}else if(level=="记者"){
					return '../../../static/images/pagesA/my/reporter.png'
				}else if(level=="主编"){
					return '../../../static/images/pagesA/my/editor.png'
				}else if(level=="台长"){
					return '../../../static/images/pagesA/my/head.png'
				}else if(level=="编辑"){
					return '../../../static/images/pagesA/my/editor.png'
				}
			}
			
			
		}
	}
</script>

<style lang="scss">
	.orange{
		color: #FF3400;
	}
	.content {
		background-color: #fff;
		height: 100%;
		box-sizing: border-box;
		font-size: 30rpx;
		
		
		.top {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 68rpx;

			.logo {
				width: 180rpx;
				height: 48rpx;
			}

			.icon {
				font-weight: 600;
			}
		}

		.middle {
			height: 240rpx;
			background: linear-gradient(#5D3CFF, #6791F7);
			border-radius: 10rpx;
			margin-top: 24rpx;
			color: #fff;
			padding: 30rpx 36rpx;
			position: relative;
			.level{
				position: absolute;
				top: 30rpx;
				right: 0;
				width: 142rpx;
				height: 60rpx;
				background: #fff;
				border-bottom-left-radius: 30rpx;
				border-top-left-radius: 30rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				color: #0099FF;
				.level-img{
					height: 36rpx;
					width: 34rpx;
				}
			}
			.all {
				font-size: 24rpx;
			}

			.all-num {
				font-size: 58rpx;
				line-height: 100rpx;
				margin-top: 30rpx;
			}

			.all-num-equal {
				font-size: 30rpx;
			}

			.icon {
				font-size: 32rpx;
			}
		}
		.team-text{
			height: 100rpx;
			line-height: 100rpx;
		}
		.list {
			font-size: 22rpx;

			.list-item {
				height: 160rpx;
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;

				.name-en {
					font-size: 36rpx;
					color: #333;
					font-weight: bold;
				}

				.name-ch {
					font-size: 22rpx;
					color: #999;
				}

				.list-item-left {
					display: flex;
					flex-direction: row;

					.img {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 20rpx;
					}
				}

			}
		}

	}
</style>
