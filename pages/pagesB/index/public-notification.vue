<template>
	<view class="content">
		<view class="bgbox">
			
		</view>
		<view class="flex-between list-item padding" @tap="jumpToNoticeDetail(index)" v-for="(item,index) in noticeList" :key="item.id">
			
			<view class="item-left text-overflow">
				<view class="title">
					{{item.Title}}
				</view>
				<view class="text-overflow font-gray time">
					
				</view>
			</view>
			<view class="time font-gray">
				{{ $base1._formatDate(item.AddTime) }}
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				noticeList:[]
				
			};
		},

		onLoad(options) {
			//获取公告
			uni.request({
				url: this.baseUrl + "/notice-list",
				data: {
					page: 1,
					count: 10000
				},
				header: {
					Authorization: uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res)
					if (res.data.status == 1) {
						this.noticeList = res.data.data
					} else {
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
			jumpToNoticeDetail(index){
				var noticeid = this.noticeList[index].Id
				uni.navigateTo({
					url: "./noticeDetail?id="+noticeid
				})
			}
			
		}
	}
</script>

<style scoped lang="scss">
	.content{
		background-color: #fff;
		height: 1334rpx;
		
		.item-left{
			width: 434rpx;
		
		}
		.title{
			font-size: 28rpx;
		}
		.list-item{
			height: 140rpx;
		}
		.time{
			font-size: 22rpx;
		}
	}
</style>
