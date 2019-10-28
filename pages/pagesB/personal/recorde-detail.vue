<template>
	<view class="content">
		<view class="bgbox">
		</view>
		<view class="middle">
			<view class="all">
				<view class="name margin-top">
					{{name}}
				</view>
			</view>
			<view class="transfer-accounts">
				{{type}}
			</view>
			<view class="all-num">
				{{money}}{{name}}
			</view>
		</view>
		<view class="bgbox">
		</view>
		<view class="list">
			<view class="list-item padding" v-for="item in nameList" :key="item.id">

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
						leftText: '时间:',
						rightText: ''
					},
					
					{
						leftText: '金额：',
						rightText: ''
					},
					

				],
				name:'',
				time:'',
				money:'',
				type:''
			};
		},
		onLoad(options) {
			this.nameList[0].rightText = options.time
			this.nameList[1].rightText = options.money
			
			this.id = options.id
			//接收名称金额时间
			this.name = options.name
			this.time = options.time
			this.money = options.money
			this.type = options.type
		},
		methods:{
			
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
