<template>
	<view class="content">
		

		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
		</view>

		<view class="box">
			<view class="">
				<image class="logo-img" src="../../../static/images/pagesA/login/logo.png" mode="widthFix"></image>
			</view>
			<view class="name">
				Aggregate ecology 期待您的加入
			</view>
		
			<view class="">
				<image class="qrcode-img" :src="img" mode="widthFix"></image>
			</view>
			<view class="qr-tip font-bold">
				扫描二维码下载APP
			</view>
			<view class="flex-row font-bold adress-box">
				<text class="adress text-overflow">下载链接：https://lanhuapplanhuapplanhuapplanhuapplanhuapp.com/web</text>
				<image class="copy-img" src="../../../static/images/pagesA/personal/copy.png" mode=""></image>
			</view>
			<view class="code-num">
				邀请码:{{inviteCode}}1234567489
			</view>			
		</view>
		<view class="">
			<button class="blue btn" type="primary" :disabled="disabled" @tap="saveImg">保存至相册</button>
		</view>

	</view>
</template>

<script>
	import QR from "@/common/wxqrcode.js" // 二维码生成器
	export default {
		
		data() {
			return {
				img: '',
				inviteCode: '',
				disabled: false
			};
		},
		onLoad() {
			if(!uni.getStorageSync("token")&&!uni.getStorageSync("SecretKey")){
				this.$base._isLogin()
			}
			this.img = QR.createQrCodeImg('www.265.im/core', {
				size: parseInt(300) //二维码大小  
			})
			//用户资料
			// uni.request({
			// 	url: this.baseUrl + "/member-info",
			// 	header: {
			// 		//除注册登录外其他的请求都携带用户token和秘钥
			// 		Authorization: uni.getStorageSync('token'),
			// 		SecretKey: uni.getStorageSync('SecretKey')
			// 	},
			// 	success: (res) => {
			// 		// console.log(res.data)
			// 		if (this.$base._indexOf(res.data.status)) {
			// 			this.$base._isLogin()
			// 		} else if (res.data.status == 1) {
			// 			this.inviteCode = res.data.data.InviteCode

			// 		} else {
			// 			uni.showToast({
			// 				title: res.data.message,
			// 				icon: "none"
			// 			})
			// 		}
			// 	}
			// })
		},
		methods: {
			// saveImg() {
			// 	//截屏绘制图片
			// 	let self = this;
			// 	this.disabled = true;
			// 	var pages = getCurrentPages();
			// 	var page = pages[pages.length - 1];
			// 	var bitmap = null;
			// 	var currentWebview = page.$getAppWebview();
			// 	bitmap = new plus.nativeObj.Bitmap('amway_img');
			// 	// 将webview内容绘制到Bitmap对象中  
			// 	currentWebview.draw(bitmap, function() {
			// 		console.log('截屏绘制图片成功');
			// 		bitmap.save("_doc/a.jpg", {}, function(i) {
			// 			console.log('保存图片成功：' + JSON.stringify(i));
			// 			uni.saveImageToPhotosAlbum({
			// 				filePath: i.target,
			// 				success: function() {
			// 					bitmap.clear(); //销毁Bitmap图片  
			// 					uni.showToast({
			// 						title: '保存图片成功',
			// 						mask: false,
			// 						duration: 1500
			// 					});
			// 				}
			// 			});
			// 			self.disabled = false;
			// 		}, function(e) {
			// 			console.log('保存图片失败：' + JSON.stringify(e));
			// 			self.disabled = false;
			// 		});
			// 	}, function(e) {
			// 		console.log('截屏绘制图片失败：' + JSON.stringify(e));
			// 		self.disabled = false;
			// 	});
			// }
		}
	}
</script>

<style lang="scss">
	.content {

		font-size: 30rpx;
		color: #333;
		text-align: center;
		background-color: #F7F7F7;
		height: 1334rpx;
		.copy-img{
			width: 30rpx;
			height: 30rpx;
		}
		.btn{
			background: linear-gradient(#7FCCFF,#6AB6F6,#0099FF);
			border-radius: 50%;
			width: 280rpx;
			height: 90rpx;
			}
		.box {
			width: 700rpx;
			height: 900rpx;
			
			margin: 32rpx 26rpx 48rpx 26rpx;
			text-align: center;

			.logo-img {
				width: 120rpx;
				height: 120rpx;
				margin-top: 38rpx;
			}

			.name {
				font-size: 36rpx;
				font-weight: bold;
				margin-top: 48rpx;
			}

			.transfer-accounts {
				font-size: 26rpx;
				color: #999;
				margin-top: 34rpx;
			}

			.code-num {
				font-size: 40rpx;
				color: #333;
				font-weight: bold;
				margin-top: 42rpx;
				
			}

			.qrcode-img {
				height: 220rpx;
				width: 220rpx;
				margin: 88rpx 0 22rpx;
			}

			.qr-tip {
				font-size: 20rpx;
				background-color: #E5F5FF;
				height: 44rpx;
				line-height: 44rpx;
				text-align: center;
				width: 220rpx;
				border-radius: 22rpx;
				margin: 0 auto 40rpx;
			}
			.adress-box{
				margin-left: 140rpx;
				.adress{
					width: 376rpx;
					font-size: 20rpx;
					
				}
			}
			
			.link-arr {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				height: 100rpx;
				width: 550rpx;
				background-color: #F7F7F7;
				border-radius: 50rpx;
				margin: 32rpx auto;

				.input-text {
					font-size: 26rpx;
					width: 100%;
				}
			}


		}

		.btn {
			width: 400rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 44rpx;
			border: none;
			background-color: #4C70FF;
			color: #fff;
			font-size: 32rpx;
			margin-top: 52rpx;
		}


	}
</style>
