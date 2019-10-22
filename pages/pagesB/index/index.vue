<template>
	<view class="content">
		<view class="">
			<!-- 轮播 -->
			<swiper class="swiper" :autoplay="true" :interval="3000" :duration="1000" :current="swiperCurrent" @change="changeSwiper">
				<swiper-item v-for="item in swiperImg" :key="item.id">
					<image class="swiper-item" :src="item.Img" mode="widthFix"></image>
				</swiper-item>
			</swiper>
			<!-- 轮播指示点样式修改 -->
			<view class="dots">
				<block v-for="(item,index) in swiperImg.length" :key="item">
					<view class="dot" :class="index==swiperCurrent ? ' active' : ''"></view>
				</block>
			</view>
		</view>
		<view class="notice">
			<text class="iconfont icon1">&#xe63f;</text>
			Aggregate ecology 1.0即将上线！
		</view>
		<view class="recommend">
			热门产品
		</view>
		<view class="recommend-product" v-for="(item,index) in productList" :key="item.id" @tap="jumpToProductDetail(index)">
			<view class="hot" :style="{background:showLevelBgc(item.NeedLevel)}">
				V{{item.NeedLevel}}
			</view>
			<view class="title">
				{{item.Name}}
			</view>
			<view>
				<text class="percent">{{ $base1._toFixed(item.Ratio*30*100,2) }}%</text><text class="font-gray">月利率</text>
			</view>
			<view class="profit">
				投入金额：{{ $base1._toFixed(item.Number,4) }}USTD
			</view>
		</view>
		<view class="choice-type" @tap="seeAll">
			<view class="choice-type1">我的广告包</view>
			<view>
				<text>查看全部</text><text class="iconfont icon">&#xea25;</text>
			</view>
		</view>
		<view class="product-list">
			<view class="product-list-item" v-for="(item,index) in productList2" :key="item.id" @tap="myAdDetail(index)">
				<view class="title">
					<view class="font-bold font-middle">
						{{item.Name}}
					</view>
					<view class="desc">
						{{item.State}}
					</view>
				</view>
				<view class="">
					<text class="percent percent-small">{{$base1._toFixed(item.Ratio*30*100,2) }}%</text> <text class="font-gray">月利率</text>
				</view>
				<view class="title">
					<text class="font-gray">投入金额:{{item.Number}}</text>
					<button class="blue detail-btn" hover-class="none" >详情</button>
				</view>
				<view class="font-gray">
					周期:10天
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<evc-tabbar :fontColor1="fontColor1" :indexImg="indexImgSelect"></evc-tabbar>
	</view>
</template>

<script>
	import evcTabbar from '@/components/evcTabbar.vue'
	import UniLoadMore from '@/components/uni-load-more.vue'
	export default {
		components: {
					UniLoadMore,
					evcTabbar	
				},
		data() {
			return {
				swiperImg: [{
						Img: "../../../static/images/pagesA/login/banner.png"
					},
					{
						Img: "../../../static/images/pagesA/login/banner.png"
					},
					{
						Img: "../../../static/images/pagesA/login/banner.png"
					}
				],
				fontColor1:'#0099FF',
				indexImgSelect:'../../../static/images/evctabbar/indexselect.png',
				current: 0,
				swiperCurrent: 0,
				productList: [],
				activityId: '',
				productList2: [],
				curPage: 1,
				loadingType: 'more',
				total1:0,
				total2:0,
				levelBgc:''
			};
		},
		onLoad() {
			//此页做下拉刷新跟上拉加载
			var _self = this
			if(!uni.getStorageSync("token")){
				this.$base1._isLogin()
			}
			_self.getProduct()
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			// console.log(e.scrollTop)
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.curPage = 1;
			this.getProduct('refresh')
			
		},
		//上拉加载更多
		onReachBottom() {
			this.curPage++;
			this.getProduct('add');
		},

		onNavigationBarButtonTap() {
			console.log("22222")
		},

		methods: {
			//加载奖品列表 ，带下拉刷新和上滑加载
			getProduct(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
					
				} else {
					this.loadingType = 'more'
				}
				if (type === 'refresh') {
					
					this.productList2 = [];
				}
				//产品列表
				uni.request({
					url: this.baseUrl + "/product-list",
					data: {
						page: 1,
						count: 100000
					},
					header:{
						Authorization:uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if(res.data.status==1){
							this.productList = res.data.data.List
							
						}else{
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
						
					}
				})
				//我的广告包
				uni.request({
					url: this.baseUrl + "/my-product",
					data: {
						page: this.curPage,
						count: 1
					},
					header:{
						Authorization:uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						if (res.data.status == 1) {
							this.productList2 = this.productList2.concat(res.data.data.List)
							this.total2 = res.data.data.Total
							if (this.productList2.length == 0) {
								this.loadingType = '';
							} else if (this.productList2.length >=this.total2 ) {
								this.loadingType = 'nomore';
							} else {
								this.loadingType = 'more';
							}
							if (type === 'refresh') {
								if (loading == 1) {
									uni.hideLoading()
								} else {
									uni.stopPullDownRefresh();
								}
							}
						} else {
							uni.stopPullDownRefresh();
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
					}
				})
				
			},
			changeSwiper(e) {
				this.swiperCurrent = e.detail.current;
			},
			change() {
				if (this.active < this.list1.length - 1) {
					this.active += 1
				} else {
					this.active = 0
				}
			},
			showLevelBgc(level){
				if(level==1){
					return  'linear-gradient(#FF727C, #FFA8AE)'
				}else if(level==2){
					return  'linear-gradient(#7FCCFF, #0099FF)'
				}else if(level==3){
					return  'linear-gradient(#FFC744, #FF9100)'
				}
			},
			jumpToProductDetail(index){
				console.log(this.productList[index].Id)
				//携带参数跳转到产品详情页
				uni.navigateTo({
					url:"./product-detail?id="+this.productList[index].Id
				})
			},
			seeAll(){
				uni.navigateTo({
					url:"./profit"
				})
			},
			myAdDetail(index){
				uni.navigateTo({
					//携带参数跳转到详情页
					url:"./detail?id="+this.productList2[index].Id
				})
			}

		}

	}
</script>

<style lang="scss">
	.content {
		background-color: #fff;
		padding: 0 32rpx;
		font-size: 24rpx;
		color: #333;
		height: 100%;

		.percent {
			margin-top: 20rpx;
			font-size: 58rpx;
			color: #FF3400;
			font-weight: bold;
		}

		.percent-small {
			font-size: 36rpx;
		}

		.detail-btn {
			width: 140rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
			font-size: 26rpx;
			margin: 0;
		}

		.swiper {
			width: 700rpx;
			height: 300rpx;
			border-radius: 16rpx;
			overflow: hidden;
			margin-top: 16rpx;
			position: relative;

			.swiper-item {
				width: 700rpx;
				height: 240rpx;
				border-radius: 16rpx;
			}

		}

		.dots {
			position: absolute;
			top: 290rpx;
			left: 50%;
			transform: translate(-50% 0);
			-webkit-transform: translate(-50%, 0);
			z-index: 4;
			display: flex;
			justify-content: center;

			.dot {
				width: 24rpx;
				height: 6rpx;
				transition: all .6s;
				background: rgba(0, 0, 0, .3);
				margin-right: 10rpx;
			}

			.active {
				width: 24rpx;
				height: 6rpx;
				background: rgba(255, 255, 255, .8);
			}
		}

		.choice-type {
			height: 100rpx;
			line-height: 100rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-weight: bold;

			.choice-type1 {
				font-size: 32rpx;
				font-weight: bold;
			}

			.icon {
				font-size: 24rpx;
				margin-left: 20rpx;
				font-weight: 400;
			}
		}

		.notice {
			font-size: 26rpx;
			margin-top: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;

			.icon2 {
				font-size: 24rpx;
			}
		}

		.recommend {
			font-size: 32rpx;
			font-weight: bold;
			margin-top: 62rpx;
			margin-bottom: 30rpx;
		}

		.recommend-product {
			position: relative;
			display: inline-block;
			margin-top: 30rpx;
			height: 262rpx;
			width: 334rpx;
			box-shadow: 0 0 12rpx rgba(37, 144, 254, 0.1);
			text-align: left;
			line-height: 60rpx;
			box-sizing: border-box;
			padding: 5rpx;
			
			.title {
				padding-top: 30rpx;
				font-weight: bold;
				font-size: 30rpx;
			}

			.desc {
				font-size: 24rpx;
				color: #999;
			}



			.profit {
				font-size: 24rpx;
				color: #999;
			}

			.hot {
				position: absolute;
				top: 0;
				right: 0;
				width: 84rpx;
				height: 34rpx;
				background: linear-gradient(#FF727C, #FFA8AE);
				border-bottom-right-radius: 10rpx;
				border-top-left-radius: 10rpx;
				font-size: 20rpx;
				color: #fff;
				text-align: center;
				line-height: 34rpx;
			}
		}

		.product-list-item {
			height: 256rpx;
			width: 100%;
			padding: 30rpx 0;
			box-sizing: border-box;
			border-top: 2rpx solid #E6E6E6;

			.title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				line-height: 60rpx;
			}

			.desc {
				display: inline-block;
				text-align: center;
				line-height: 36rpx;
				font-size: 22rpx;
				width: 88rpx;
				height: 36rpx;
				border-radius: 18rpx;
				color: #38C262;
				background-color: rgba(56, 194, 98, 0.1);
				border: 2rpx solid #38C262;
			}
		}
	}
</style>
