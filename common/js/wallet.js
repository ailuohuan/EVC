import Vue from 'vue'
import base from './base.js'
import DES3 from "./DES3.js";
import eth from "./eth.js";
const wallet = {
	ecodeDes3JSON(data){ // des3加密json
		console.log('原没加密的json: ' + JSON.stringify(data));
		let list = {};
		for(let key in data) {
			let val = null;
			if(typeof data[key] == 'object' || typeof data[key] == 'number') {
				val = JSON.stringify(data[key]);
			} else {
				val = data[key];
			}
			list[DES3.encrypt(base._des3pwd, key)] = DES3.encrypt(base._des3pwd, val);
		}
		console.log('加密后的json: ' + JSON.stringify(list));
		return list;
	},
	decodeDes3JSON(data){// des3解密json
		let list = {};
		for(let key in data) {
			let val = null;
			if(typeof data[key] == 'object' || typeof data[key] == 'number') {
				val = JSON.stringify(data[key]);
			} else {
				val = data[key];
			}
			list[DES3.decrypt(base._des3pwd, key)] = DES3.decrypt(base._des3pwd, val);
		}
		return list;
	},
	create(pin,callback){//创建钱包
		let data = eth.create();
		if(data.status == 1){
			this.walletSuccess(pin,data);
			callback();
		}else{
			base._toast('钱包创建失败，请稍后再试');
		}
	},
	getCurrentWallet(){//获取当前正在使用钱包解密后的信息
		let walletList = this.getWalletList();
		return walletList.filter(item => {
			return item.isDefault == 1;
		})[0];
	},
	getWalletList(){//获取解密后所有钱包信息
		let temp = uni.getStorageSync(base._cacheWallet);
		let walletList = [];
		for(let index in temp){
			walletList.push(this.decodeDes3JSON(temp[index]));
		}
		return walletList;
	},
	importByPrivateKey(privateKey,pin,callback){//通过私钥导入钱包
		let wallet = eth.importByPrivateKey(privateKey);
		let currentWallet = this.getCurrentWallet() || [];
		console.log(JSON.stringify(currentWallet));
		if(wallet.status == 2){
			base._toast('私钥输入错误，请检查');
		}else if(currentWallet.address === wallet.address){
			base._toast('钱包已经存在，不需再次导入');
		}else if(wallet.status == 1){
			this.walletSuccess(pin,wallet);
			callback();
		}
	},
	importByMnemonic(mnemonic,pin,callback){//通过助记词导入钱包
		let wallet = eth.importByMnemonic(mnemonic.replace(/,/g," "));
		let currentWallet = this.getCurrentWallet() || [];
		console.log(JSON.stringify(wallet));
		if(wallet.status == 3){
			base._toast('助记词输入错误，请检查');
		}else if(currentWallet.address === wallet.address){
			base._toast('钱包已经存在，不需再次导入');
		}else if(wallet.status == 1){
			this.walletSuccess(pin,wallet);
			callback();
		}
	},
	walletSuccess(pin,data){
		let walletArray = this.getWalletList() , ecodeWalletList = [];
		walletArray.forEach(item => {
			item.isDefault = 0;
		});
		for(let i in walletArray){
			ecodeWalletList.push(this.ecodeDes3JSON(walletArray[i]));
		}
		let temp = this.ecodeDes3JSON({
			privateKey: data.privateKey,
			mnemonic: data.mnemonic,
			address: data.address,
			pin: pin,
			isDefault: 1 //1：当前正在使用的钱包
		});
		ecodeWalletList.push(temp);
		uni.setStorageSync(base._cacheWallet,ecodeWalletList);//缓存多个钱包
	},
	getBalance(address,ctaddress,length,callback){//获取余额
		if(ctaddress.length > 10){ //获取合约币余额
			eth.getBalance({
				address: address,
				contactAddress: ctaddress,
				length: length,
				success(balance){
					console.log(JSON.stringify(balance));
					callback(balance);
				},
				error(err){
					console.log(err);
				}
			});
		}else{//获取ETH余额
			eth.getBalance({
				address: address,
				contactAddress: '',
				contactAbi: [],
				length: 18,
				success(balance){
					console.log(JSON.stringify(balance));
					callback(balance);
				}
			});
		}	
	},
	trasfer(data,suc,err){//转账
		eth.transfer({
			privateKey: data.privateKey,
			to: data.toaddress,
			money: data.money,
			gas: data.gasNum,
			gasPrice: data.gasPrice,
			contactAddress: data.contractAddress,
			length: data.contractLength,
			success(hash){
				console.log(hash);
				if(hash){
					suc();
				}
				uni.hideLoading();
			},
			error(status,msg){
				console.log(msg);
				uni.hideLoading();
				base._toast(msg);
				err();
			}
		})
	},
	getCNY(name){ // 获取币种人民币价格
		if(!name) return 0;
		let cnyPrice = this.getUsdtPrice();
		if(name.toUpperCase() == "USDT") {
			return cnyPrice;
		}
		let namePrice = getUsdt(name);
		if(cnyPrice == 0 || namePrice == 0) {
			return 0;
		}
		let price = cnyPrice * namePrice;
		return Ceil(price,2);
	},
	getUsdtPrice() {
		var list = uni.getStorageSync(base._cacheCoin) || [];
		if(list.length > 0) {
			let coin = list.filter(function(a) {
				return a.Name.toUpperCase() == "USDT";
			});
			if(coin.length > 0) {
				return coin[0].Price;
			}
		}
		return 6.91;
	},
	getUsdt(name) {
		if(name == "USDT") return 1;
		var list = uni.getStorageSync(base._cacheCoin) || [];
		if(list.length > 0) {
			let coin = list.filter(function(a) {
				return a.Name == name;
			});
			if(coin.length > 0) {
				return coin[0].Price;
			}
		}
		return 0;
	}
};
Vue.prototype.$Wallet = wallet;