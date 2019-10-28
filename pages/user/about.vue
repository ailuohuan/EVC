<template>
	<page-loading v-if="!pageLoad"></page-loading>
	<view v-else class="content">
		<rich-text :nodes="content"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageLoad: false,
				type: 1,//1：用户协议，2：关于我们
				content: ''
			}
		},
		onLoad(opt) {
			this.getData();
			this.type = opt.type;
			if(this.type == 1){
				uni.setNavigationBarTitle({
					title: '用户协议'
				});
			}else{
				uni.setNavigationBarTitle({
					title: '关于我们'
				});
			}
		},
		methods: {
			getData(){
				let self = this;
				uni.request({
					url: self.baseUrl + '/member-doc',
					method: 'GET',
					data: {},
					success: res => {
						if(res.data.status == 1){
							let richtext = '';
							if(self.type == 1){
								richtext = res.data.data.MemberDoc;
							}else{
								richtext = res.data.data.AboutUs;
							}
							const regex = new RegExp('<img', 'gi');
							richtext = richtext.replace(regex, `<img style="max-width: 100%;"`);
							self.content = richtext;
						}
						self.pageLoad = true;
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	page{background-color: #FFFFFF;}
	.content{padding: 30upx;text-indent: 2em;}
</style>
