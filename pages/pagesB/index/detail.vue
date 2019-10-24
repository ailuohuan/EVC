<template>
	<view class="content">
		<view class="padding top">
			<view class="product-list-item">
				<view class="title flex-between">
					<view class="font-bold font-middle">
						{{name}}
					</view>
					<view class="desc">
						{{showStatus(state) }}
					</view>
				</view>
				<view class="flex-between margin-top15">
					<view class="">
						<text class="percent percent-small">{{$base1._toFixed(ratio*30*100,2) }}%</text> <text class="font-gray font-small">月利率</text>
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
					{{$base1._toFixed(number,4) }} USDT
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
					{{$base1._toFixed(numEVC,4)}} EVC
				</view>
			</view>
		</view>
		
		<view class="" v-show="state==3">
			<button class="blue margin-top" @tap="declarationForm">立即报单</button>
		</view>
		<!-- 输入支付密码的弹窗 -->
		<view class="prompt-box" v-show="showPinMask" @tap="closePinMask"></view>
		<view class="prompt-content" v-show="showPinMask">
			<view class="">请输入资金密码 <text class="iconfont icon" @tap="closePinMask">&#xe723;</text></view>
			<input class="prompt-input" type="text" password v-model="password" placeholder="请输入资金密码" />
			<view class="font-blue text-right margin-top" @tap="jumpToForgetPassword">
				忘记密码？
			</view>
			<view class="margin-top">
				<button class="blue" @tap="confirm">提交密码</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPinMask: false,
				password:'',
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
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if(res.data.status==1){
						this.name = res.data.data.Name
						this.ratio = res.data.data.Ratio
						this.state = res.data.data.State
						this.number = res.data.data.Number
						this.addtime= this.$base1._formatDate(res.data.data.AddTime) 
						this.passtime=this.$base1._formatDate(res.data.data.PassTime)  
						this.paytime= this.$base1._formatDate(res.data.data.PayTime)
						if(this.state==0){
							this.paytime=''
							this.passtime=''
						}
						if(this.state==3||this.state==4){
							this.paytime=''
						}
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
			closePinMask(){
				this.showPinMask = false
			},
			declarationForm(){
				//报单
				this.showPinMask = true
				
				
			},
			jumpToForgetPassword(){
				uni.navigateTo({
					url:"../personal/forget-pay-password"
				})
			},
			showStatus(status){
				if(status==0){
					return '未报单'
				}else if(status==1){
					return '已报单'
				}else if(status==2){
					return '已出局'
				}else if(status==3){
					return '已放行'
				}else if(status==4){
					return '违约'
				}
			},
			confirm(){
				//我的广告包
				uni.request({
					url: this.baseUrl + "/pay-product",
					data: {
						PayPassword: this.password
					},
					method:"POST",
					header:{
						Authorization:uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						 if(res.data.status==1){
							 this.showPinMask = false
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
							
						}else{
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
						
					}
				})
			}

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
	
	/*弹窗样式*/
	.prompt-box {
		position: absolute;
		left: 0;
		top: 0;
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
		margin-top: 80rpx;
		width: 100%;
		height: 88rpx;
		background-color: #F5F5F5;
		border-radius: 8rpx;
		font-size: 24rpx;
		text-align: left;
		padding-left: 26rpx;
	}
</style>
