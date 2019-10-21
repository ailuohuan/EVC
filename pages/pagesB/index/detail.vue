<template>
	<view class="content">
		<view class="padding top">
			<view class="product-list-item">
				<view class="title flex-between">
					<view class="font-bold font-middle">
						{{name}}
					</view>
					<view class="desc">
						{{state}}
					</view>
				</view>
				<view class="flex-between margin-top15">
					<view class="">
						<text class="percent percent-small">{{ratio}}%</text> <text class="font-gray font-small">年利率</text>
					</view>
					<view class="">
						周期10天
					</view>
				</view>
			</view>
		</view>
		<view class="bgbox">
		</view>
		<view class="list-item font26">
			<view class="rule padding flex-between">
				<view class="font-gray">
					投资时间
				</view>
				<view class="">
					{{addtime}}
				</view>
			</view>
			<view class="rule padding flex-between">
				<view class="font-gray">
					投资金额
				</view>
				<view class="">
					{{number}} USDT
				</view>
			</view>
			<view class="rule padding flex-between">
				<view class="font-gray">
					放行时间
				</view>
				<view class="">
					{{passtime}}
				</view>
			</view>
			<view class="rule padding flex-between">
				<view class="font-gray">
					报单时间
				</view>
				<view class="">
					{{paytime}}
				</view>
			</view>
			<view class="rule padding flex-between">
				<view class="font-gray">
					锁仓数量
				</view>
				<view class="">
					{{numEVC}} USDT
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPinMask: true,
				
				id:'',
				name:'',
				state:'',
				ratio:'',
				addtime:'',
				passtime:'',
				paytime:'',
				numEVC:'',
				number:''
			};
		},

		onLoad(options) {
			this.id = options.id
			//产品详情
			uni.request({
				url: this.baseUrl + "/my-detail",
				data: {
					Id:this.id
				},
				header:{
					Authorization:uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base._indexOf(res.data.status)) {
						this.$base._isLogin()
					} else if(res.data.status==1){
						this.name = res.data.data.Name
						this.ratio = res.data.data.Ratio
						this.state = res.data.data.State
						this.number = res.data.data.Number
						this.addtime= this.$base._formatDate(res.data.data.AddTime) 
						this.passtime=this.$base._formatDate(res.data.data.PassTime)  
						this.paytime= this.$base._formatDate(res.data.data.PayTime)
						this.numEVC= res.data.data.NumberEVC
					}else{
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
					
				}
			})
		},
		onPullDownRefresh() {
			
		},
		methods: {


		}
	}
</script>

<style scoped lang="scss">
	.bgbox {
		background-color: #F8F8F8;
		height: 20rpx;
	}

	.content {
		background-color: #fff;
		font-size: 24rpx;
		color: #333;
		height: 1334rpx;

		.top {
			font-size: 30rpx;
			margin-top: 20rpx;
			padding: 20rpx 20rpx;
			box-sizing: border-box;
		}

		.list-item {
			line-height: 50rpx;
		}
		.font26{
			font-size: 26rpx;
		}

		.product-list-item {
			height: 120rpx;
			width: 100%;

			.title {
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

		.percent {
			margin-top: 20rpx;
			font-size: 36rpx;
			color: #FF3400;
			font-weight: bold;
		}
		.rule {
			height: 100rpx;
		}
		.margin-top15{
			margin-top: 15rpx;
		}

	}
</style>
