<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			plus.screen.lockOrientation('portrait-primary'); //锁定
			this.app._networkMethod();
			let self = this;
			uni.request({
				url: self.baseUrl + '/coin-list',
				method: 'GET',
				success: res => {
					console.log(res.data);
					if(res.data.status == 1){
						uni.setStorageSync(self.app._cacheCoin,res.data.data);
					}
				},
				fail: () => {},
				complete: () => {}
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/css/iconfont.css";
	@import "./common/css/base.css";
	
</style>
