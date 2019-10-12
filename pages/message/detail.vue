<template>
	<view>
		<view class="block text-center money-wrap">
			<view>转账成功</view>
			<view class="font-blue"><text class="money">0.001</text><text>ether</text></view>
		</view>
		<view class="block">
			<view class="flex-between">
				<text class="font-gray">发款方</text>
				<text class="value">alskdjflkasjdflsjdlkfjsd</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">收款方</text>
				<text class="value">ajsdlkfjasldasdflkasdjflsddfddfals</text>
			</view>
			<view class="flex-between">
				<text class="font-gray">备注</text>
				<text class="value">无</text>
			</view>
			<view class="bottom flex-between">
				<view class="left">
					<view>
						<text class="font-gray">交易号</text>
						<view>23423423432</view>
					</view>
					<view>
						<text class="font-gray">区块</text>
						<view>23423</view>
					</view>
					<view>
						<text class="font-gray">交易时间</text>
						<view>2019-09-09 12:22:23</view>
					</view>
				</view>
				<view class="right">
					<image src="../../static/images/ercode.png"></image>
					<button class="blue">复制URL</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.block{border-top: 20upx solid #F8F8F8;padding: 0 24upx;}
	.money-wrap{padding: 50upx 0;line-height: 1.5;}
	.money-wrap .money{font-weight: bold;font-size: 52upx;}
	.block>.flex-between{padding: 30upx 0;}
	.block>.flex-between .font-gray{width: 200upx;}
	.block .value{flex: 1;word-break: break-all;}
	.bottom{border-top: 1px solid #F6F6F6;}
	.bottom .left>view{padding: 20upx 0;line-height: 1.7;}
	.bottom .right image{width: 200upx;height: 200upx;}
	.bottom .right button{width: 100%;height: 70upx;line-height: 70upx;font-size: 28upx;margin-top: 12upx;;}
</style>
