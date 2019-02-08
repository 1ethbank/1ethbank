const Ethbank = artifacts.require('./Ethbank.sol');

module.exports = (deployer) => {
    var advertisingAddress = "0x0";
    deployer.deploy(Ethbank, advertisingAddress);
};
