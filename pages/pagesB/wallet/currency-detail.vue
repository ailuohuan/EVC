<template>
	<view class="content">
		<view class="bgbox">
		</view>
		<view class="padding">
			<view class="flex-row padding-top">
				<view class="name">
					<image class="logo-img" :src="logo" mode=""></image>
				</view>
				<view class="font-blue font-big font-bold">
					{{money}}BTC
				</view>
			</view>
			<view class="flex-between padding-bottom">
				<view class="">
					<view class="">
						冻结
					</view>
					<view class="font-bold font36">
						{{forzen}}BTC
					</view>
				</view>
				<view class="">
					<view class="">
						折合CNY
					</view>
					<view class="font-bold font36">
						{{price}}
					</view>
				</view>
			</view>
		</view>
		<view class="bgbox">
		</view>
		<view class="nav padding">
			<view class="nav-text" v-for="(item,index) in list" :key="item.id" :class="currentNumber == index ? 'active' : ''"
			 @tap="currentInfo(index)">
				{{item.title}}
			</view>
		</view>
		<block v-if="showDetail">
			<view class="padding">
				<view class="">
					简介
				</view>
				<view class="font-bold font-middle">
					BTC
				</view>
				<view class="font20">
					比特币(Bitcoin)
				</view>
				<view class="text">
					比特币（BitCoin）的概念最初由中本聪在2008年提出，根据中本聪的思路设计发布的开源软件以及建构其上的P2P网络。比特币是一种P2P形式的数字货币。点对点的传输意味着一个去中心化的支付系统。
					与大多数货币不同，比特币不依靠特定货币机构发行，它依据特定算法，通过大量的计算产生，比特币经济使用整个p2p网络中众多节点构成的分布式数据库来确认并记录所有的交易行为，并使用密码学的设计来确保货币流通各个环节安全性。
					p2p的去中心化特性与算法本身可以确保无法通过大量制造比特币来人为操控币值。基于密码学的设计可以使比特币只能被真实的拥有者转移或支付。这同样确保了货币所有权与流通交易的匿名性。比特币与其他虚拟货币最大的不同，是其总数量非常有限，具有极强的稀缺性。该货币系统曾在4年内只有不超过1050万个，之后的总数量将被永久限制在2100万个。
					比特，是一种计算机专业术语，是信息量单位，是由英文BIT音译而来。二进制数的一位所包含的信息就是一比特，如二进制数0100就是4比特。那么，比特这个概念和货币联系到一起，不难看出，比特币非现实货币，而是一种计算机电子虚拟货币，存储在你的电脑上。
					目前，这种崭新的虚拟货币不受任何政府、任何银行控制。因此，它还未被合法化。
				</view>
				<view class="list">
					<view class="list-item" v-for="item in nameList2" :key="item.id">
						<text>{{item.leftText}}</text><text>{{item.rightText}}</text>
					</view>
				</view>
				</view>
		</block>
		<block v-else>
			<view class="list">
				<view class="list-item" v-for="(item,index) in nameList" :key="index" @tap="jumpToManage(index)">
					<view class="">
						<view class="name-en">
							{{item.Type==1?"充值":"提现"}}
						</view>
						<view class="name-ch">
							{{ $base1._formatDate(item.AddTime)}}
						</view>
					</view>
					<view class="list-item-right">
						<view class="">
							<view class="name-en">
								{{item.Money}}
							</view>
							<view class="name-ch desc" :style="{color:showColor(item.Status)}">
								{{showStatus(item.Status)}}
							</view>
						</view>
						<view class="iconfont icon">
							&#xea25;
						</view>
					</view>
				</view>
			</view>
		</block>
	<!-- 	<view class="nav flot-bottom">
			<view class="nav-text nav-btn" v-for="(item,index) in twoBtn" :key="item.id" :class="currentNumberBtn == index ? 'active-btn' : ''"
			 @tap="currentInfo2(index)">
				{{item.title}}
			</view>
		</view> -->
	</view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				currentNumber: 0, // 用来判断active样式类是否显示
				currentNumberBtn: 0,
				statusChange: '',
				curPage: 1,
				status: 0,
				nameList: [],
				id: '',
				acid: '',
				logo:'',
				list: [{
						title: "币种详情"
					},
					{
						title: "充提记录"
					}
				],
				twoBtn: [{
					title: '转出'
				}, {
					title: '转入'
				}],
				nameList2: [{
						leftText: '发行时间:',
						rightText: '2008-11-10'
					},
					{
						leftText: '发行总量:',
						rightText: '21,000,000'
					},
					{
						leftText: '流通总量：',
						rightText: '17,816,737'
					},
					{
						leftText: '众筹价格：',
						rightText: '17,816,737'
					},
					{
						leftText: '白皮书：',
						rightText: '17,816,737'
					},
					{
						leftText: '官网：',
						rightText: '17,816,737'
					},
					{
						leftText: '区块链查询：',
						rightText: '17,816,737'
					},
					{
						leftText: '手机钱包下载地址：',
						rightText: '17,816,737'
					},
					{
						leftText: 'PC钱包下载地址：',
						rightText: '17,816,737'
					}

				],
				money: '',
				forzen: '',
				price: '',
				coinId: '',
				showDetail: true
			};
		},
		onLoad(options) {
			this.coinId = options.coinId
			this.money = options.money
			this.forzen = options.foezen
			this.price = options.price
			this.logo = options.logo
			this.getCoreDetail()
		},
		onPullDownRefresh() {
			this.getCoreDetail()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			currentInfo(index) {
				this.currentNumber = index;
				if(this.currentNumber == 1){
					this.showDetail=false
				}else{
					this.showDetail=true
				}
				//单个币种的充提记录
				uni.request({
					url: this.baseUrl + "/recharge-withdraw",
					data:{
						page:1,
						count:100000,
						Id:this.coinId
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						 if (res.data.status == 1) {
							this.nameList = res.data.data.list
							console.log(JSON.stringify(this.nameList))
	
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			//处理状态返回的显示值
			showStatus(status){
				if(status){
					if(status=="-1"){
						return "驳回" 
					}else if(status=="0"){
						
						return "待处理"
					}else if(status=="1"){
						
						return "处理中"
					}else if(status=="2"){
						return "已处理"
					}else if(status=="3"){
						
						return "失败"
					}else if(status=="4"){
						
						return "处理成功"
					}
				}
			},
			//状态不同显示不同的颜色
			showColor(status){
				if(status){
					if(status=="-1"){
						return "red" 
					}else if(status=="0"){
						
						return "green"
					}else if(status=="1"){
						
						return "green"
					}else if(status=="2"){
						return "blue"
					}else if(status=="3"){
						
						return "red"
					}else if(status=="4"){
						
						return "blue"
					}
				}
			},
			currentBtnIndex(index) {
				this.currentNumberBtn = index
			},
			//根据币种Id获取币种
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/single-coin",
					data: {
						Id: this.coinId
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {


						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			showState(state) {
				if (state == 1) {
					return "待理财";
				} else if (state == 2) {
					return "理财中"
				} else if (state == 3) {
					return "已撤资"
				} else if (state == 4) {
					return "已完结"
				}
			},
			jumpToManage(index) {
				this.id = this.nameList[index].Id
				this.acid = this.nameList[index].ActivityId
				console.log(this.id) //我的理财id
				console.log(this.acid) //理财活动id
				uni.navigateTo({
					url: "./manage-in?id=" + this.id + "&acid=" + this.acid //需要传一个investmentId过去,还需传一个acid过去获取天数
				})
			}
		}
	}
</script>

<style lang="scss">
	.active {
		color: #0099FF;
		font-weight: bold;
	}

	.font36 {
		font-size: 36rpx;
	}

	.font20 {
		font-size: 20rpx;
	}

	.logo-img {
		width: 52rpx;
		height: 52rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.text {
		font-size: 26rpx;
		line-height: 60rpx;
		text-indent: 40rpx;
	}

	.list {
		margin-bottom: 90rpx;
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
				font-weight: bold;
			}
	
			.name-ch {
				font-size: 24rpx;
				color: #999;
				display: flex;
				flex-direction: row-reverse;
	
			}
	
			.desc {
				color: #17A52F;
			}
		}
	}
	.content {
		box-sizing: border-box;
		color: #333;
		background-color: #fff;

		.nav {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.nav-text {
				height: 88rpx;
				line-height: 88rpx;
				width: 50%;
				background-color: #fff;
				text-align: center;
			}

			.nav-btn {
				background-color: #007AFF;
				color: #fff;
			}

			.active-btn {
				color: #007AFF;
				background-color: #fff;
			}
		}

		.list-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 26rpx;
			line-height: 80rpx;
		}
	}

	.flot-bottom {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
	}
</style>
