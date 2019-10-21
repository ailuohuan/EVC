<template>
	<view class="content">		
		<page-head2 :headerTitle="headerTitle"></page-head2>
		<view class="bgbox">
			
		</view>
		<view class="middle">
			<view class="all">
				<view class="name">
				USTD
				</view>
				<view class="transfer-accounts">
					收款/转账
				</view>
			</view>
			<view class="all-num blue">
				+0.6920USTD
			</view>
				
		</view>		
		<view class="bgbox">
			
		</view>
		<view class="list padding">
			<view class="list-item" v-for="item in nameList" :key="item.id">
				
					<text>{{item.leftText}}</text><text>{{item.rightText}}</text>
				
			</view>
		</view>
	</view>
</template>

<script>
	import pageHead2 from '@/components/page-head2.vue';
	export default {
		components:{
			pageHead2
		},
		data() {
			return {
				nameList:[					
					{leftText:'时间戳:',rightText:'2019-09-19 14:58:03'},
					{leftText:'区块高度:',rightText:'6984112（43282块确认'},
					{leftText:'接收地址：',rightText:'udwgufewfjiebufbwfbwjegbwv'},
					
					{leftText:'哈希值：',rightText:'liodoiuendjfhwofnkovidoshwq90375kdmc...'},
					
				],
				headerTitle:'记录详情'
			};
		},
		onLoad() {
			
			//根据hash值获取转账收款详情
			//转账详情
			//hash值传页面的hash值应该传哪个？？？
		
			uni.request({
			    url: this.baseUrl+"/core-recharge_detail?Hash=receivables",
				header:{
					//除注册登录外其他的请求都携带用户token和秘钥
					Authorization:uni.getStorageSync('token'),
					SecretKey:uni.getStorageSync('SecretKey')
				},
			    success: (res) => {	
					//返回值为空Hash只是穿上去测试了
					console.log(res.data)
					if(res.data.status==20003){
						this.$base._isLogin()
					}else if(res.data.status==1){
						uni.showToast({
							title:res.data.message,
							icon:"none"
						})
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
</script>

<style lang="scss" scoped>
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

