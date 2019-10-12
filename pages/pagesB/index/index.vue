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
		<view class="notice" @tap="jumpToManageMoney(0)">
			<text class="iconfont icon1">&#xe63f;</text>
			sdfsdfsdsdfsdfsdfsddffsdfds哩哩啦啦即将上线！
		</view>
		<view class="recommend">
			热门产品
		</view>
		<view class="recommend-product" v-for="(item,index) in activity" :key="item.id">
			<view class="hot">
				V1
			</view>
			<view class="title">
				{{item.Title}}
			</view>
			<view>
				<text class="percent">{{item.MaxRate}}%</text><text class="font-gray">月利率</text>
			</view>
			<view class="profit">
				投入金额：1111USTD
			</view>
		</view>
		<view class="choice-type">
			<view class="choice-type1">我的广告包</view>
			<view>
				<text>查看全部</text><text class="iconfont icon">&#xea25;</text>
			</view>
		</view>
		<view class="product-list">
			<view class="product-list-item" v-for="(item,index) in productList" :key="item.id">
				<view class="title">
					<view class="font-bold font-middle">
						{{item.IsDay}}
					</view>
					<view class="desc">
						{{item.NodeDay}}
					</view>
				</view>
				<view class="">
					<text class="percent percent-small">{{item.PenalSumRatio}}%</text> <text class="font-gray">年利率</text>
				</view>
				<view class="title">
					<text class="font-gray">投入金额:{{item.Yield}}</text>
					<button class="blue detail-btn" hover-class="none">详情</button>
				</view>
				<view class="font-gray">
					周期:{{item.dayText}}
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
				hoverColor: '#4C70FF',
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
				current: 0,
				swiperCurrent: 0,
				activity: [{
						Title: '1',
						MaxDay: '',
						Remark: '2',
						MaxRate: '3'
					},
					{
						Title: '1',
						MaxDay: '',
						Remark: '2',
						MaxRate: '3'
					},
					{
						Title: '1',
						MaxDay: '',
						Remark: '2',
						MaxRate: '3'
					},
					{
						Title: '1',
						MaxDay: '',
						Remark: '2',
						MaxRate: '3'
					},
					{
						Title: '1',
						MaxDay: '',
						Remark: '2',
						MaxRate: '3'
					}
				],
				activityId: '',
				productList: [{
						dayText: '产品一号',
						Yield: '2',
						IsDay: '产品一号',
						NodeDay: '放行',
						PenalSumRatio: '5'
					},
					{
						dayText: '1',
						Yield: '2',
						IsDay: '3',
						NodeDay: '4',
						PenalSumRatio: '5'
					},
					{
						dayText: '1',
						Yield: '2',
						IsDay: '3',
						NodeDay: '4',
						PenalSumRatio: '5'
					}
				]
			};
		},
		onLoad() {

		},
		onNavigationBarButtonTap() {
			console.log("22222")
		},
		onPullDownRefresh() {

		},
		methods: {

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
		.percent-small{
			font-size: 36rpx;
		}
		.detail-btn{
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
			width: 332rpx;
			box-shadow: 0 0 12rpx rgba(37, 144, 254, 0.1);
			text-align: center;
			line-height: 60rpx;

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
			.title{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				line-height: 60rpx;
			}
			.desc{
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
