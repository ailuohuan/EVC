<template>
	<view class="content">
		<view class="flex-between top">
			<view class="">
				<view class="">
					可用余额(USDT)
				</view>
				<view class="font-big font-bold">
					{{balance}}
				</view>
			</view>
			<view class="" @tap="balanceWithdraw">
				<view class="iconfont font-big font-bold">
					&#xe7e5;
				</view>
				<view class="" >
					提现
				</view>
			</view>
		</view>

		<view class="bgbox">

		</view>
		<view class="font-bold flex title padding font-middle border-bottom">
			我的资产
		</view>
		<view class="list-item font-middle" v-for="item in profitList" :key="item.id">
			<view class="rule padding flex-between border-bottom">
				<view class="">
					<view class="">
						{{ showType(item.Type)}}
					</view>
					<view class="font-gray font-small">
						{{$base1._formatDate(item.AddTime)}}
					</view>
				</view>
				<view class="">
					{{item.Number}} USDT
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<!-- 点击提现的弹窗		 -->
		<view class="prompt-box" v-show="showPinMask" @tap="closePinMask"></view>
		<view class="prompt-content" v-show="showPinMask">
			<view class="font36 font-bold text-left">
				提现
			</view>
			<view class="flex-between margin-top">
				<view class="font28">
					提现数量
				</view>
				<view class="font-gray">
					USDT 可用：{{balance}}
				</view>
			</view>
			<view class="flex-between prompt-input">
				<input  type="text" v-model="num" placeholder="请输入提现数量" />
				<view class="font-blue" @tap="all">
					全部
				</view>
			</view>
			<view class="flex-between margin-top">
				<view class="font28">
					资金密码
				</view>
			
			</view>
			<view class="flex-between prompt-input">
				<input  type="text" password="" v-model="payPassword" placeholder="请输入资金密码" />
			</view>
			<view class="font-gray font20 margin-top20">
				手续费：{{num*radio}} USDT≈{{num*radio*7}} CNY
			</view>
			<view class="font28 margin-top20">
				到账金额：{{num-(num*radio)}}USDT
			</view>
			<view class=" flex-row padding80 font28 ">
				<view class="sure" @tap="closePinMask">
					取消
				</view>
				<view class="font-blue" @tap="comfirm">
					确定
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import UniLoadMore from '@/components/uni-load-more.vue'
	export default {
		components: {
			UniLoadMore
		},
		data() {
			return {
				showPinMask: false,
				curPage: 1,
				loadingType: 'more',
				profitList: [],
				total: '',
				balance: '',
				num:'',
				radio:'',
				payPassword:'',
				
			};
		},
		onLoad() {
			//此页做下拉刷新跟上拉加载
			var _self = this
			if (!uni.getStorageSync("token")) {
				this.$base1._isLogin()
			}
			_self.getProfit()
			//获取收益提现手续费比例
			uni.request({
				url: this.baseUrl + "/withdraw-fee",
				header:{
					Authorization:uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if(res.data.status==1){
						this.radio = res.data.data
					}else{
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
					
				}
			})
			
			
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
			this.getProfit('refresh')

		},
		//上拉加载更多
		onReachBottom() {
			this.curPage++;
			this.getProfit('add');
		},
		methods: {
			closePinMask(){
				this.showPinMask = false
			},
			//加载奖品列表 ，带下拉刷新和上滑加载
			getProfit(type = 'add', loading) {
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
					this.profitList = [];
				}
				//收益账户
				uni.request({
					url: this.baseUrl + "/balance-list",
					data: {
						page: this.curPage,
						count: 100000
					},
					header: {
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						 if (res.data.status == 1) {
							this.profitList = this.profitList.concat(res.data.data.List)
							this.total = res.data.data.Total
							this.balance = res.data.data.Balance
							if (this.profitList.length == 0) {
								this.loadingType = '';
							} else if (this.profitList.length >= this.total) {
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
			all(){
				this.num = this.balance
			},
			balanceWithdraw(){
				this.showPinMask = true
			},
			comfirm(){
				uni.request({
					url: this.baseUrl + "/balance-withdraw",
					data: {
						PayPassword: this.payPassword,
						Number: this.num
					},
					method:"POST",
					header:{
						Authorization:uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						 if(res.data.status==1){
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
							this.showPinMask = false
						}else{
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
						
					}
				})
			},
			showType(type){
				if(type==1){
					return "静态奖励"
				}else if(type==2){
					return "邀请奖励"
				}else if(type==3){
					return "社区奖励"
				}else if(type==4){
					return "封号清空收益"
				}else if(type==5){
					return "平级奖励"
				}else if(type==6){
					return "全球分红"
				}else if(type==7){
					return "收益余额提现"
				}
				
			}

		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #fff;
	}
	.font36{
		font-size: 36rpx;
	}
	.font28{
		font-size: 28rpx;
	}
	.font20{
		font-size: 20rpx;
	}
	.margin-top20{
		margin-top: 20rpx;
	}
	.padding80{
		padding: 80rpx 0;
	}
	.content {
		font-size: 24rpx;
		color: #333;

		.top {
			font-size: 30rpx;
			margin-top: 20rpx;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
		}

		.list-item {
			line-height: 50rpx;
		}

		.title {
			height: 100rpx;
		}

		.rule {
			height: 140rpx;
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
		width: 70%;
		height: 680upx;
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
		margin-top: 30rpx;
		width: 90%;
		height: 100rpx;
		background-color: #F5F5F5;
		border-radius: 8rpx;
		font-size: 24rpx;
		text-align: left;
		padding-left: 26rpx;
		padding-right: 26rpx;
	}
	.sure {
		margin-left: 320rpx;
		margin-right: 80rpx;
	}
	
</style>
