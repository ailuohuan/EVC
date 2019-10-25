<template>
	<view class="content">
		<view class="flex-between margin-top">
			<view class="">
				<view class="text-center margin-top">
					请上传身份证正面
				</view>
				<view class="photo-box margin-top" @tap="uploadphoto1">
					<image class="photo-in" :src="photo1" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="text-center margin-top">
					请上传身份证背面
				</view>
				<view class="photo-box margin-top" @tap="uploadphoto2">
					<image class="photo-in" :src="photo2" mode=""></image>
				</view>
			</view>
		</view>
		<view class="font-blue margin-top tip-text ">
			注意事项：请上传手持身份证的正反面图片
		</view>

		<view class="">
			<view class="flex-between ">
				<view class="photo-box2 margin-top">
					<image class="photo-in2 photo-in4" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>
				
				<view class="photo-box2 margin-top">
					<image class=" photo-in2 photo-in5" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>

				<view class="photo-box2 margin-top">
					<image class=" photo-in2 photo-in6" src="../../../static/images/pagesA/my/id-car3.png" mode=""></image>
				</view>

				<view class="photo-box2 margin-top">
					<image class=" photo-in2 photo-in7" src="../../../static/images/pagesA/my/id-car1.png" mode=""></image>
				</view>
			</view>
			<view class=" tip-text2 flex-between text-center">
				<view class="photo-tip">
					标准
				</view>
				<view class="photo-tip photo-tip1">
					边框缺失
				</view>
				<view class="photo-tip photo-tip2">
					照片模糊
				</view>
				<view class="photo-tip photo-tip3">
					闪光强烈
				</view>
			</view>
			<view class="bottom-btn">
				<button class="blue margin-top" hover-class="none"  @click="comfirme">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import qiniuUploader from '../../../common/qiniuUploader.js'
	import uniSteps from '@/components/uni-steps.vue'
	var photoArray = []
	export default {
        
		components: {

			uniSteps
		},
		data() {
			return {
			
				opcity: 0.5,
				photo1:'../../../static/images/pagesA/my/id-car1.png',
				photo2:'../../../static/images/pagesA/my/id-car2.png',
				name:'',
				carnum:'',
				token: '',
				photoArray: []
				
			}
		},
		onLoad(options) {
			this.name = options.name

		},
		onReady() {

		},
		methods: {
			//上传照片正面
			uploadphoto1(){
				//获取七牛上传token
				uni.request({
					url: this.baseUrl + "/qiniu-upload",
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 1) {
							//获取七牛返回的token
							this.token = res.data.data.token;
							console.log(this.token)
							//选择头像图片获取临时地址
							let _self = this
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album', 'camera'], //从相册选择，或打开照相机
								success: function(res) {
									console.log('res1', res);
									
									//图片临时地址
									qiniuUploader.upload(res.tempFilePaths[0], (success) => {
										console.log('===========' + success.imageURL);
										_self.photoArray.push(success.imageURL)
										 _self.photo1 = 'http://ceshi.8kpay.com/'+success.imageURL
										
									}, (error) => {
										console.log(error);
									}, {
										region: 'SCN',
										key: new Date().getTime().toString(),
										uptoken: _self.token
									}, (res) => {
										console.log('上传进度', res.progress);
									})
									
								},
								error: (e) => {
									console.log(e);
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			//上传照片反面
			uploadphoto2(){
				//获取七牛上传token
				uni.request({
					url: this.baseUrl + "/qiniu-upload",
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 1) {
							//获取七牛返回的token
							this.token = res.data.data.token
							console.log(this.token)
							//选择头像图片获取临时地址
							let _self = this
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album', 'camera'], //从相册选择，或打开照相机
								success: function(res) {
									console.log('res1', res);
									
									//图片临时地址
									qiniuUploader.upload(res.tempFilePaths[0], (success) => {
									console.log('===========' + success.imageURL);
									_self.photoArray.push(success.imageURL)
									 _self.photo2 = 'http://ceshi.8kpay.com/'+success.imageURL
									
										
									}, (error) => {
										console.log(error);
									}, {
										region: 'SCN',
										key: new Date().getTime().toString(),
										uptoken: _self.token
									}, (res) => {
										console.log('上传进度', res.progress);
									})
									
									
								},
								error: (e) => {
									console.log(e);
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})
			},
			
			comfirme() {
				var _self = this		
				uni.request({
					url: this.baseUrl + "/auth-member",
					method:'POST',
					header: {
						//除注册登录外其他的请求都携带用户token和秘钥
						Authorization: uni.getStorageSync('token')
					},
					data:{
						IdCard:uni.getStorageSync('indentifyCardNum'),
						Name:_self.name,
						// IdCardImg:JSON.stringify(photoArray1),
						IdCardImg:JSON.stringify(_self.photoArray)
					},
					success: (res) => {
						console.log(res.data)
						if (this.$base1._indexOf(res.data.status)) {
							this.$base1._isLogin()
						} else if (res.data.status == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
							uni.navigateTo({
								url:'./examine'
							})
							
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					}
				})

			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		background-color: #fff;
		padding: 0 32rpx;
		color: #333;
		height: 1624rpx;

		.photo-box {
			height: 252rpx;
			width: 328rpx;
			background-color: rgba(229, 245, 255, 1);
			border-radius: 10rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.photo-in {
				width: 200rpx;
				height: 128rpx;
			}
		}

		.photo-box2 {
			height: 110rpx;
			width: 150rpx;
			background-color: rgba(229, 245, 255, 1);
			border-radius: 10rpx;
		
			position: relative;
			.photo-in2 {
				position: absolute;
				top: 24rpx;
				width: 100rpx;
				height: 62rpx;
			}
			.photo-in4{
				left: 26rpx;
			}
			.photo-in5{
				left: 66rpx;
			}
			.photo-in6{
				left: 20rpx;
			}
			.photo-in7{
				left: 26rpx;
			}
		}
	}

	button.blue {
		margin-bottom: 20rpx;
		margin-top: 80rpx;
		
	}
	.bottom-btn{
		margin-top: 150rpx;
	}
	.tip-text{
		margin-top: 80rpx;
	}
	.photo-tip{
		width: 150rpx;
		text-align: center;
	}

	.tip-text2{
		margin-top: 20rpx;
	}
	
</style>
