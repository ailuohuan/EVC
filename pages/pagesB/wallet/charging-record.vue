<template>
	<!-- 充提记录 -->
	<view class="content">
		<view class="nav">
			<view class="nav-text" v-for="(item,index) in list" :key="item.id" :class="currentNumber == index ? 'active' : ''" @tap="currentInfo(index)">
				{{item.title}}
			</view>
		</view>
		<view class="bgbox">
		
		</view>
		<view class="list">
			<view class="list-item" v-for="(item,index) in nameList" :key="index" @tap="jumpToRecordDetail(index)">
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
							{{item.Money}}{{item.CoinName}}
						</view>
						<view class="name-ch desc" :style="{color:showColor(item.Status)}">
							{{ showStatus(item.Status) }}
						</view>
					</view>
					<view class="iconfont icon">
						&#xea25;
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
				currentNumber: 0, // 用来判断active样式类是否s
				curPage: 1,
				status: 0,
				nameList: [],
				id: '',
				acid:'',
				list: [{
						title: "全部"
					},
					{
						title: "充值"
					},
					{
						title: "提现"
					}
				]
			};
		},
		onLoad(options) {
			this.id = options.id
			if(!uni.getStorageSync("token")&&!uni.getStorageSync("SecretKey")){
				this.$base1._isLogin()
			}
			this.getCoreDetail()
		},
		onPullDownRefresh() {
			this.getCoreDetail()
			  setTimeout(function () {
				  uni.stopPullDownRefresh();
			  }, 1000);
		  },
		methods: {
			//充提记录
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/recharge-withdraw",
					data:{
						page:1,
						count:100000,
					},
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else  if (res.data.status == 1) {
							this.nameList = res.data.data.list
							
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			currentInfo(index) {
				this.currentNumber = index;
			     
				if(this.currentNumber==1){
					//充提记录根据返回的Type动态显示 1充值 2提现
					for(var i=0; i<this.nameList.length;i++){
						if(this.nameList[i].Type==2){
						 this.nameList.splice(i--,1)
						}
					}
				} else{
					if(this.currentNumber==2){
						for(var i=0; i < this.nameList.length; i++){
							if(this.nameList[i].Type==1){
							 this.nameList.splice(i--,1)
							}
						}
					}else{
						this.getCoreDetail()
					}
					
				}
				
				
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
	page{
		background-color: #fff;
	}
	.active {
		color: #0099FF;
		border-bottom: 2rpx solid #007AFF;
	}

	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		
		.nav {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.nav-text {
				height: 88rpx;
				line-height: 88rpx;
				width: 150rpx;
				background-color: #fff;
				text-align: center;
			}
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
	}
</style>
