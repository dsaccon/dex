var Dex = artifacts.require("Dex");
var Token = artifacts.require("Token");

/*module.exports = async function (deployer) {
	deployer.deploy(Token, "token", "TKN", 18, 1000000).then(function() {
  		return deployer.deploy(Dex, Token.address);
	});
	let dex_inst = await Dex.deployed()
	dex_inst.init(50, {value: 50*10**18})
};*/

//module.exports = async function (deployer) {
//	deployer.deploy(Token, "token", "TKN", 18, 1000000)
//		.then(() => Token.deployed())
//		.then(() => deployer.deploy(Dex, Token.address))
//		.then(() => Dex.deployed());
//
//		.then(() => let dex_inst = await Dex.deployed())
//		.then(() => dex_inst.init(50, {value: 50*10**18}));
//	let dex_inst = await Dex.deployed()
//	dex_inst.init(50, {value: 50*10**18})
//};

module.exports = async function (deployer) {
	deployer.deploy(Token, "token", "TKN", 18, 1000000)
		.then(() => Token.deployed())
		.then(() => deployer.deploy(Dex, Token.address))
		.then(() => Dex.deployed())
		.then((Dex_instance) => {
			Dex_instance.init(50, {value: 50*10**18})
		});
};
		
//		.then(() => let dex_inst = await Dex.deployed())
//		.then(() => dex_inst.init(50, {value: 50*10**18}));
//	let dex_inst = await Dex.deployed()
//	dex_inst.init(50, {value: 50*10**18})
//};