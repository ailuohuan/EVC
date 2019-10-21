export default {
	/**
	 * 时间戳格式化
	 * @param {String} 内容
	 */
	_formatDate(inputTime) {
		var date = new Date(parseInt(inputTime * 1000));
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	},
	/**
	 * 小数截取
	 */
	_toFixed(str1, num) {
		var str = String(str1);

		function hanZeo(z) {
			var zeo = '';
			for (var i = 0; i < z; i++) {
				zeo += '0';
			}
			return zeo;
		}
		var arr = str.split('.');
		if (arr[1]) {
			if (arr[1].length >= num) {
				return arr[0] + '.' + arr[1].slice(0, num);
			} else {
				return arr[0] + '.' + arr[1] + hanZeo(num - arr[1].length);
			}
		} else {
			return str + '.' + hanZeo(num);
		}
	},
		/**
		 * 检查登录状态
		 * @param {String} 内容
		 */
		_isLogin(status){
			if(!status){
				uni.showModal({
					content: "您还未登录，请先登录",
					showCancel: false,
					confirmText: "确定",
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:"/pages/pagesB/login/login"
							})
						}
					}
				});
				return;
			};
		},
		// 判断返回值以2开头为未登录跳转到登录信息
		_indexOf(status){
			var reg = new RegExp(/^2\d/)
			return reg.test(status)
		},
		//返回值为空，不存在，null，undefine时显示为0
		_showZero(number){
			if(number=="null"||number==""||number==0||number==null||number==undefined||number=="undefined"){
				return "0"
			}else{
				return number
			}
		}
};
