<template>
	<view class="content">
		<view class="bgbox">
		</view>
		<view class="recommend-product">
			<view class="hot" :style="{background:showLevelBgc(level)}">
				V{{level}}
			</view>
			<view class="title">
				{{name}}
			</view>
			<view>
				<text class="percent">{{ $base1._toFixed(ratio*30*100,2) }}%</text><text class="font-gray">月利率</text>
			</view>
			<view class="profit">
				周期10天
			</view>
		</view>
		<view class="bgbox">
		</view>
		<view class="padding border-bottom">
			<view class="font-middle rule">
				交易规则
			</view>
			<view class="rule flex-between">
				<text class="width100">报单</text>
				<text class="ruled-detail">本日18:00之前 花费等额EVC激活广告包</text>
				<text class="width100 font-blue text-right">每天18:00</text>
			</view>
			<view class="rule flex-between">
				<text class="width100">产生收益</text>
				<text class="ruled-detail">报单成功后开始锁仓 并按T+1产生收益</text>
				<text class="font-blue width100 text-right">次日</text>
			</view>
			<view class="rule flex-between">
				<text class="width100">收益发放</text>
				<text class="ruled-detail">收益在锁仓时间(10天)到期后 返还本金和保证金</text>
				<text class="font-blue width100 text-right">10天后</text>
			</view>
		</view>
		<view class="padding book">
			<view class="flex-between margin-top">
				<text class="font-middle ">预约</text> <text class="font-red">请仔细阅读交易规则！</text>
			</view>
			<view class="">
				<view class="">
					1、用户可以在指定时间段（卯定每天10:00-17:00），申请预约时，需交纳10USDT的保证金（冻结）。
				</view>
				<view class="">
					2、若该用户存在预约或者报单的订单，则无法再次预约。
				</view>
				<view class="">
					3、若当日预约金额（当日预约订单面值总和）已达后台设置的上限，则无法进行预约。
				</view>
				<view class="">
					4、预约后不可撤销。
				</view>
			</view>
		</view>
		<view class="padding book">
			<view class="flex-between margin-top">
				<text class="font-middle ">放行</text>
			</view>
			<view class="">
				<view class="">
					1、系统根据预约时间放行，先预约的先放。
				</view>
				<view class="">
					2、若当日已放行的订单面值总和与最早一条未放行订单的面值总和小于后台设置的每日放行金 额，则自动放行。
				</view>
				<view class="">
					3、后台可手动放行。
				</view>
				<view class="">
					4、放行后，修改状态，并视为预约成功。
				</view>
			</view>
		</view>
		<view class="padding book">
			<view class="flex-between margin-top">
				<text class="font-middle ">报单</text>
			</view>
			<view class="">
				<view class="">
					1、请在预约成功当日18:00之前花费等额EVC激活广告包，成功激活广告包即视为成功报单。
				</view>
				<view class="">
					2、如预约成功后，未在当日18:00之前购买并激活广告包，系统将对此账号进行禁封；禁封后此账号所有收益停止，并清空收益账户，如需解封须支付50USDT的解封费用，解封后收益正常产生，且保证金不退。
				</view>
				<view class="">
					3、账号封禁导致收益停止的，后面不补。
				</view>
				<view class="">
					4、报单时需支付与订单面值等额的EVC，支付数量根据EVC的行情实时计算。
				</view>
				<view class="">
					5、报单时累计上级业绩。
				</view>
			</view>
		</view>
		<view class="bgbox">
		</view>
		<view class="padding font-middle flex-between rule problem" @tap="jumptoproblem">
			<text>常见问题</text> <text class="iconfont">&#xea25;</text>
		</view>
		<view class="bgbox">
		</view>
		<view class="">
			<button class="blue font-bold oreder-btn" @tap="order">立即预约</button>
		</view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				id: 0,
				level: '',
				name: '',
				ratio: ''
			};
		},

		onLoad(options) {
			this.id = options.id
			this.init()
		},
		methods: {
			init() {
				//产品详情
				uni.request({
					url: this.baseUrl + "/product-detail",
					data: {
						Id: this.id
					},
					header: {
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						if(this.$base1._indexOf(res.data.status)){
							this.$base1._isLogin()
						}else if (res.data.status == 1) {
							this.level = res.data.data.NeedLevel
							this.name = res.data.data.Name
							this.ratio = res.data.data.Ratio

						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
					}
				})
			},
			//立即预约
			order(){
				//跳转到购买页面
				uni.navigateTo({
					url:"./buy?id="+this.id
				})
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
			jumptoproblem(){
				uni.navigateTo({
					url:"../personal/problem"
				})
			}
		}
	}
</script>

<style  lang="scss">
	page {
		background-color: #fff;
	}

	.content {
		font-size: 24rpx;
		color: #333;
		height: 100%;
		.recommend-product {
			position: relative;
			margin: 20rpx 0;
			height: 262rpx;
			width: 100%;
			text-align: center;
			line-height: 60rpx;

			.percent {
				margin-top: 20rpx;
				font-size: 58rpx;
				color: #FF3400;
				font-weight: bold;
			}

			.title {
				padding-top: 30rpx;
				font-weight: bold;
				font-size: 30rpx;
			}

			.profit {
				font-size: 24rpx;
			}

			.hot {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
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



		.rule {

			height: 100rpx;
			line-height: 100rpx;

			.ruled-detail {
				display: inline-block;
				word-wrap: break-word;
				width: 280rpx;
				height: 100rpx;
				line-height: 40rpx;
				text-align: center;
			}

			.width100 {
				width: 150rpx;
			}
		}

		.book {
			line-height: 60rpx;
		}
		.oreder-btn{
			width: 100%;
		}
		
		/*弹窗样式*/
		.prompt-box {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 11;
			background: rgba(0, 0, 0, 0.3);
		}
		
		.prompt-content {
			position: absolute;
			left: 50%;
			top: 40%;
			z-index: 20;
			width: 80%;
			height: 380upx;
			max-width: 600upx;
			border: 2upx solid #ccc;
			border-radius: 8rpx;
			box-sizing: bordre-box;
			transform: translate(-50%, -50%);
			overflow: hidden;
			background: #fff;
			text-align: center;
			padding: 34rpx 50rpx 56rpx;
		
			.icon {
				position: absolute;
				right: 52rpx;
				top: 36rpx;
			}
		
		}
		
		.prompt-input {
			margin-top: 40rpx;
			width: 100%;
			height: 88rpx;
			background-color: #F5F5F5;
			border-radius: 8rpx;
			font-size: 24rpx;
			text-align: left;
			padding-left: 26rpx;
		}
		.forget-password {
			font-size: 24rpx;
			color: #007AFF;
			display: flex;
			flex-direction: row-reverse;
			margin-top: 32rpx;
		}
	}
	
</style>
