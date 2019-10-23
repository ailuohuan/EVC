<template>
	<view class="content" >
		<view class="tabbar" :disabled="disabled">
			<image @tap="jumpToIndex" class="tabbar-img" :src="indexImg" mode="scaleToFill"></image>
			<view @tap="jumpToIndex" class="" :style="{color:fontColor1}">
				首页
			</view>
		</view>
		<view class="tabbar">
			<image @tap="jumpToWallet" class="tabbar-img" :src="walletImg" mode="scaleToFill"></image>
			<view class="" @tap="jumpToWallet" :style="{color:fontColor2}">
				钱包
			</view>
		</view>
		<view class="tabbar">
			<image @tap="jumpToTeam" class="tabbar-img" :src="teamImg" mode="scaleToFill"></image>
			<view class="" @tap="jumpToTeam" :style="{color:fontColor3}">
				团队
			</view>
		</view>
		<view class="tabbar" @tap="jumpToMy">
			<image class="tabbar-img" :src="myImg" mode="scaleToFill"></image>
			<view class="" @tap="jumpToMy" :style="{color:fontColor4}">
				我的
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		name: "evcTabbar",
		props:{
			fontColor1:{
				type:String
			},
			indexImg:{
				type:String,
				default: '/static/images/evctabbar/index.png'
			},
			fontColor2:{
				type:String,
			},
			walletImg:{
				type:String,
				default: '/static/images/evctabbar/wallet.png'
			},
			fontColor3:{
				type:String,
				
			},
			teamImg:{
				type:String,
				default: '/static/images/evctabbar/team.png'
			},
			fontColor4:{
				type:String
			},
			myImg:{
				type:String,
				default: '/static/images/evctabbar/my.png'
			}
		},
		data(){
			return{
			
				disabled:true
			}
		},
		
		methods:{
			jumpToIndex(){
				
				uni.redirectTo({
					url:"/pages/pagesB/index/index"
				})
			},
			jumpToWallet(){
				
				uni.redirectTo({
					url:"/pages/pagesB/wallet/wallet"
				})
			},
			jumpToTeam(){
				
				uni.redirectTo({
					url:"/pages/pagesB/my/my-team"
				})
			},
			jumpToMy(){
			
				uni.redirectTo({
					url:"/pages/pagesB/personal/personal"
				})
			}
		}
	}
</script>

<style>
	.content{
		height: 98rpx;
		width: 100%;
		background-color: #fff;
		font-size: 22rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		color: #ccc;
		border-top: 2rpx solid #ccc;
		padding: 0 20rpx;
	}
	.tabbar{
		box-sizing: border-box;
		padding-top: 10rpx;
		height: 98rpx;
		width: 120rpx;
		text-align: center;
	}
	.tabbar-img{
		width: 44rpx;
		height: 44rpx;
	}
</style>
