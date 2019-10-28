<template>
	<view class="content">
		<view class="font-blue font-big" :style="{color:showColor(authState)}">
			已绑定手机
		</view>
		<view class="margin-top">
			手机号：{{phone}}
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
			
				phone:''
			}
		},
		onLoad(options) {
			
			//获取用户信息
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
						
						this.phone = res.data.data.Phone
						
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
