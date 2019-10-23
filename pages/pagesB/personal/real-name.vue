<template>
	<view class="content">
		<!-- <uni-steps class="steps1" :options="list1" :active="active" :activeColor="activeColor" /> -->
		
		<view class="input-wrap">
			<view>
				<view class=" font-middle margin-top">
					姓名
				</view>
				<input class="input-num margin-top" placeholder="请输入真实姓名" placeholder-class="input-placeholder" v-model="realname" @input="change">
			</view>
			<view>
				<view class="font-middle margin-top">
					身份证号
				</view>
				
				<input class="input-num margin-top"  placeholder="请输入身份证号" placeholder-class="input-placeholder" v-model="indentifyCardNum">
			</view>
			

		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="comfirme">下一步</button>
		
		</view>

	</view>
</template>

<script>
	import uniSteps from '@/components/uni-steps.vue'
	export default {
		components: {
			
			uniSteps
		},
		data() {
			return {
				// activeColor: "#4C70FF",
				// list1: [{
				// 	title: '',desc:'请填写身份信息'
				// }, {
				// 	title: '',desc:'请上传身份证反面'
				// }],
				// active: 3,
				realname: '',
				indentifyCardNum: '',
				opcity: 0.5
			}
		},
		onLoad() {

		},
		onReady() {

		},
		methods: {
			comfirme() {
				//输入姓名身份证号
				uni.navigateTo({
					url:"./real-photo?name="+this.realname+"&cardnum="+this.indentifyCardNum
				})
			},
			change(e) {
				console.log(e.detail.value.length)
				if (e.detail.value.length >=1) {
					this.opcity = 1
				} else {
					this.opcity = 0.5
				}
			}
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

		.logo {
			width: 86px;
			height: 86rpx;
			margin: 60rpx auto 50rpx;
		}

		.logo-img {
			width: 160rpx;
			height: 160rpx;
		}

		.forget-password {
			margin-left: 500rpx;
		}
	}


	.input-wrap>view {
		
		padding: 20rpx 0;
		margin-bottom: 40rpx;
	}

	.input-num{
		background-color: rgba(229, 245, 255, 1);
		height: 100rpx;
		font-size: 24rpx;
		border-radius: 10rpx;
		padding-left: 20rpx;
	}
	.input-wrap input {
		flex: 1;
	}

	button.blue {
		margin-bottom: 20rpx;
		margin-top: 80rpx;
		opacity: 0.5;
	}

	.footer {
		position: fixed;
		width: 100%;
		text-align: center;
		bottom: 60rpx;
	}
</style>
