<template>
	<view>
		<view class="block text-center assets-wrap">
			<view class="font-blue money">{{num}} {{coinItem.EnName}}</view>
			<view class="font-gray">￥{{money}}</view>
		</view>
		<view class="block transfer-wrap">
			<view class="title">转账记录</view>
			<page-loading v-if="!pageLoad"></page-loading>
			<view v-else>
				<view class="nav">
					<text :class="mold == 0 ? 'active' : ''" @click="mold = 0">全部</text>
					<text :class="mold == 1 ? 'active' : ''" @click="mold = 1">收款</text>
					<text :class="mold == 2 ? 'active' : ''" @click="mold = 2">转账</text>
				</view>
				<view>
					<view class="no-data" v-if="1==2">
						<view><image src="../../static/images/nodata.png" mode="widthFix"></image></view>
						<view class="font-blue">这里还没有数据哦</view>
					</view>
					<view v-else class="transfer-list">
						<navigator class="item" v-for="(item,index) in 10" :key="index" url="transferDetail">
							<view class="flex-between">
								<text>收款</text>
								<text>+1000 BTC</text>
							</view>
							<view class="flex-between">
								<text class="font-gray font-small">2019-09-09 23:34:34</text>
								<text class="font-small">已完成</text>
							</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<navigator class="item" hover-class="none" url="charge">收款</navigator>
			<navigator class="blue item" hover-class="none" :url="'transfer?coinItem='+JSON.stringify(coinItem)">转账</navigator>
		</view>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	export default {
		data() {
			return {
				mold: 0, //0：全部，1：收款，2：转账
				pageLoad: true,
				wallet: {},
				coinItem: {},
				num: '',
				money: ''
			}
		},
		onLoad(opt) {
			this.wallet = this.$Wallet.getCurrentWallet();
			this.coinItem = JSON.parse(opt.coinItem);
			uni.setNavigationBarTitle({
				title: this.coinItem.EnName
			});
			this.num = opt.num;
			this.money = opt.money;
			this.getList();
		},
		methods: {
			getList(){
				let self = this , sendPara = {UnkowUrl1: 'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xd26114cd6EE289AccF82350c8d8487fedB8A0C07&address=0xA2B0f0bDc42f79E51838aC8c625609B3535c9Bd3&page=1&offset=1000&sort=desc'};
				uni.request({
					url: self.baseUrl + '/etherscan',
					method: 'GET',
					data: sendPara,
					success: res => {
						console.log(res.data);
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.block{border-top: 20upx solid #F8F8F8;}
	.no-data{text-align: center;margin-top: 100upx;}
	.no-data image{width: 140upx;margin-bottom: 14upx;}
	.assets-wrap{padding: 40upx 0;}
	.assets-wrap .money{font-weight: bold;font-size: 48upx;}
	.transfer-wrap{padding-bottom: 140upx;}
	.transfer-wrap .nav{display: flex;justify-content: space-around;color: #999999;height: 90upx;align-items: center;}
	.transfer-wrap .nav>text{padding-bottom: 10upx;}
	.transfer-wrap .nav .active{color: #0099FF;border-bottom: 2px solid #0099FF;}
	.transfer-wrap .title{font-weight: bold;border-bottom: 1px solid #F6F6F6;padding: 30upx 24upx;}
	.transfer-list{padding: 0 24upx;}
	.transfer-list .item{border-bottom: 1px solid #F8F8F8;padding: 30upx 0;}
	.footer{position: fixed;bottom: 0;width: 100%;display: flex;}
	.footer .item{flex: 1;background-color: #FFFFFF;color: #0099FF;border-top: 1px solid #F8F8F8;padding: 30upx 0;text-align: center;}
	.footer .blue{background-color: #0099FF;color: #FFFFFF;border-top: 1px solid #0099FF;}
</style>
