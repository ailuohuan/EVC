<template>
	<view>
		<view class="flex-between coin-choose" @click="togglePopup('coin')">
			<view class="flex">
				<image class="logo" src="../../static/images/BTC@2x.png"></image>
				<text class="coinname">USDT</text>
			</view>
			<view class="font-gray flex">
				<text class="font-small">切换币种</text>
				<i class="iconfont icon-return-copy-copy-copy font-small"></i>
			</view>
		</view>
		<view class="transfer-wrap">
			<view>
				<view class="flex-between">
					<text>转账金额</text>
					<text class="font-gray font-small">可用：32423.34 USDT</text>
				</view>
				<view class="input-wrap">
					<input type="number" placeholder="请输入转账金额"/>
					<text class="font-blue font-small flag">全部</text>
				</view>
			</view>
			<view>
				<view class="flex-between">收款地址</view>
				<view class="input-wrap">
					<input type="text" placeholder="请输入BTC地址"/>
				</view>
			</view>
			<view>
				<view class="flex-between">
					<text>旷工费</text>
					<text class="font-gray font-small">默认旷工费</text>
				</view>
				<view class="input-wrap">
					<input type="text" value="0.2323 USDT"/>
				</view>
			</view>
			<view>
				<view class="flex-between">备注</view>
				<view class="input-wrap">
					<input type="text" placeholder="输入备注内容"/>
				</view>
			</view>
			<button class="blue" @click="togglePopup('password')" hover-class="none">转账</button>
		</view>
		<uni-popup ref="coin" type="bottom" :custom="true">
			<view class="coin-list">
				<view class="active">BTC</view>
				<view>ETH</view>
				<view>USDT</view>
				<view>CNY</view>
				<view class="cancle" @click="canclePopup('coin')">取消</view>
			</view>
		</uni-popup>
		<uni-popup ref="password" type="bottom" :custom="true">
			<view class="password-wrap">
				<view class="title">
					<text>请输入PIN码</text>
					<i class="iconfont icon-guanbi1" @click="canclePopup('password')"></i>
				</view>
				<view class="input-wrap">
					<input type="password" />
					<button class="blue">确认</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				
			}
		},
		methods: {
			togglePopup(type) {
				 this.$refs[type].open();
			},
			canclePopup(type){
				this.$refs[type].close();
			},
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.coin-choose{border-top: 10px solid #F8F8F8;border-bottom: 10px solid #F8F8F8;padding: 24upx;}
	.coin-choose .logo{width: 56upx;height: 56upx;}
	.coin-choose .coinname{font-weight: bold;margin-left: 12upx;}
	.coin-choose .iconfont{position: relative;top: 6upx;}
	.address-wrap{padding-top: 60upx;}
	.address-wrap .address{margin-bottom: 12upx;}
	.ercode image{width: 300upx;height: 300upx;margin: 100upx 0;}
	.coin-list{background-color: #FFFFFF;text-align: center;}
	.coin-list>view{border-bottom: 1px solid #F7F7F7;padding: 30upx 0;}
	.coin-list .cancle{border-top: 20upx solid #F8F8F8;}
	.coin-list .active{color: #0099FF;font-weight: bold;}
	.transfer-wrap{padding: 30upx 24upx;}
	.transfer-wrap>view{margin-top: 40upx;}
	.transfer-wrap .input-wrap{margin-top: 20upx;position: relative;}
	.transfer-wrap .input-wrap .flag{position: absolute;top: 30upx;right: 20upx;}
	.transfer-wrap input{background-color: #F8F8F8;height: 88upx;border-radius: 12upx;padding: 0 20upx;}
	.transfer-wrap button{margin-top: 60upx;}
	.password-wrap{background-color: #FFFFFF;}
	.password-wrap .title{text-align: center;position: relative;padding: 30upx 0;}
	.password-wrap .title .iconfont{position: absolute;right: 20upx;top: 32upx;}
	.password-wrap .input-wrap{display: flex;align-items: center;padding: 30upx 50upx 60upx;}
	.password-wrap input{border: 1px solid #EDEDED;margin-right: 30upx;width: 90%;height: 80upx;border-radius: 12upx;padding: 0 20upx;box-sizing: border-box;}
	.password-wrap button{height: 80upx;line-height: 80upx;opacity: 0.5;}
</style>
