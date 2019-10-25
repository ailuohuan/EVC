<template>
	<!-- 公告详情 -->
	<view class="content">
		<view class="bgbox">

		</view>
		<view class="font40 font-bold">
			{{title}}
		</view>
		<view class="font-gray margin-top padding-top">
			{{ $base1._formatDate(time) }}
		</view>
		
		<view class="margin-top" v-html="container">
		</view>
		

	</view>
</template>

<script>
	export default {

		data() {
			return {
				content:[],
				container:'',
				id:'',
				title:'',
				time:'',
				
			}
		},
		onLoad(options) {
			console.log(this.id)
			this.id = options.id
			//公告详情
			uni.request({
				url: this.baseUrl + "/notice-detail",
				data:{
					Id:this.id
				},
				header: {
					//除注册登录外其他的请求都携带用户token和秘钥
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if (res.data.status == 1) {
						this.title = res.data.data.Title
						this.time =res.data.data.AddTime
						this.container = res.data.data.Content
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
		padding: 0 48rpx;
		.font40{
			font-size: 40rpx;
		}
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
