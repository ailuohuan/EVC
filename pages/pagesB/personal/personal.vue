<template>
	<view>
		<view class="user-wrap">
			<view class="user-bg">
				<view class="top text-center">
					<view class="hot" v-show="status==1" @tap="unsealing">
						{{status==0?"":"点击解封"}}
					</view>
					<image class="head-img" :src="avatar" mode=""></image>
					<view class="padding-top margin-top font-middle">
						{{nickname}} <text class="iconfont" @tap="jumpToPersonalInfo">&#xe64a;</text>
					</view>
					<view class="flex-around">
						<view class="" @tap="jumpToInvite">
							<view class="">
								<image class="choice-img" src="../../../static/images/pagesA/my/re-name.png" mode=""></image>
							</view>
							<view class="font22">
								邀请好友
							</view>
						</view>
						<view class="">
							<view class="">
								<image class="choice-img" src="../../../static/images/pagesA/my/invite.png" mode=""></image>
							</view>
							<view class="font22">
								实名认证
							</view>
						</view>
						<view class="">
							<view class="">
								<image class="choice-img" src="../../../static/images/pagesA/my/film.png" mode=""></image>
							</view>
							<navigator url="./my-bill">
								<view class="font22">
									我的账单
								</view>
							</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<navigator class="block border-bottom flex-between item margin-top100" url="./self-in">
			<view class="flex">
				<i class="iconfont font-big icon-RectangleCopy"></i>
				<text>安全中心</text>
			</view>
			<i class="iconfont icon-return-copy-copy-copy font-gray"></i>

		</navigator>

		<view class="block item-wrap ">
			<navigator url="./binding-phone">
				<view class="item flex-between border-bottom">
					<view class="flex">
						<i class="iconfont font-big  icon-RectangleCopy2"></i>
						<text>绑定手机</text>
					</view>
					<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				</view>
			</navigator>
			<view class="item flex-between border-bottom">
				<view class="flex">
					<i class="iconfont font-big  icon-bangzhu"></i>
					<text>帮助与反馈</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			</view>
			<view class="item flex-between border-bottom">
				<view class="flex">
					<i class="iconfont font-big  icon-RectangleCopy3"></i>
					<text>用户协议</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			</view>
			<view class="item flex-between border-bottom">
				<view class="flex">
					<i class="iconfont font-big  icon-wode"></i>
					<text>关于我们</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			</view>
		</view>
		<view class="" v-show="status==1">
			<view class="font-red text-center font22 margin-top">
				账号已被禁封，收益停止产生
			</view>
			<view class="font-red text-center font22 ">
				解封后收益正常产生
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: '',
				avatar: '',
				status:''
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				uni.navigateTo({
					url: '../message/message'
				})
			}
		},

		onLoad() {
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
						this.status = res.data.data.IsForbidden
						this.status = 1
						
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
			jumpToPersonalInfo() {
				uni.navigateTo({
					url: "./personal-info"
				})
			},
			unsealing(){
				uni.navigateTo({
					url:"./unsealing"
				})
				
			}
		}
	}
</script>

<style scoped>
	.font22{
		font-size: 22rpx;
	}
	.user-wrap {
		background-color: #0099FF;
		height: 400upx;
		padding-top: var(--status-bar-height);
	}

	.user-bg {
		height: 426rpx;
		background: linear-gradient(#0099FF, #C1E6FF, #FFFFFF);
	}

	.top {
		width: 686rpx;
		height: 306rpx;
		border-radius: 10rpx;
		background-color: #fff;
		position: absolute;
		top: 188rpx;
		left: 32rpx;
	}

	.hot {
		position: absolute;
		top: 0;
		right: 0;
		width: 84rpx;
		height: 34rpx;
		background-color: #ccc;
		border-bottom-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		line-height: 34rpx;
	}

	.head-img {
		height: 120rpx;
		width: 120rpx;
		border-radius: 50%;
		position: absolute;
		z-index: 3;
		top: -60rpx;
		left: 290rpx;
	}

	.choice-img {
		width: 60rpx;
		height: 60rpx;
	}

	.font22 {
		font-size: 22rpx;
	}

	.user-bg .tx {
		width: 160upx;
		height: 160upx;
		border-radius: 50%;
		overflow: hidden;
		background-color: #FFFFFF;
		margin: 0 auto 20upx;
	}

	.user-bg .tx image {
		width: 100%;
		height: 100%;
	}

	.user-bg .address {
		width: 65%;
		margin: 0 auto;
		color: #FFFFFF;
		text-align: center;
	}

	.block {
		background-color: #FFFFFF;
	}

	.item-wrap {
		margin-top: 20upx;
	}

	.item {

		padding: 30upx 24upx;
	}

	.item .flex .iconfont {
		margin-right: 16upx;
		position: relative;
		top: 4upx;
	}

	.margin-top100 {
		margin-top: 100rpx;
	}
</style>
