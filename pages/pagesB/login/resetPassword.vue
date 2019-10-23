<template>
	<view class="content">
		
		<view class="input-wrap">
			<view>
				<input class="input-left" type="password" placeholder="请输入8-20位字母数字组成的密码" placeholder-class="input-placeholder" v-model="password" @input="change">
			</view>
			<view>
				<input class="input-left" type="password"  placeholder="请再次输入密码" placeholder-class="input-placeholder" v-model="surepassword">
				
			</view>
		</view>
		<view>
			<button class="blue" hover-class="none" :style="{opacity:opcity}" @click="comfirme">下一步</button>
		</view>

	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				emailNum:'',
				autocode:'',
				opcity:0.5,
				password:'',
				surepassword:''
			}
		},
		onLoad(options) {
			this.emailNum = options.emailNum
			this.autocode = options.authcode
		},
		onReady() {
			
		},
		methods: {
			comfirme() {
				if(this.password!=this.surepassword){
					uni.showToast({
						title:"两次密码不一致",
						icon:"none"	
					})
				}else{
					uni.request({
						url: this.baseUrl + "/member-forget-password",
						data:{
							Email: this.emailNum,
							AuthCode:this.autocode,
							NewPassword:this.password,
							RepeatPassword:this.surepassword
						},
						method:"POST",
						// header: {
						// 	//除注册登录外其他的请求都携带用户token和秘钥
						// 	Authorization: uni.getStorageSync('token')
						// },
						success: (res) => {
							console.log(res.data)
							 if (res.data.status == 1) {
								uni.showToast({
									title:res.data.message
								})
								uni.navigateTo({
									url:"./login"
								})
							} else {
								uni.showToast({
									title: res.data.message,
									icon: "none"
								})
							}
						}
					})
				}
				
			},
			change(e){
				console.log(e.detail.value.length)
				if (e.detail.value.length >= 8) {
					this.opcity = 1
				}else{
					this.opcity = 0.5
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content {
		
		padding: 0 56rpx;
		font-size: 24rpx;
		color: #999999;
		
		.logo {
			width: 86px;
			height: 86rpx;
			margin: 60rpx auto 50rpx;
		}

		.logo-img {
			width: 160rpx;
			height: 160rpx;
		}
		.forget-password{
			margin-left: 500rpx;
		}
		.bottom{
			margin-top: 280rpx;
			text-align: center;
		}
		.get-indentify {
			height: 70rpx;
			line-height: 70rpx;
			width: 180rpx;
			padding: 0;
			border: none;
			color: #007AFF;
		}
		
	}



	.input-wrap {
		margin-top: 120rpx;
	}

	.input-wrap>view {
		border-bottom: 1px solid #ECECEC;
		padding: 20rpx 0;
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;
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
