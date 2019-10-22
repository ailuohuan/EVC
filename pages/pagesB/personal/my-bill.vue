<template>
	<!-- 我的账单 -->
	<view class="content">
		<view class="nav">
			<view class="nav-text" v-for="(item,index) in list" :key="item.id" :class="currentNumber == index ? 'active' : ''"
			 @tap="currentInfo(index)">
				{{item.title}}
			</view>
		</view>
		<view class="bgbox">
		
		</view>
		<view class="list">
			<view class="list-item" v-for="(item,index) in nameList" :key="index" @tap="jumpToRecorde(index)">
				<view class="">
					<view class="name-en">
						{{item.MoldTitle}}
					</view>
					<view class="name-ch">
						{{$base1._formatDate(item.AddTime)}}
					</view>
				</view>
				<view class="list-item-right">
					<view class="">
						<view class="name-en">
							{{item.Money}} USDT
						</view>
					</view>
					<view class="iconfont icon">
						&#xea25;
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
				currentNumber: 0, // 用来判断active样式类是否显示
				statusChange: '',
				curPage: 1,
				status: 0,
				nameList: [],
				id: '',
				acid:'',
				list: [{
						title: "全部"
					},
					{
						title: "充值"
					},
					{
						title: "提现"
					}
				]
			};
		},
		onLoad(options) {
			if(!uni.getStorageSync("token")&&!uni.getStorageSync("SecretKey")){
				this.$base1._isLogin()
			}
			this.getCoreDetail()
		},
		onPullDownRefresh() {
			this.getCoreDetail()
			  setTimeout(function () {
				  uni.stopPullDownRefresh();
			  }, 1000);
		  },
		methods: {
			currentInfo(index) {
				this.currentNumber = index;
				
				this.status = this.currentNumber
				console.log(this.status)
				//我的理财列表动态 显示
				uni.request({
					url: this.baseUrl + "/finace-list",
					data:{
						Type:this.status,
						page:1,
						count:10000
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						 if (res.data.status == 1) {
							this.nameList = res.data.data.list
							
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			//资金变动列表 显示全部
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/finace-list",
					data:{
						Type:0,
						page:1,
						count:10000
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else  if (res.data.status == 1) {
							this.nameList = res.data.data.list
							
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			showState(state){
				if(state==1){
					return  "待理财";
				}else if(state==2){
					return "理财中"
				}else if(state==3){
					return "已撤资"
				}else if(state==4){
					return "已完结"
				}
			},
			jumpToRecorde(index) {
				uni.navigateTo({
					url: "./recorder-detail?id="+this.nameList[index].Id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.active {
		color: #0099FF;
		border-bottom: 2rpx solid #007AFF;
	}

	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		
		.nav {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.nav-text {
				height: 88rpx;
				line-height: 88rpx;
				width: 150rpx;
				background-color: #fff;
				text-align: center;
			}
		}

		.list {
			margin-top: 20rpx;

			.list-item {
				height: 160rpx;
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				line-height: 50rpx;
				background-color: #fff;
				padding: 0 26rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F1F1F1;

				.list-item-right {
					display: flex;
					flex-direction: row;
					align-items: center;

					.icon {
						font-size: 26rpx;
						margin-left: 28rpx;
						color: #BBB;
					}
				}

				.name-en {
					font-size: 30rpx;
					color: #333;
					font-weight: bold;
				}

				.name-ch {
					font-size: 24rpx;
					color: #999;
					display: flex;
					flex-direction: row-reverse;

				}

				.desc {
					color: #17A52F;
				}
			}
		}
	}
</style>
