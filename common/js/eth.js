const ethers = require('@/common/js/ethers.min.js');
const shims = require('@/common/js/shims.js');
let _defautAbi = [{
	"constant": true,
	"inputs": [],
	"name": "name",
	"outputs": [{
		"name": "",
		"type": "string"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [],
	"name": "stop",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "_spender",
		"type": "address"
	}, {
		"name": "_value",
		"type": "uint256"
	}],
	"name": "approve",
	"outputs": [{
		"name": "success",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "totalSupply",
	"outputs": [{
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "_from",
		"type": "address"
	}, {
		"name": "_to",
		"type": "address"
	}, {
		"name": "_value",
		"type": "uint256"
	}],
	"name": "transferFrom",
	"outputs": [{
		"name": "success",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "decimals",
	"outputs": [{
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "_value",
		"type": "uint256"
	}],
	"name": "burn",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"name": "",
		"type": "address"
	}],
	"name": "balanceOf",
	"outputs": [{
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "stopped",
	"outputs": [{
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "symbol",
	"outputs": [{
		"name": "",
		"type": "string"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "_to",
		"type": "address"
	}, {
		"name": "_value",
		"type": "uint256"
	}],
	"name": "transfer",
	"outputs": [{
		"name": "success",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [],
	"name": "start",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "_name",
		"type": "string"
	}],
	"name": "setName",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"name": "",
		"type": "address"
	}, {
		"name": "",
		"type": "address"
	}],
	"name": "allowance",
	"outputs": [{
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"name": "_addressFounder",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"name": "_from",
		"type": "address"
	}, {
		"indexed": true,
		"name": "_to",
		"type": "address"
	}, {
		"indexed": false,
		"name": "_value",
		"type": "uint256"
	}],
	"name": "Transfer",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"name": "_owner",
		"type": "address"
	}, {
		"indexed": true,
		"name": "_spender",
		"type": "address"
	}, {
		"indexed": false,
		"name": "_value",
		"type": "uint256"
	}],
	"name": "Approval",
	"type": "event"
}];
let ResultStatus = {
	Error: 0, //错误
	Success: 1,
	PrivateKeyError: 2, //私钥错误
	MnemonicError: 3, //助记词错误
	NotEnougth: 4, //余额不足
	NotEnougthFee: 5, //Eth手续费不足
	AddressError: 6, //地址无效
	ContactAddressError: 7, //合约地址无效
	LengthError: 8, //长度错误，3-18
};
let __wallet = {};
let _success = function() {}
let _error = function() {}
/**
 * 生成一个新地址，返回私钥，助记词及地址
 */
__wallet.create = function() {
	try {	
		var wallet = ethers.Wallet.createRandom();
		var mnemonic = wallet.mnemonic;
		var path = wallet.path;
		var privateKey = wallet.privateKey;
		var address = wallet.address;
		return {
			status: ResultStatus.Success,
			msg: "success",
			privateKey: privateKey,
			mnemonic: mnemonic,
			address: address
		};
	} catch(e) {
		return {
			status: ResultStatus.Error,
			msg: e.message,
			privateKey: '',
			mnemonic: '',
			address: ''
		};
	}
}

/**
 * 根据私钥获取地址信息
 * @param {String} 私钥
 */
__wallet.importByPrivateKey = function(privateKey) {
	try {
		var wallet = new ethers.Wallet(privateKey);
		var privateKey = wallet.privateKey;
		var address = wallet.address;
		return {
			status: ResultStatus.Success,
			msg: "success",
			privateKey: privateKey,
			mnemonic: '',
			address: address
		};
	} catch(e) {
		return {
			status: ResultStatus.PrivateKeyError,
			msg: e.message,
			privateKey: '',
			mnemonic: '',
			address: ''
		}
	}
}

/**
 * 根据助记词获取地址信息
 * @param {String} 助记词
 */
__wallet.importByMnemonic = function(mnemonic) {
	try {
		var wallet = ethers.Wallet.fromMnemonic(mnemonic);
		var path = wallet.path;
		var privateKey = wallet.privateKey;
		var address = wallet.address;
		return {
			status: ResultStatus.Success,
			msg: "success",
			privateKey: privateKey,
			mnemonic: mnemonic,
			address: address
		};
	} catch(e) {

		return {
			status: ResultStatus.MnemonicError,
			msg: e.message,
			privateKey: '',
			mnemonic: '',
			address: ''
		}
	}
}

/**
 * 获取地址余额
 * @param {String} Eth地址
 * @param {JSON} 合约信息
 * @param {Function} 成功回调
 * @param {Function} 失败回调
 */
__wallet.getContactBalance = function(data) {
	if(data.contactAddress == "" || data.contactAddress.length != 42) {
		data.error(ResultStatus.ContactAddressError, "合约地址非法");
	}

	if(data.length < 3 || data.length > 18) {
		data.error(LengthError.LengthError, "请输入正确的合约币长度");
	}
	var provider = new ethers.providers.JsonRpcProvider("https://web3.token.im");
	//var provider = ethers.getDefaultProvider('ropsten');
	
	var contract = new ethers.Contract(data.contactAddress, data.contactAbi, provider);
	var balance = contract.balanceOf(data.address);
	balance.then(function(_balance) {
		_balance = ethers.utils.formatUnits(_balance, data.length);
		data.success(_balance);
	},function(error){
		console.log(error);
	});
}

/**
 * 获取地址余额
 * @param {String} Eth地址
 * @param {JSON} 合约信息，Eth直接用{},{address:'',abi:[],length:18}
 * @param {Function} 成功回调
 * @param {Function} 失败回调
 */
__wallet.getBalance = function(data) {
	data.address = data.address || "";
	data.success = data.success || _success;
	data.error = data.error || _error;
	data.contactAddress = data.contactAddress || "";
	data.contactAbi = data.contactAbi || _defautAbi;
	data.length = data.length || 18;
	if(data.contactAddress.length != 42 && data.contactAddress.length != 0) {
		data.error(ResultStatus.ContactAddressError, '请输入正确的合约地址');
		return;
	}
	var provider = new ethers.providers.JsonRpcProvider("https://web3.token.im");
	//var provider = ethers.getDefaultProvider('ropsten');
	var self = this;
	provider.getBalance(data.address).then(function(balance) {
		if(data.contactAddress == 'eth' || data.contactAddress == '') {
			balance = ethers.utils.formatEther(balance);
			data.success(balance);
		} else {
			self.getContactBalance(data);
		}
	},function(error){
		console.log(error);
	});
}

__wallet.transferEth = function(data, wallet) {

	var provider = ethers.getDefaultProvider()

	var balancePromise = provider.getBalance(wallet.address);
	var gasPricePromise = provider.getGasPrice();
	var transactionCountPromise = provider.getTransactionCount(wallet.address);

	var allPromises = Promise.all([
		gasPricePromise,
		balancePromise,
		transactionCountPromise
	]);

	var gasPriceWei = ethers.utils.parseUnits(data.gasPrice.toString(), 9);

	var fee = ethers.utils.formatEther(gasPriceWei.mul(data.gas));
	var sendPromise = allPromises.then(function(results) {
		var gasPrice = results[0];
		var balance = ethers.utils.formatEther(results[1]);
		var transactionCount = results[2];
		if(parseFloat(balance) < (parseFloat(fee) + parseFloat(data.money))) {
			data.error(ResultStatus.NotEnougth, '手续费不足');
		} else {
			var transaction = {
				nonce: transactionCount,
				gasLimit: ethers.utils.bigNumberify(data.gas),
				gasPrice: gasPriceWei,
				to: data.to,
				value: ethers.utils.parseUnits(data.money.toString(), data.length),
				data: "0x",
				// This ensures the transaction cannot be replayed on different networks
				chainId: ethers.utils.getNetwork('homestead').chainId
			}
			var wallet = new ethers.Wallet(data.privateKey);
			var signPromise = wallet.sign(transaction)
			signPromise.then(function(signedTransaction){
				provider.sendTransaction(signedTransaction).then(function(tx){
					data.success(tx.hash);
				});
			})
		}
	});
}

/**
 * 发起一笔转帐
 * @param {JSON} 转帐数据
 */
__wallet.transfer = function(data) {
	try {
		data.privateKey = data.privateKey || "";
		data.to = data.to || "";
		data.money = data.money || 0;
		data.gas = data.gas || 80000;
		data.gasPrice = data.gasPrice || 10;
		data.length = data.length || 18;
		data.contactAddress = data.contactAddress || "";
		data.success = data.success || _success;
		data.error = data.error || _error;
		var wallet = this.importByPrivateKey(data.privateKey);
		if(data.to.length != 42) {
			data.error(ResultStatus.AddressError, "接收地址出错");
			return;
		}  
		if(wallet.status == ResultStatus.PrivateKeyError) {
			data.error(ResultStatus.PrivateKeyError, "请输入正确的私钥");
			return;
		}
		if(data.contactAddress.length == 0 || data.contactAddress == "eth") {
			this.transferEth(data, wallet);
		} else {
			this.transferContact(data, wallet);
		}
	} catch(e) {
		data.error(ResultStatus.Error, e.message);
	}
}

__wallet.transferContact = function(data, wallet) {
	if(data.length < 3 || data.length > 18) {
		data.error(LengthError.LengthError, "请输入正确的合约币长度");
		return;
	}
	var provider = ethers.getDefaultProvider()

	var ethbalancePromise = provider.getBalance(wallet.address);
	var gasPricePromise = provider.getGasPrice();
	var transactionCountPromise = provider.getTransactionCount(wallet.address);

	data.abi = data.abi || _defautAbi;
	var contract = new ethers.Contract(data.contactAddress, data.abi, provider);
	var contractbalancePromise = contract.balanceOf(data.contactAddress);
	var allPromises = Promise.all([
		gasPricePromise,
		ethbalancePromise,
		transactionCountPromise,
		contractbalancePromise
	]);
	var gasPriceWei = ethers.utils.parseUnits(data.gasPrice.toString(), 9);
	var fee = ethers.utils.formatEther(gasPriceWei.mul(data.gas));
	var sendPromise = allPromises.then(function(results) {
		var gasPrice = results[0];
		var ethbalance = ethers.utils.formatEther(results[1]);
		var transactionCount = results[2];
		var contactbalance = ethers.utils.formatUnits(results[3], data.length);

		if(ethbalance < fee) {
			data.error(ResultStatus.NotEnougthFee, 'Eth手续费不足');
		} else {
			if(contactbalance < data.Money) {
				data.error(ResultStatus.NotEnougth, '余额不足');
			} else {
				var transaction = {
					nonce: transactionCount,
					gasLimit: ethers.utils.bigNumberify(data.gas),
					gasPrice: gasPriceWei,
					to: data.contactAddress,
					value: ethers.utils.bigNumberify("0"),
					data: "0xa9059cbb" + ethers.utils.hexZeroPad(ethers.utils.hexlify(data.to), 32).replace("0x", "") + ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.parseUnits(data.money.toString(), data.length)), 32).replace("0x", ""),
					// This ensures the transaction cannot be replayed on different networks
					chainId: ethers.utils.getNetwork('homestead').chainId
				}

				var wallet = new ethers.Wallet(data.privateKey);
				var signPromise = wallet.sign(transaction)
				signPromise.then(function(signedTransaction)  {
					provider.sendTransaction(signedTransaction).then(function(tx) {
						data.success(tx.hash);
					});
				}).catch(function() {

				});
			}
		}
	});
}
export default __wallet;