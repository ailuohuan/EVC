<template>
	<view class="content">
		<view class="title margin-top">
			{{title}}
		</view>
		<view class="time flex-between">
			<!-- <text class="font-gray">25463阅读</text> --><text class="font-gray">{{time}}</text>
		</view>
		<view class="desc font-gray" v-html="content">
			    
		</view>
		<view class="img">
			<image class="desc-img" :src="img" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				title:'',
				time:'',
				content:'',
				img:'',
				id:''
			};
		},

		onLoad(options) {
			this.id = options.id
			//根据id获取详情
			//获取快讯列表
			uni.request({
				url: this.baseUrl + "/news-detail",
				data:{
					Id:this.id
				},
				header:{
					Authorization:uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (this.$base1._indexOf(res.data.status)) {
						this.$base1._isLogin()
					} else if(res.data.status==1){
						this.title = res.data.data.Title
						this.img = res.data.data.myImgs
						this.content = res.data.data.Content
						this.time = this.$base1._formatDate(res.data.data.AddTime)
					}else{
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
					
				}
			})
		},
		onPullDownRefresh() {

		},
		methods: {
		
			
		}
	}
</script>

<style scoped lang="scss">
	.content{
		background-color: #fff;
		height: 1334rpx;
		padding: 0 32rpx;
		.title{
			font-size: 36rpx;
			padding: 32rpx 0;
		}
		.desc{
			margin: 40rpx 0;
			font-size: 26rpx;
			
		}
		.desc-img{
			height: 478rpx;
			width: 100%;
		}
	}
</style>
