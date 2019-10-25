<template>
	<view class="content">
		<view class="bgbox">

		</view>
		<view v-html="container">
		</view>
		

	</view>
</template>

<script>
	export default {

		data() {
			return {
				content:[],
				container:''
			}
		},
		onLoad() {
			
			//常见问题
			uni.request({
				url: this.baseUrl + "/member-doc",
				header: {
					//除注册登录外其他的请求都携带用户token和秘钥
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.content = res.data.data
						this.container = this.content[0].AboutUs
						console.log(this.container)
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.content {
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		background-color: #F7F7F7;
		height: 1334rpx;

		.top {
			height: 110rpx;
			line-height: 110rpx;
			background-color: #fff;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 0 26rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #F1F1F1;

			
		}
		.answer{
			margin-top: 20rpx;
			padding: 0 20rpx;
		}

	}
</style>
