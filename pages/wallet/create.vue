<template>
	<view class="content">
		<view class="logo"><image src="../../static/images/logo.png" mode="aspectFill"></image></view>
		<view class="input-wrap">
			<view>
				<input :type="hidden ? 'password' : 'text'" placeholder="设置PIN(8-20位数字和字母)" placeholder-class="input-placeholder">
				<i class="iconfont font-gray" :class="hidden ? 'icon-yanjing-biyan' : 'icon-yanjing-zhengyan'" @click="hidden = !hidden"></i>
			</view>
			<view><input type="password" placeholder="确认PIN" placeholder-class="input-placeholder"></view>
		</view>
		<view>
			<button class="blue" hover-class="none" @click="backupMnemonic">创建</button>
			<view class="font-small text-center">
				<text class="font-gray">创建即表示同意</text>
				<text class="font-blue">《用户服务协议》</text>
			</view>
		</view>
		<navigator class="font-blue footer" url="import" hover-class="none">导入钱包</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hidden: true
			}
		},
		methods: {
			backupMnemonic(){
				uni.navigateTo({
					url: "backupMnemonic1"
				})
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding-top: 100upx;}
	.logo{width: 200upx;height: 200upx;background-color: #FFFFFF;box-shadow: 0 0 10upx rgba(0,0,0,.07);margin: 0 auto 100upx;text-align: center;padding-top: 20upx;box-sizing: border-box;}
	.logo image{width: 160upx;height: 160upx;}
	.input-wrap{padding: 0 15%;}
	.input-wrap>view{border-bottom: 1px solid #ECECEC;padding: 20upx 0;margin-bottom: 40upx;display: flex;align-items: center;}
	.input-wrap input{flex: 1;}
	button.blue{margin-bottom: 20upx;margin-top: 80upx;opacity: 0.5;}
	.footer{position: fixed;width: 100%;text-align: center;bottom: 60upx;}
</style>
