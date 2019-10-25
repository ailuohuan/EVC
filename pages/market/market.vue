<template>
	<!-- 行情页面 -->
	<view class="content">
		<view class="flex-between">
			<view class="nav-text" v-for="(value,index) in list" :key="index" :class="currentNumber == index ? 'active' : ''"
			 @tap="currentInfo(index)">
				{{index}}
			</view>
		</view>
		<view class="flex-between choice padding">
			<view class="choice-item">
				<text>交易对</text>
			</view>
			<view class="choice-item flex-between">
				<view class="">
					<text>价格</text>
				</view>
				<view class="">
					<text>涨跌幅</text>
					<text class="iconfont icon">&#xe60c;</text>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="list-item flex-between" v-for="item in Coinlist" :key="item.id">
				<view class="list-item-left">
					<view class="name-en">
					<text class="font26">{{item.Coin}}</text>	 <text class="font-gray font20">{{item.PriceCoin}}</text>
					</view>
				</view>
				<view class="list-item-right flex-between">
					<view class="">
						<view class="font26">
							{{$base1._toFixed(item.Price,4) }}
						</view>
						<view class="font-gray font20">
							￥{{$base1._toFixed( item.Price*item.PriceCny,4)}}
						</view>
					</view>
					<view class="">
						<button :style="{background:showBackColor(item.Kline)}" class="show-btn font26">{{ $base1._toFixed(item.Kline,4) }}%</button>
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
				Coinlist:[],
				list: []
			};
		},
		onLoad(options) {
			this.getCoreDetail()
		},
		onPullDownRefresh() {
			this.getCoreDetail()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
			this.currentNumber = newArray[0];
			
		},
		methods: {
			currentInfo(index) {
				this.Coinlist = this.list[index];
				this.currentNumber = index;
				console.log(this.currentNumber)
			},
			//币种行情
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/coin-kline",
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						 if (res.data.status == 1) {
							this.list = res.data.data
							var newArray = Object.keys(this.list);
							this.Coinlist = res.data.data[newArray[0]];
							this.currentNumber = newArray[0];
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			showBackColor(value){
				if(value<=0){
					return '#EB4545'
				}else if(value>0){
					return '#38C262'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.font26 {
		font-size: 26rpx;
	}
	.font20 {
		font-size: 20rpx;
	}
	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		background-color: #fff;
		height: 1334rpx;
		width: 750rpx;

			.nav-text {
				height: 88rpx;
				line-height: 88rpx;
				width: 150rpx;
				background-color: #fff;
				text-align: center;
			}
		
		
		.list {
			margin-top: 20rpx;
			.list-item {
				height: 140rpx;
				width: 100%;
				line-height: 50rpx;
				background-color: #fff;
				padding: 0 26rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F1F1F1;
				.list-item-left {
					width: 50%;
				}
				.list-item-right {
					width: 50%;
				}
			}
		}
		.choice{
			height: 60rpx;
			font-size: 22rpx;
			color: #999999;
			background-color: #F8F8F8;
			.choice-item{
				width: 50%;
				.icon{
					font-size: 22rpx;
				}
			}
		}
	}
	.active {
		color: #007AFF;
		border-bottom: 2rpx solid #007AFF;
	}
	.show-btn{
		background-color: #17A52F;
		width: 118rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		padding: 0;
	}
	
</style>
