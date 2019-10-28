<template>
	<view class="content">		
		
		<view class="bgbox">
			
		</view>
		<view class="middle">
			<view class="all">
				<view class="name">
				{{name}}
				</view>
				<view class="transfer-accounts">
				{{type == 1 ?"充值":"提现"}}
				</view>
			</view>
			<view class="all-num blue">
				{{$base1._toFixed(money,4)}}{{name}}
			</view>
				
		</view>		
		<view class="bgbox">
			
		</view>
		<view class="list padding">
			<view class="list-item flex-between" v-for="item in nameList" :key="item.id">
				
					<view>{{item.leftText}}</view><view class="text-right right-text text-overflow">{{item.rightText}}</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				nameList:[					
					{leftText:'时间:',rightText:''},
					// {leftText:'区块高度:',rightText:'6984112（43282块确认'},
					{leftText:'接收地址：',rightText:''},
					
					{leftText:'哈希值：',rightText:''},
					
				],
			
				id:'',
				money:'',
				status:'',
				name:'',
				time:'',
				type:''
			};
		},
		onLoad(options) {
			//
			this.id = options.id
			this.money = options.money
			// this.status = options.status
			this.time = options.time
			this.name =options.name
			
			this.type = options.type
			console.log(this.type)
			if(this.type==1){
				//充值详情
				uni.request({
				    url: this.baseUrl+"/recharge-detail",
					data:{
						Id:this.id
					},
					header:{
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization:uni.getStorageSync('token')
					},
				    success: (res) => {	
						//返回值为空Hash只是穿上去测试了
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if(res.data.status==1){
							this.nameList[0].rightText = this.$base1._formatDate(this.time) 
							this.nameList[1].rightText = res.data.data.Address
							this.nameList[2].rightText = res.data.data.Hash
							
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}
				    }
				})	
			}else if(this.type==2){
				//充值详情
				uni.request({
				    url: this.baseUrl+"/withdraw-detail",
					data:{
						Id:this.id
					},
					header:{
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization:uni.getStorageSync('token')
					},
				    success: (res) => {	
						//返回值为空Hash只是穿上去测试了
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if(res.data.status==1){
							this.nameList[0].rightText = this.$base1._formatDate(this.time)
							this.nameList[1].rightText = res.data.data.Address
							this.nameList[2].rightText = res.data.data.Hash
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}
				    }
				})	
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		
		box-sizing: border-box;
		font-size: 30rpx;
		background-color: #fff;
		height: 1334rpx;
		.right-text{
			width: 300rpx;
			
		}
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
			margin-top: 30rpx;
			color: #333;			
			text-align: center;
			.currency-img {
				width: 80rpx;
				height: 80rpx;
			}
			.name {
				font-size: 36rpx;
				font-weight: bold;
			}
			.transfer-accounts {
				font-size: 28rpx;				
				color: #999;
			}
			.all-num {
				font-size: 60rpx;
				margin-top: 36rpx;
				font-weight: bold;
			}

			.all-num-equal {
				font-size: 30rpx;
				color: #999;
				margin-top: 34rpx;
			}
			.blue{
				color: #007AFF;
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
</style>

