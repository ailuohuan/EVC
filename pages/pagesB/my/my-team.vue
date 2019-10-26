<template>
	<view class="content padding">
		<view class="middle text-center">
			<view class="all">
				<text>团队总业绩(社区收益{{$base1._showZero(ratio*100)}}%)</text>
			</view>
			<view class="all-num ">
				<text class="font-bold">{{$base1._toFixed(teamAchievement,4)}}</text>  <text class="font-middle">USDT</text>
			</view>
			<view class="flex-between">
				<text>团队人数：{{$base1._showZero(team) }}</text>｜<text>有效直推人数：{{$base1._showZero(invite)}}</text>
			</view>
			<view class="level">
				<image class="level-img" :src="showLevelImg(level)" mode=""></image>
				<text>{{level}}</text>
			</view>
		</view>
		<view class="team-text font-bold font-middle">
			团队列表
		</view>
		<view class="list-box">
			<view class="list" v-for="item in inviteList" :key="item.id">
				<view class="list-item">
					<view class="list-item-left">
						<image class="img" :src="domain + item.Avatar" mode="scaleToFill"></image>
						<view class="">
							<view class="flex-row">
								<view class="font-middle">
									{{item.Name}}
								</view>
								<view class="list-level">
									<image class="list-level-img" :src="showLevelImg(item.Level)" mode=""></image>
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
				<view class="flex-between padding border-bottom  padding-bottom ">
					<view class="">
						<view class="">
							个人业绩
						</view>
						<view class="">
							<text class="orange font-bold">{{$base1._toFixed(item.Achievement,4) }}</text><text>USDT</text>
						</view>
					</view>
					<view class="">
						<view class="">
							团队业绩
						</view>
						<view class="">
							<text class="orange font-bold">{{$base1._toFixed(item.TeamAchievement,4) }}</text><text>USDT</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
<evc-tabbar :tag="'team'" :fontColor3="fontColor3" :teamImg="teamImgSelect"></evc-tabbar>

	</view>
</template>

<script>
	import evcTabbar from '@/components/evcTabbar.vue'
	export default {
		components: {evcTabbar},
		data() {
			return {
				fontColor3:'#0099FF',
				teamImgSelect:'../../../static/images/evctabbar/teamselect.png',
				ratio:'',
				team:'',
				teamAchievement:'',
				level:'',
				invite:'',
				inviteList:[],
				levelImg:'',
				domain:''
			};
		},
		onLoad() {
			this.domain=uni.getStorageSync('domain')
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base1._isLogin()
				return
			}
			this.initData()
		},
		onPullDownRefresh() {
			this.initData()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onBackPress(options) {
			var idtag=1
			console.log(idtag)
			if (idtag==1) {
				console.log('222')
				uni.switchTab({
					url:"../../wallet/wallet"
				})
				return true;
			}
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
				height: 140rpx;
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding-top: 60rpx;
				box-sizing: border-box;

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
	.list-box {
		margin-bottom: 96rpx;
	}
</style>
