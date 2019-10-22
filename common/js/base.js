module.exports = {
	_cacheWallet: "evc_wallet",//钱包的缓存名字
	_cacheCoin: "evc_coin",//币种缓存名称
	_des3pwd: "ioqXdfdHfbSZaLeBQhLgxBNG",//des3加密秘钥
	_platCoin(){ //平台币
		return '';
	},
	_prePage(){ //获取上一个页面
		let pages = getCurrentPages();
		let prePage = pages[pages.length - 2];
		return prePage;
	},
	_toast(msg){//自动消失的提示窗
		uni.showToast({
			icon: 'none',
			title: msg,
			duration: 2000
		});
	},
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
	_addressMethod(address){ //钱包地址中间用……代替
		let frontLen = 10 , endLen = 10;
		let len = address.length - frontLen - endLen;
		let temp = '......';
		return address.substring(0,frontLen) + temp +address.substring(address.length-endLen);
	},
	_phoneMethod(cellValue){ //电话号码中间用*代替
		if (Number(cellValue) && String(cellValue).length === 11) {
	        var mobile = String(cellValue);
	        var reg = /^(\d{3})\d{4}(\d{4})$/;
	        return mobile.replace(reg, '$1****$2');
	    } else {
	        return cellValue;
	    }
	},
	_checkPwd(pwd) { //验证密码，必须8-20字母数字组成
		if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(pwd))) {
			return false;
		} else {
			return true;
		}
	},
	_networkMethod(){ //网络监听
		uni.getNetworkType({
			success(res) {
				console.log(res.networkType);
				if(res.networkType == 'none'){
					uni.showModal({
						title: "提示",
						content: "您当前处于无网络状态，请链接网络后操作",
						showCancel: false,
						confirmText: "确定"
					})
				}
			}
		});
		uni.onNetworkStatusChange(function (res) {
			console.log(res.isConnected);
			console.log(res.networkType);
			if(!res.isConnected){
				uni.showModal({
					title: "提示",
					content: "您当前处于无网络状态，请链接网络后操作",
					showCancel: false,
					confirmText: "确定"
				})
			}
		});
	},
	_accMul(arg1, arg2) { //乘法
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch(e) {}
		try {
			m += s2.split(".")[1].length
		} catch(e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},
	_accDiv(arg1, arg2) { //除法
		var t1=0,t2=0,r1,r2; 
		try{t1=arg1.toString().split(".")[1].length}catch(e){} 
		try{t2=arg2.toString().split(".")[1].length}catch(e){} 
		r1 = Number(arg1.toString().replace(".","")); 
		r2 = Number(arg2.toString().replace(".","")); 
		return (r1/r2) * Math.pow(10,t2-t1); 
	},
	_datediff(date){ // 时间减去8小时
		date = date.substring(0,19);    
		date = date.replace(/-/g,'/'); 
		var timestamp = new Date(date).getTime() - 8 * 60 * 60 * 1000;
		return this._formatDate(timestamp / 1000);
	},
	_checkLoginStatus(status){ //检查登录状态
		if(status == 1004 || status == 1003 || status == 1002 || status == 1001 || status == 2001 || status == 20002 || status == 20003 || status == 20004){
			uni.clearStorageSync();
			plus.nativeUI.toast("您的登录已过期，请重新登录", {
				verticalAlign: 'center'
			});
			uni.reLaunch({
				url: '/pages/account/login',
			});
		}
	}
}
