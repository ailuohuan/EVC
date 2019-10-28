<template>
	<page-loading v-if="!pageLoad"></page-loading>
	<view v-else>
		<view class="block text-center assets-wrap">
			<view class="name">{{coinName}}</view>
			<view class="font-gray">{{type == 1 ? '充值' : '提币'}}</view>
			<view class="font-blue money">{{app._toFixed(detail.Money,4)}} {{coinName}}</view>
		</view>
		<view class="block transferDetail">
			<view class="flex-between">
				<text class="font-gray">时间</text>
				<text class="value">{{app._formatDate(detail.AddTime)}}</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">收款地址</text>
				<text class="value text-overflow">{{detail.Address}}</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">哈希值</text>
				<text class="value">{{detail.Hash}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageLoad: false,
				token: '',
				id: '', //1：充值，2：提币
				type: '',
				coinName: '',
				detail: {}
			}
		},
		onLoad(opt){
			this.token = uni.getStorageSync('token');
			this.id = opt.id;
			this.type = opt.type;
			this.coinName = opt.coinname;
			this.getData();
		},
		methods: {
			getData(){
				let self = this , sendUrl = this.baseUrl + '/recharge-detail', sendPara = {Id: this.id};
				if(this.type == 2){
					sendUrl = this.baseUrl + '/withdraw-detail';
				}
				uni.request({
					url: sendUrl,
					method: 'GET',
					data: sendPara,
					header: {Authorization: self.token},
					success: res => {
						console.log(res.data);
						if(res.data.status == 1){
							self.detail = res.data.data;
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
	.assets-wrap{padding: 40upx 0;}
	.assets-wrap .name{font-weight: bold;}
	.assets-wrap .money{font-weight: bold;font-size: 48upx;margin-top: 12upx;}
	.transferDetail>.flex-between{padding: 30upx 24upx;}
	.transferDetail .font-gray{width: 200upx;}
	.transferDetail .value{flex: 1;word-break: break-all;text-align: right;width: 300upx;}
</style>
