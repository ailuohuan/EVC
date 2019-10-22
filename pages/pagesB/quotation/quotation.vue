<template>
	<view class="content">
		
		<view class="nav">
			<view class="nav-text" v-for="(item,index) in list" :key="item.id" :class="currentNumber == index ? 'active' : ''"
			 @tap="currentInfo(index)">
				{{item.title}}
			</view>
		</view>
		<view class="flex-around choice">
			<view class="">
				<text>交易对</text>
			</view>
			<view class="">
				<text>价格</text>
				<text>涨跌幅</text>
				<text class="iconfont">&#xe64d;</text>
				<text class="icontont">&#xe64c;</text>
			</view>
		</view>
		<view class="list">
			<view class="list-item" >
				<view class="">
					<view class="name-en">
						BTC/USTD
					</view>
				</view>
				<view class="list-item-right">
					<view class="">
						<view class="">
							0.004423
						</view>
						<view class="">
							￥5.68
						</view>
					</view>
					<view class="">
						<button class="show-btn">+4.56%</button>
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
				headerTitle: '我的理财',
				statusChange: '',
				curPage: 1,
				status: 0,
				nameList: [],
				id: '',
				acid:'',
				list: [{
						title: "USDT"
					},
					{
						title: "HUSD"
					},
					{
						title: "BTC"
					},
					{
						title: "ETH"
					},
					{
						title: "HT"
					},
					{
						title: "ALTS"
					}
				]
			};
		},
		onLoad(options) {
			if(!uni.getStorageSync("token")&&!uni.getStorageSync("SecretKey")){
				this.$base1._isLogin()
			}
			this.activityId = options.activityId
			console.log(this.activityId)
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
				console.log(this.currentNumber)
				this.status = this.currentNumber
				//我的理财列表动态 显示
				uni.request({
					url: this.baseUrl + "/investment-list?status=" + this.status,
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token'),
						SecretKey: uni.getStorageSync('SecretKey')
					},
					success: (res) => {
						console.log(res)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							this.nameList = res.data.data.data
							console.log(this.nameList)
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			//我的理财列表 显示全部
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/investment-list?status=" + this.status,
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token'),
						SecretKey: uni.getStorageSync('SecretKey')
					},
					success: (res) => {
						
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							this.nameList = res.data.data.data
							
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
			jumpToManage(index) {
				this.id = this.nameList[index].Id
				this.acid = this.nameList[index].ActivityId
				console.log(this.id)//我的理财id
				console.log(this.acid)//理财活动id
				uni.navigateTo({
					url: "./manage-in?id=" + this.id +"&acid="+this.acid//需要传一个investmentId过去,还需传一个acid过去获取天数
				})
			}
		}
	}
</script>

<style lang="scss">
	.active {
		color: #007AFF;
	}
	.show-btn{
		background-color: #17A52F;
		width: 118rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		padding: 0;
	}
	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		background-color: #fff;
		height: 1334rpx;
		width: 750rpx;

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
					
				}

				.name-ch {
					font-size: 22rpx;
					color: #999;
					

				}

				.desc {
					color: #00D8A0;
				}
			}
		}
		.choice{
			height: 60rpx;
			font-size: 22rpx;
			color: #999999;
			background-color: #F8F8F8;
		}
	}
</style>
