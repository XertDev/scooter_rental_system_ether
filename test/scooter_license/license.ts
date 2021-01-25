import {MScooterLicenseInstance} from "../../types/truffle-contracts";

const MScooterLicense = artifacts.require("MScooterLicense");

contract("MScooterLicense-license", accounts => {
    let instance: MScooterLicenseInstance;

    const alice = accounts[0];
    const bob = accounts[1];

    const scooter1 = accounts[2];

    beforeEach(async () => {
        instance = await MScooterLicense.new(25);
    });

    it("should set default license endTime", async () => {
        assert.equal((await instance.dueTo()).toNumber(), 0, "should be zero");
    });
});
