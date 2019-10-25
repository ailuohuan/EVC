<template>
	<view class="content">
		<view class="font-blue font-big" :style="{color:showColor(authState)}">
			{{showStatus(authState)}}
		</view>
		<view class="font-gray">
			{{showStatusDesc(authState)}} 
		</view>
		<view class="margin-top padding-top">
			姓名：{{authName}}
		</view>
		<view class="margin-top">
			身份证号码：{{idCard}}
		</view>
		<view class="margin-top padding-top " v-show="authState==3">
			<button class="blue" type="" @tap="jumpToRealName">修改信息</button>
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
				realname: '',
				indentifyCardNum: '',
				opcity: 0.5,
				authState:'',
				idCard:'',
				authName:''
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
						this.authName = res.data.data.AuthName
						this.idCard =res.data.data.IdCard
						this.authState = res.data.data.AuthState
						
						
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
			showStatus(authState){
				if(authState==1){
					return "待审核"
				}else if(authState==2){
					return "已通过"
				}else if(authState==3){
					return "未通过"
				}
			},
			
			showStatusDesc(authState){
				if(authState==1){
					return "实名认证申请已提交，等待审核"
				}else if(authState==2){
					return "通过系统认证的实名用户，无需再次认证"
				}else if(authState==3){
					return "认证失败"
				}
			},
			showColor(authState){
				if(authState==3){
					return 'red'
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

		
	}


	
</style>
