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
					<text :class="mold == 0 ? 'active' : ''" @click="moldChange(0)">全部</text>
					<text :class="mold == 1 ? 'active' : ''" @click="moldChange(1)">收款</text>
					<text :class="mold == 2 ? 'active' : ''" @click="moldChange(2)">转账</text>
				</view>
				<view>
					<view class="no-data" v-if="!record.length">
						<view><image src="../../static/images/nodata.png" mode="widthFix"></image></view>
						<view class="font-blue">这里还没有数据哦</view>
					</view>
					<view v-else class="transfer-list">
						<navigator class="item" v-for="(item,index) in record" :key="index" :url="'transferDetail?coinname='+coinItem.EnName+'&item='+JSON.stringify(item)">
							<view class="flex-between" v-if="item.from.toLowerCase() == wallet.address.toLowerCase()">
								<text>转账</text>
								<text>-{{item.value}} {{coinItem.EnName}}</text>
							</view>
							<view class="flex-between" v-else>
								<text>收款</text>
								<text>+{{item.value}} {{coinItem.EnName}}</text>
							</view>
							<view class="flex-between">
								<text class="font-gray font-small">{{app._formatDate(item.timeStamp)}}</text>
								<text class="font-small" v-if="item.isError==1">交易失败</text>
								<block v-else>
									<text class="font-small" v-if="item.confirmations>12">已完成</text>
									<text class="font-small font-green" v-else>区块确认中</text>
								</block>
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
				pageLoad: false,
				wallet: {},
				coinItem: {},
				num: '',
				money: '',
				allRecord: [],
				record: []
			}
		},
		onLoad(opt) {
			this.wallet = this.$Wallet.getCurrentWallet();
			this.coinItem = JSON.parse(opt.coinItem);
			this.num = opt.num;
			this.money = opt.money;
			this.allRecord = uni.getStorageSync(this.app._cacheList) || [];
			this.record = [...this.allRecord];
			if(this.record.length) this.pageLoad = true;
			uni.setNavigationBarTitle({
				title: this.coinItem.EnName
			});
			this.getList();
		},
		methods: {
			moldChange(value){
				this.mold = value;
				if(this.mold == 0){
					this.record = [...this.allRecord];
				}else if(this.mold == 1){
					this.record = this.allRecord.filter(item => {
						return item.from != this.wallet.address;
					});
				}else{
					this.record = this.allRecord.filter(item => {
						return item.from == this.wallet.address;
					});
				}
			},
			getList(){
				let self = this , sendPara = {};
				if(this.coinItem.EnName.toUpperCase() == 'ETH'){
					sendPara = {UnkowUrl1: "https://api.etherscan.io/api?module=account&action=txlist&address=" + this.wallet.address + "&page=1&offset=1000&sort=desc"};
				}else{
					sendPara = {UnkowUrl1: "https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=" + this.coinItem.Ext + "&address=" + this.wallet.address + "&page=1&offset=1000&sort=desc"};
				}
				uni.request({
					url: self.baseUrl + '/etherscan',
					method: 'GET',
					data: sendPara,
					success: res => {
						if(res.data.status == 1){
							self.allRecord = res.data.data.result;
							self.allRecord.map(function(item) {
								if(self.coinItem.EnName.toUpperCase() == 'ETH'){
									item.value = self.$Wallet.formatValue(item.value,18);
								}else{
									item.value = self.$Wallet.formatValue(item.value,self.coinItem.Decimals);
								}
							});
							if(self.mold == 0){
								self.record = [...self.allRecord];
							}else if(self.mold == 1){
								self.record = self.allRecord.filter(item => {
									return item.from != self.wallet.address;
								});
							}else{
								self.record = self.allRecord.filter(item => {
									return item.from == self.wallet.address;
								});
							}
							self.record.sort(function(b, a) {
								return a.blockNumber - b.blockNumber;
							});
							uni.setStorageSync(self.app._cacheList,self.allRecord);
						}
						self.pageLoad = true;
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
	.transfer-wrap .nav>text{padding: 10upx 40upx;}
	.transfer-wrap .nav .active{color: #0099FF;border-bottom: 2px solid #0099FF;}
	.transfer-wrap .title{font-weight: bold;border-bottom: 1px solid #F6F6F6;padding: 30upx 24upx;}
	.transfer-list{padding: 0 24upx;}
	.transfer-list .item{border-bottom: 1px solid #F8F8F8;padding: 30upx 0;}
	.footer{position: fixed;bottom: 0;width: 100%;display: flex;}
	.footer .item{flex: 1;background-color: #FFFFFF;color: #0099FF;border-top: 1px solid #F8F8F8;padding: 30upx 0;text-align: center;}
	.footer .blue{background-color: #0099FF;color: #FFFFFF;border-top: 1px solid #0099FF;}
</style>
