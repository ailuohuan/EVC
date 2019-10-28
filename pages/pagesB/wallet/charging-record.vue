<template>
	<!-- 充提记录 -->
	<view class="content">
		<view class="nav">
			<view class="nav-text" v-for="(item,index) in list" :key="item.id" :class="currentNumber == index ? 'active' : ''"
			 @tap="currentInfo(index)">
				{{item.title}}
			</view>
		</view>
		<view class="bgbox">

		</view>
		<view class="list">
			<view class="list-item" v-for="(item,index) in nameList " :key="index" @tap="jumpToRecordDetail(index)">
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
							{{$base1._toFixed(item.Money,4)}}{{item.CoinName}}
						</view>
						<view class="name-ch desc" :style="{color:showColor(item.Status,item.Type)}">
							{{ showStatus(item.Status,item.Type) }}
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
				nameList1: [],
				nameList2: [],
				nameList3: [],
				id: '',
				acid: '',
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
			// this.id = options.id
			if (!uni.getStorageSync("token") && !uni.getStorageSync("SecretKey")) {
				this.$base1._isLogin()
				return
			}
			this.getCoreDetail()
		},
		onPullDownRefresh() {
			this.getCoreDetail()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//充提记录
			getCoreDetail() {
				uni.request({
					url: this.baseUrl + "/recharge-withdraw",
					data: {
						page: 1,
						count: 100000,
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
							this.nameList = res.data.data.list
							this.nameList2 = res.data.data.list
							this.nameList3 = res.data.data.list

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
				
				var newArray = []
				var j = 0
				for (let i in this.nameList3) {
					if (this.nameList3[i].Type == 1) {
						newArray[j++] = this.nameList3[i]
					}
				}

				var newArray2 = []
				var j2 = 0
				for (let i in this.nameList2) {
					if (this.nameList2[i].Type == "2") {
						newArray2[j2++] = this.nameList2[i]
					}
				}

				//充提记录根据返回的Type动态显示 1充值 2提现

				if (this.currentNumber == 1) {
					
					this.nameList = newArray
				} 
				if(this.currentNumber == 2) {
					
					this.nameList = newArray2
				}
				if(this.currentNumber == 0){
					this.getCoreDetail()
				}


			},
			//处理状态返回的显示值
			//处理状态返回的显示值
			showStatus(status,type){
				if(type == 1){
					if(status == 0) return '区块确认中';
					else if(status == 1) return '已完成';
				}else{
					if(status == -1) return '驳回';
					else if(status == 0 || status == 3) return '待审核';
					else if(status == 1) return '区块确认中';
					else if(status == 2 || status == 4) return '已完成';
				}
			},
			//状态不同显示不同的颜色
			showColor(status,type){
				if(type == 1){
					if(status == 0) return "#333333";
					else if(status == 1) return '已完成';
				}else{
					if(status == -1) return "red";
					else if(status == 0 || status == 1 || status == 3) return "green";
					else if(status == 2 || status == 4) return '#333333';
				}
			},
			// showStatus(status) {
			// 	if (status) {
			// 		if (status == "-1") {
			// 			return "驳回"
			// 		} else if (status == "0") {

			// 			return "待审核"
			// 		} else if (status == "1") {

			// 			return "区块确认中"
			// 		} else if (status == "2") {
			// 			return "成功"
			// 		} else if (status == "3") {

			// 			return "待审核"
			// 		} 
			// 		// else if (status == "4") {

			// 		// 	return "处理成功"
			// 		// }
			// 	}
			// },
			//状态不同显示不同的颜色
			showColor(status) {
				if (status) {
					if (status == "-1") {
						return "red"
					} else if (status == "0") {

						return "green"
					} else if (status == "1") {

						return "green"
					} else if (status == "2") {
						return "blue"
					} else if (status == "3") {

						return "red"
					} else if (status == "4") {

						return "blue"
					}
				}
			},
			jumpToRecordDetail(index){
				//充提记录的详情
				//携带金额携带状态携带时间名称
				console.log(this.nameList[index].Money)
				uni.navigateTo({
					url:"./record-details?id="+this.nameList[index].Id+"&money="+this.nameList[index].Money+"&type="+this.nameList[index].Type+"&time="+this.nameList[index].AddTime+"&name="+this.nameList[index].CoinName
				})
				
			}
		}
	}
</script>

<style lang="scss">
	page {
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
