<template>
	<view>
		<view class="user-wrap">
			<view class="user-bg">
				<view class="top text-center">
					<view class="hot" v-if="status==0" :style="{background:showLevelBgc(planLevel)}">
						V{{planLevel}}
					</view>
					<view class="hot" v-else @tap="unsealing">
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
						<view class="" @tap="jumpToRealName">
							<view class="">
								<image class="choice-img" src="../../../static/images/pagesA/my/invite.png" mode=""></image>
							</view>
							<view class="font22">
								实名认证
							</view>
						</view>
						<view class="" @tap="jumpToMyBill">
							<view class="">
								<image class="choice-img" src="../../../static/images/pagesA/my/film.png" mode=""></image>
							</view>

							<view class="font22">
								我的账单
							</view>

						</view>
					</view>
				</view>
			</view>
		</view>
		

		<view class="block item-wrap ">
			<navigator class="block border-bottom flex-between item " url="./self-in">
				<view class="flex">
					<i class="iconfont font-big icon-RectangleCopy"></i>
					<text>安全中心</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
			
			</navigator>
			
				<view @tap="jumpToBindingPhone" class="item flex-between border-bottom">
					<view class="flex">
						<i class="iconfont font-big  icon-RectangleCopy2"></i>
						<text>绑定手机</text>
					</view>
					<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				</view>
				<view @tap="outLogin" class="item flex-between border-bottom">
					<view class="flex">
						<i class="iconfont font-big  icon-guanbi1"></i>
						<text>退出登录</text>
					</view>
					<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				</view>
				
				<view @tap="jumpToBindingAddr" class="item flex-between border-bottom">
					<view class="flex">
						<i class="iconfont font-big  icon-dingwei"></i>
						<text>绑定地址</text>
					</view>
					<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				</view>
			
			<!-- 	<view class="item flex-between border-bottom">
				
				<view class="flex">
					<i class="iconfont font-big  icon-bangzhu"></i>
					<text>帮助与反馈</text>
				</view>
				<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				
			</view> -->
			<navigator url="./userform">
				<view class="item flex-between border-bottom">
					<view class="flex">
						<i class="iconfont font-big  icon-RectangleCopy3"></i>
						<text>用户协议</text>
					</view>
					<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				</view>
			</navigator>
			<navigator url="./aboutus">
				<view class="item flex-between border-bottom">
					<view class="flex">
						<i class="iconfont font-big  icon-wode"></i>
						<text>关于我们</text>
					</view>
					<i class="iconfont icon-return-copy-copy-copy font-gray"></i>
				</view>
			</navigator>
		</view>
		<view class="" v-show="status==1">
			<view class="font-red text-center font22 margin-top">
				账号已被禁封，收益停止产生
			</view>
			<view class="font-red text-center font22 ">
				解封后收益正常产生
			</view>
		</view>
		<evc-tabbar :tag="'my'" :fontColor4="fontColor4" :myImg="myImgSelect"></evc-tabbar>


	</view>
</template>

<script>
	import evcTabbar from '@/components/evcTabbar.vue'
	export default {
		components: {
			evcTabbar
		},
		data() {
			return {
				fontColor4: '#0099FF',
				myImgSelect: '../../../static/images/evctabbar/myselect.png',
				nickname: '',
				avatar: '',
				status: '',
				planLevel: '',
				authState: '',
				i: 1,
				isBindPhone:'',
				bindingAddr:''
			}
		},
		onBackPress(options) {
			
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
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.nickname = res.data.data.NickName
						console.log('111111111111111111'+uni.getStorageSync('domain'))
						
						
						this.avatar = uni.getStorageSync('domain') + res.data.data.Avatar
						this.status = res.data.data.IsForbidden
						this.planLevel = res.data.data.PlanLevel

						//用户实名认证状态
						this.authState = res.data.data.AuthState
						//绑定手机号的状态
						this.isBindPhone = res.data.data.IsBindPhone
						//绑定地址状态
						this.bindingAddr = res.data.data.BindAddress

					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				}
			})
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
			jumpToBindingPhone(){
				if(this.isBindPhone!=1){
					uni.redirectTo({
						url:"./binding-phone"
					})
				}else {
					uni.navigateTo({
						url:"./hasBindingPhone"
					})
				}
			},
			outLogin(){
				uni.showModal({
				    title: '退出',
				    content: '点击确认退出登录',
				    success: function (res) {
				        if (res.confirm) {
				           uni.clearStorage();
							uni.clearStorageSync();
							uni.reLaunch({
								url:"../login/login"
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			jumpToBindingAddr(){
				if(this.bindingAddr==0){
					uni.navigateTo({
						url:"./binding-addr"
					})
				}else{
					uni.navigateTo({
						url:"./hasBindingAddr"
					})
				}
				
			},
			showLevelBgc(level) {
				if (level == 1) {
					return 'linear-gradient(#FF727C, #FFA8AE)'
				} else if (level == 2) {
					return 'linear-gradient(#7FCCFF, #0099FF)'
				} else if (level == 3) {
					return 'linear-gradient(#FFC744, #FF9100)'
				}
			},
			jumpToInvite() {
				uni.navigateTo({
					url: "./invite"
				})
				
			},
			jumpToPersonalInfo() {
				uni.redirectTo({
					url: "./personal-info"
				})
			},
			unsealing() {
				uni.navigateTo({
					url: "./unsealing"
				})

			},
			jumpToRealName() {
				console.log(this.authState)
				if (this.authState == 0) {
					uni.redirectTo({
						url: "./real-name"
					})
				} else {
					uni.navigateTo({
						url: './examine?authState=' + this.authState
					})
				}


			},
			jumpToMyBill() {
				uni.navigateTo({
					url: "./my-bill"
				})
			}
		}
	}
</script>

<style scoped>
	.font22 {
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
