<template>
	<view class="content">
		<view class="font-blue font-big" :style="{color:showColor(authState)}">
			已绑地址
		</view>
		<view class="margin-top">
			{{addr}}
		</view>
		<view class="margin-top padding-top">
			<view class="margin-top padding-top">
				温馨提示：为保证您的数字资产安全，请您首先仔细阅读以下内容并绑定提现地址。
			</view>
			<view class="">
				1.该提现地址一经绑定，日后所有提现将只允许提现到该地址。
			</view>
			<view class="">
				2.该提现地址可以为EVC wallet、imtoken等去中心化钱包的地址。
			</view>
			<view class="">
				3.由于是智能合约自动处理，请勿将任何交易所的充值地址绑定为提现地址，绑定交易所充值地址将导致提现时资产丢失。
			</view>
			<view class="">
				4.绑定地址后无法修改和重置，如需重置请联系客服。
			</view>
			<view class="">
				5.请勿在地址头部和地址尾部加入空格，请仔细核对地址。
			</view>
		
		
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addr:''
			}
		},
		onLoad(options) {
			
			//获取用户绑定地址
			uni.request({
				url: this.baseUrl + "/member-info",
				header: {
					//除注册登录外其他的请求都携带用户token和秘钥
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						
						this.addr = res.data.data.Address
						
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				}
			})
		},
		onReady() {

		},
		methods: {
			jumpToRealName(){
				uni.navigateTo({
					url:"./real-name"
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		background-color: #fff;
		padding: 0 56rpx;
		font-size: 24rpx;
		color: #333;
		height: 1334rpx;

		
	}


	
</style>
