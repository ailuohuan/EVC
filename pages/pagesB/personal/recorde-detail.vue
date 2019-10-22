<template>
	<view class="content">
		<view class="bgbox">
		</view>
		<view class="middle">
			<view class="all">
				<view class="name margin-top">
					btc
				</view>
			</view>
			<view class="transfer-accounts">
				购买算力
			</view>
			<view class="all-num">
				33333BTC
			</view>
		</view>
		<view class="bgbox">
		</view>
		<view class="list">
			<view class="list-item padding" v-for="item in nameList">

				<text>{{item.leftText}}</text><text>{{item.rightText}}</text>

			</view>
		</view>
	</view>
</template>

<script>
	export default {

		onLoad() {
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base1._isLogin()
			}
		},
		data() {
			return {
				nameList: [{
						leftText: '时间戳:',
						rightText: '2019-09-19 14:58:03'
					},
					{
						leftText: '区块高度:',
						rightText: '6984112（43282块确认'
					},
					{
						leftText: '发起地址：',
						rightText: 'udwgufewfjiebufbwfbwjegbwv'
					},
					{
						leftText: '当前状态：',
						rightText: '区块确认到账'
					},
					{
						leftText: '哈希值：',
						rightText: 'liodoiuendjfhwofnkovidoshwq90375kdmc...'
					},

				],
				headerTitle: '资金记录详情'
			};
		},
		onLoad(options) {
			this.nameList[0].rightText = options.time
			this.nameList[1].rightText = options.height
			this.nameList[2].rightText = options.addr
			this.nameList[3].rightText = options.status
			this.nameList[4].rightText = options.hash

		}
	}
</script>

<style lang="scss">
	.content {

		box-sizing: border-box;
		font-size: 30rpx;
		background-color: #fff;
		height: 1334rpx;

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
			height: 300rpx;
			padding-top: 20rpx;
			color: #333;
			text-align: center;

			.currency-img {
				width: 80rpx;
				height: 80rpx;
			}

			.name {
				font-size: 28rpx;
				font-weight: bold;
			}

			.transfer-accounts {
				font-size: 22rpx;
				color: #999;
			}

			.all-num {
				font-size: 60rpx;
				margin-top: 36rpx;
				color: #007AFF;
				font-weight: bold;
			}

			.all-num-equal {
				font-size: 30rpx;
				color: #999;
				margin-top: 34rpx;
			}
		}

		.list-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 26rpx;
			line-height: 90rpx;
		}
	}
</style>
