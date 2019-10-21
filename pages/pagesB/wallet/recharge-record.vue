<template>
	<view class="content">
	
		<view class="bgbox">
		</view>
		<view class="padding">
			<view class="flex-row padding-top">
				<view class="name">
				<image class="logo-img" src="../../../static/images/BTC@2x.png" mode=""></image>
				</view>
				<view class="font-blue font-big font-bold">
					+0.6920USTD
				</view>
			</view>
			<view class="flex-between padding-bottom">
				<view class="">
					<view class="">
						冻结
					</view>
					<view class="font-bold font36">
						000.000BTC
					</view>
				</view>
				<view class="">
					<view class="">
						折合CNY
					</view>
					<view class="font-bold font36">
						000.000
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
		
		<view class="">
			<view class="list">
				<view class="list-item" v-for="(item,index) in nameList3" :key="index" @tap="jumpToManage(index)">
					<view class="">
						<view class="name-en">
							{{item.title}}
						</view>
						<view class="name-ch">
							{{item.time}}
						</view>
					</view>
					<view class="list-item-right">
						<view class="">
							<view class="name-en">
								{{item.money}}
							</view>
							<view class="name-ch desc">
								{{item.status}}
							</view>
						</view>
						<view class="iconfont icon">
							&#xea25;
						</view>
					</view>
				</view>
			</view>
		</view>		
		<view class="nav flot-bottom">
			<view class="nav-text nav-btn" v-for="(item,index) in twoBtn" :key="item.id" :class="currentNumberBtn == index ? 'active-btn' : ''"
			 @tap="currentInfo(index)">
				{{item.title}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				currentNumber: 0, // 用来判断active样式类是否显示
				currentNumberBtn:0,
				headerTitle: 'BTC',
				statusChange: '',
				curPage: 1,
				status: 0,
				nameList: [
					{title:'充值',time:'2019-09-10 14:30:15',money:'+1000BTC',status:'已完成'}
				],
				id: '',
				acid:'',
				list: [{
						title: "币种详情"
					},
					{
						title: "充提记录"
					}
				],
				twoBtn:[{
					title:'转出'
				},{title:'转入'}],
				nameList3: [
					{title:'充值',time:'2019-09-10 14:30:15',money:'+1000BTC',status:'已完成'},{title:'充值',time:'2019-09-10 14:30:15',money:'+1000BTC',status:'已完成'},
					{title:'充值',time:'2019-09-10 14:30:15',money:'+1000BTC',status:'已完成'},
					{title:'充值',time:'2019-09-10 14:30:15',money:'+1000BTC',status:'已完成'},
					{title:'充值',time:'2019-09-10 14:30:15',money:'+1000BTC',status:'已完成'}
				],
			};
		},
		onLoad(options) {
			
			this.activityId = options.activityId
			console.log(this.activityId)
			this.getCoreDetail()
		},
		onPullDownRefresh() {
			this.getCoreDetail()
			  setTimeout(function () {
				  uni.stopPullDownRefresh();
			  }, 1000);
		  },
		methods: {
			currentInfo(index) {
				this.currentNumber = index;
				console.log(this.currentNumber)
				this.status = this.currentNumber
				//我的理财列表动态 显示
				uni.request({
					url: this.baseUrl + "/investment-list?status=" + this.status,
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token'),
						SecretKey: uni.getStorageSync('SecretKey')
					},
					success: (res) => {
						console.log(res)
						if (res.data.status == 20003) {
							this.$base._isLogin()
						} else if (res.data.status == 1) {
							// this.nameList = res.data.data.data
							console.log(this.nameList)
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			currentBtnIndex(index){
				this.currentNumberBtn=index
			},
			//我的理财列表 显示全部
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/investment-list?status=" + this.status,
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token'),
						SecretKey: uni.getStorageSync('SecretKey')
					},
					success: (res) => {
						
						console.log(res.data)
						if (res.data.status == 20003) {
							this.$base._isLogin()
						} else if (res.data.status == 1) {
							// this.nameList = res.data.data.data
							
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			showState(state){
				if(state==1){
					return  "待理财";
				}else if(state==2){
					return "理财中"
				}else if(state==3){
					return "已撤资"
				}else if(state==4){
					return "已完结"
				}
			},
			jumpToManage(index) {
				this.id = this.nameList[index].Id
				this.acid = this.nameList[index].ActivityId
				console.log(this.id)//我的理财id
				console.log(this.acid)//理财活动id
				uni.navigateTo({
					url: "./manage-in?id=" + this.id +"&acid="+this.acid//需要传一个investmentId过去,还需传一个acid过去获取天数
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
	
	.font36{
		font-size: 36rpx;
	}
	.font20{
		font-size: 20rpx;
	}
	.logo-img{
		width: 52rpx;
		height: 52rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}
	.text{
		font-size: 26rpx;
		line-height: 60rpx;
		text-indent:40rpx;
	}
	.list {
		padding-bottom: 70rpx;
		.list-item {
			height: 140rpx;
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
			.nav-btn{
				background-color: #007AFF;
				color: #fff;
			}
			.active-btn{
				color: #007AFF;
				background-color: #fff;
			}
		}
		
	}
	.flot-bottom{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
	}
</style>
