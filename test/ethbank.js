var Ethbank = artifacts.require("./Ethbank.sol");
//import assertRevert from './helpers/assertRevert';


contract('Ethbank', (accounts) => {
    var contract;
    var owner = accounts[0]; // for test
    var decimal = 1e18;

    var buyEthOne = 1.0*decimal;
    var buyEthTwo = 1.2*decimal;
    var buyEthThree = 50*decimal;
    var buyEthFor = 15.2*decimal;

    var saleEthOne = 0.0001*decimal;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await Ethbank.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

	it('check type invest', async ()  => {
		await contract.setDemo({from:accounts[0]}); 
		await contract.setSimulateDate(1541066480); //Thu, 01 Nov 2018 10:01:20 GMT
        await contract.doInvest(accounts[1], 0, {from:accounts[1], value: buyEthOne});

        var balanceContract = await contract.balanceETH.call();
        assert.equal(Number(balanceContract/decimal), 0.9);
        //console.log("balanceContract = ", Number(balanceContract/decimal));

        var info = await contract.investorInfo(accounts[1]);
        assert.equal(Number(info[2]/decimal), 1.0);
        assert.equal(Number(info[3]/decimal), 0);
        assert.equal(Number(info[4]/decimal), 0);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]/decimal));

        await contract.setSimulateDate(1541240520); //Sat, 03 Nov 2018 10:22:00 GMT
        var dividends = await contract.investorDividendsAtNow(accounts[1], 0, {from:accounts[1]});
        assert.equal(Number(dividends/decimal), 0.02);
        //console.log("dividends = ", Number(dividends/decimal));

        await contract.setSimulateDate(1541327400); //Sun, 04 Nov 2018 10:30:00 GMT
        await contract.doInvest(accounts[1], 1, {from:accounts[1], value: buyEthOne});
        info = await contract.investorInfo(accounts[1]);
        assert.equal(Number(info[2]/decimal), 1.0);
        assert.equal(Number(info[3]/decimal), 1.03);
        assert.equal(Number(info[4]/decimal), 0);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]/decimal));

        await contract.setSimulateDate(1541500500); //Tue, 06 Nov 2018 10:35:00 GMT
        dividends = await contract.investorDividendsAtNow(accounts[1], 0, {from:accounts[1]});
        assert.equal(Number(dividends/decimal), 0.0612);
        //console.log("dividends = ", Number(dividends/decimal)); // 0.01*2 + 0.0206*2 = 0.0612

        await contract.doInvest(accounts[1], 2, {from:accounts[1], value: buyEthOne});
        info = await contract.investorInfo(accounts[1]);
        assert.equal(Number(info[2]/decimal), 1.0);
        assert.equal(Number(info[3]/decimal), 1.03);
        assert.equal(Number(info[4]/decimal), 1.0612);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        //console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]/decimal));

        await contract.setSimulateDate(1541673600); //Thu, 08 Nov 2018 10:40:00 GM
        dividends = await contract.investorDividendsAtNow(accounts[1], 0, {from:accounts[1]});
        assert.equal(Number(dividends/decimal), 0.124872);
        //console.log("dividends = ", Number(dividends/decimal)); // 0.01*2 + 0.0206*2 + 0.031836*2 = 0.124872
        balanceContract = await contract.balanceETH.call();
         assert.equal(Number(balanceContract/decimal), 2.7);
        // console.log("balanceContract = ", Number(balanceContract/decimal));

    });


    it('check reinvest', async ()  => {
        await contract.doInvest(accounts[2], 0, {from:accounts[2], value: buyEthOne});
        await contract.doInvest(accounts[2], 1, {from:accounts[2], value: buyEthOne});
        await contract.doInvest(accounts[2], 2, {from:accounts[2], value: buyEthOne});
        await contract.setSimulateDate(1541846700); //Sat, 10 Nov 2018 10:45:00 GMT
        dividends = await contract.investorDividendsAtNow(accounts[2], 0, {from:accounts[1]});
        assert.equal(Number(dividends/decimal), 0.12);
        // console.log("dividends = ", Number(dividends/decimal)); // 0.01*2 + 0.0206*2 + 0.031836*2 = 0.124872

        await contract.doInvest(accounts[2], 0, {from:accounts[2], value: buyEthOne});
        info = await contract.investorInfo(accounts[2]);
        assert.equal(Number(info[2]/decimal), 2.12);
        assert.equal(Number(info[3]/decimal), 1);
        assert.equal(Number(info[4]/decimal), 1);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]/decimal));
    });

    it('check get dividents', async ()  => {
        await contract.doInvest(accounts[3], 0, {from:accounts[3], value: buyEthOne});
        await contract.doInvest(accounts[3], 1, {from:accounts[3], value: buyEthOne});
        await contract.doInvest(accounts[3], 2, {from:accounts[3], value: buyEthOne});
        await contract.setSimulateDate(1542019800); //Mon, 12 Nov 2018 10:50:00 GMT
        dividends = await contract.investorDividendsAtNow(accounts[3], 0, {from:accounts[1]});
        assert.equal(Number(dividends/decimal), 0.12);
        // console.log("dividends = ", Number(dividends/decimal)); // 0.01*2 + 0.0206*2 + 0.031836*2 = 0.124872

        var balanceContract = await contract.balanceETH.call();
        assert.equal(Number(balanceContract/decimal), 9);
        // console.log("balanceContract = ", Number(balanceContract/decimal));

        await contract.getMyDividends({from:accounts[3], value: 0});

        balanceContract = await contract.balanceETH.call();
        assert.equal(Number(balanceContract/decimal), 8.88);
        // console.log("balanceContract = ", Number(balanceContract/decimal));

        info = await contract.investorInfo(accounts[3]);
        assert.equal(Number(info[0]), 1542019800);
        assert.equal(Number(info[2]/decimal), 1);
        assert.equal(Number(info[3]/decimal), 1);
        assert.equal(Number(info[4]/decimal), 1);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]/decimal));

        await contract.setSimulateDate(1544871600); //Sat, 15 Dec 2018 11:00:00 GMT
        dividends = await contract.investorDividendsAtNow(accounts[3], 0, {from:accounts[1]});
        assert.equal(Number(dividends/decimal), 2.95);
        //console.log("dividends = ", Number(dividends/decimal)); // 0.01*2 + 0.0206*2 + 0.031836*2 = 0.124872
        await contract.getMyDividends({from:accounts[3], value: 0});
        info = await contract.investorInfo(accounts[3]);
        assert.equal(Number(info[0]), 1544871600);
        assert.equal(Number(info[2]/decimal), 0);
        assert.equal(Number(info[3]/decimal), 1);
        assert.equal(Number(info[4]/decimal), 1);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]/decimal));
    });

    it('check referral system', async ()  => {
        await contract.doInvest(accounts[4], 0, {from:accounts[4], value: buyEthOne});
        await contract.doInvest(accounts[4], 1, {from:accounts[5], value: buyEthOne});

        var info = await contract.investorInfo(accounts[4]);
        assert.equal(info[1], false);
        assert.equal(Number(info[6]), 1);
        assert.equal(Number(info[2]/decimal), 1);
        assert.equal(Number(info[5]/decimal), 0.03);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]));

        info = await contract.investorInfo(accounts[5]);
        assert.equal(info[1], true);
        assert.equal(Number(info[6]), 0);
        assert.equal(Number(info[3]/decimal), 1);
        assert.equal(Number(info[5]/decimal), 0.03);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]));

        await contract.getMyReferrerBonus({from:accounts[4]});
        await contract.getMyReferrerBonus({from:accounts[5]});
        info = await contract.investorInfo(accounts[4]);
        assert.equal(Number(info[5]/decimal), 0);
        info = await contract.investorInfo(accounts[5]);
        assert.equal(Number(info[5]/decimal), 0);
        // console.log("paymentTime = ", Number(info[0]), "isReferral = ", info[1]);
        // console.log("fundDepositType_1 = ", Number(info[2]/decimal), "fundDepositType_2 = ", Number(info[3]/decimal), "fundDepositType_3 = ", Number(info[4]/decimal));
        // console.log("referrerBonus = ", Number(info[5]/decimal), "numberReferral = ", Number(info[6]));
    });


});
