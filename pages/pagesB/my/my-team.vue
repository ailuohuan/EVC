<template>
	<view class="content padding">
		<view class="middle text-center" @tap="jumpToMyTeam2">
			<view class="all">
				<text>团队总业绩(社区收益{{ratio}}%)</text>
			</view>
			<view class="all-num ">
				<text class="font-bold">{{teamAchievement}}</text>  <text class="font-middle">USTD</text>
			</view>
			<view class="flex-between">
				<text>团队人数：{{team}}</text>｜<text>有效直推人数：{{invite}}</text>
			</view>
			<view class="level">
				<image class="level-img" src="../../../static/images/pagesA/my/reporter.png" mode=""></image>
				<text>{{level}}</text>
			</view>
		</view>
		<view class="team-text font-bold font-middle">
			团队列表
		</view>
		<view class="list" v-for="item in inviteList" :key="item.id">
			<view class="list-item">
				<view class="list-item-left">
					<image class="img" :src="item.Avatar" mode="widthFix"></image>
					<view class="">
						<view class="flex-row">
							<view class="font-middle">
								{{item.Name}}
							</view>
							<view class="list-level">
								<image class="list-level-img" src="../../../static/images/pagesA/my/reporter.png" mode=""></image>
								<text>{{item.Level}}</text>
								
							</view>
						</view>
						
						<view class="name-ch">
							{{item.Phone}}
						</view>
					</view>
				</view>
				<view class="">
					<view class="">
						团队：{{item.TeamNumber}}人
					</view>
				</view>
			</view>
			<view class="flex-between padding border-bottom padding-bottom ">
				<view class="">
					<view class="">
						个人业绩
					</view>
					<view class="">
						<text class="orange font-bold">{{item.Achievement}}</text><text>USDT</text>
					</view>
				</view>
				<view class="">
					<view class="">
						团队业绩
					</view>
					<view class="">
						<text class="orange font-bold">{{item.TeamAchievement}}</text><text>USDT</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				ratio:'',
				team:'',
				teamAchievement:'',
				level:'',
				invite:'',
				inviteList:[]
			};
		},
		onLoad() {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base._isLogin()
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
						if (this.$base._indexOf(res.data.status)) {
							this.$base._isLogin()
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
				//直推列表
				
				uni.request({
					url: this.baseUrl + "/invite-list",
					data:{
						page:1,
						count:100000
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						 if (res.data.status == 1) {
							this.inviteList = res.data.data.list
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			jumpToMyTeam2(){
				uni.navigateTo({
					url:"./my-team2"
				})
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
		.list-level{
			width: 120rpx;
			height: 32rpx;
			border:2rpx solid #0099FF;
			border-radius: 18rpx;
			font-size: 20rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			color: #0099FF;
			margin-left: 10rpx;
			.list-level-img{
				width: 20rpx;
				height: 20rpx;
				margin-right: 6rpx;
			}
		}
		
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
	.padding-bottom{
		padding-bottom: 20rpx;
	}
</style>
