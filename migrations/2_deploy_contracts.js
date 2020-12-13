var Dex = artifacts.require("Dex");
var Token = artifacts.require("Token");

module.exports = async function (deployer) {
	deployer.deploy(Token, "token", "TKN", 18, 1000000)
		.then(() => Token.deployed())
		.then(() => deployer.deploy(Dex, Token.address))
		.then(() => Dex.deployed())
		.then((Dex_instance) => {
			Dex_instance.init(50, {value: 50*10**18})
		});
};