<template>
	<view>
		<view class="flex-between coin-choose" @click="togglePopup('coin')">
			<view class="flex">
				<image class="logo" :src="currentCoin.Logo.trim() ? currentCoin.Logo : defaultImg" @error="currentCoin.logo = defaultImg"></image>
				<text class="coinname">{{currentCoin.EnName}}</text>
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
					<text class="font-gray font-small">可用：{{getBalance}} {{currentCoin.EnName}}</text>
				</view>
				<view class="input-wrap">
					<input type="number" placeholder="请输入转账金额" v-model="money"/>
					<text class="font-blue font-small flag" @click="money=getBalance">全部</text>
				</view>
			</view>
			<view>
				<view class="flex-between">收款地址</view>
				<view class="input-wrap">
					<input type="text" :placeholder="'请输入'+currentCoin.EnName+'地址'" v-model="address"/>
					<i class="iconfont icon-guanbi1 flag" @click="address=''"></i>
				</view>
			</view>
			<view>
				<view class="flex-between">
					<text>旷工费</text>
					<text class="font-gray font-small">默认旷工费</text>
				</view>
				<view class="input-wrap">
					<input type="text" v-model="freeMoney"/>
					<text class="font-blue font-small flag">ETH</text>
				</view>
			</view>
			<!-- <view>
				<view class="flex-between">备注</view>
				<view class="input-wrap">
					<input type="text" placeholder="输入备注内容" v-model="remark"/>
				</view>
			</view> -->
			<button class="blue" @click="transfer" hover-class="none">转账</button>
		</view>
		<uni-popup ref="coin" type="bottom" :custom="true">
			<view class="coin-list">
				<view :class="item.EnName==currentCoin.EnName ? 'active' : ''" v-for="(item,index) in coinList" :key="index" @click="changCoin(item)">{{item.EnName}}</view>
				<view class="cancle" @click="canclePopup('coin')">取消</view>
			</view>
		</uni-popup>
		<uni-popup ref="password" type="bottom" :custom="true">
			<view class="password-wrap">
				<view class="title">
					<text>请输入资金密码</text>
					<i class="iconfont icon-guanbi1" @click="canclePopup('password')"></i>
				</view>
				<view class="pwd-pop-content">
					<view class="input-wrap">
						<input type="password" v-model="pwd"/>
					</view>
					<navigator class="text-right font-blue" url="../forget/privatekey" hover-class="none">忘记密码?</navigator>
				</view>
				<button class="blue" @click="validatePwd">提交密码</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import wallet from "@/common/js/wallet.js";
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				defaultImg: '/static/images/default.png',
				money: '',
				address: '',
				freeMoney: '0.008',
				gasNum: 80000,
				wallet: {},
				coinBalance: {},
				coinList: [],
				currentCoin: {},
				pwd: ''
			}
		},
		onLoad(opt) {
			this.wallet = this.$Wallet.getCurrentWallet();
			this.coinBalance = JSON.parse(this.wallet.coin);
			this.currentCoin = JSON.parse(opt.coinItem);
			this.coinList = uni.getStorageSync(this.app._cacheCoin) || [];
		},
		computed: {
			getBalance() {
				return this.app._toFixed(this.coinBalance[this.currentCoin.EnName],2);
			}
		},
		methods: {
			togglePopup(type) {
				 this.$refs[type].open();
			},
			canclePopup(type){
				this.$refs[type].close();
			},
			changCoin(item){
				this.currentCoin = item;
				this.canclePopup('coin');
			},
			transfer(){
				if(!this.money){
					this.app._toast('请输入转账金额');return;
				}
				if(!this.address){
					this.app._toast('请输入收款地址');return;
				}
				if(!this.freeMoney || parseFloat(this.freeMoney) < 0){
					this.app._toast('旷工费必须大于0');return;
				}
				this.togglePopup('password');
			},
			validatePwd(){
				if(this.pwd != this.wallet.pin){
					this.app._toast('资金密码输入错误，请检查');return;
				}
				uni.showLoading({
				    title: '提交中'
				});
				let self = this;
				this.$Wallet.trasfer({
					privateKey: this.wallet.privateKey,
					toaddress: this.address,
					money: this.money,
					gasNum: this.gasNum,
					gasPrice: this.freeMoney,
					contractAddress: this.currentCoin.Ext,
					contractLength: this.currentCoin.Decimals
				},function(){
					self.pwd = '';
					self.canclePopup('password');
					self.app._toast('提交成功，转账处理中');
				},function(){
					self.pwd = '';
					self.canclePopup('password');
				});
			}
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
	.transfer-wrap input{background-color: #F8F8F8;height: 88upx;border-radius: 12upx;padding: 0 100upx 0 20upx;}
	.transfer-wrap button{margin-top: 60upx;}
	.password-wrap{background-color: #FFFFFF;padding: 0 0 60upx;}
	.password-wrap .title{text-align: center;position: relative;padding: 30upx 0;}
	.password-wrap .title .iconfont{position: absolute;right: 20upx;top: 32upx;}
	.pwd-pop-content{padding: 0 60upx 40upx;}
	.password-wrap input{border: 1px solid #EDEDED;width: 100%;height: 80upx;border-radius: 12upx;padding: 0 20upx;box-sizing: border-box;margin-bottom: 20upx;}
	.password-wrap button{height: 80upx;line-height: 80upx;}
</style>
