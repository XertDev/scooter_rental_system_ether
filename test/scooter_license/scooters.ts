import {MScooterLicenseInstance} from "../../types/truffle-contracts";

const MScooterLicense = artifacts.require("MScooterLicense");

contract("MScooterLicense-scooters", accounts => {
    let instance: MScooterLicenseInstance;

    const alice = accounts[0];
    const bob = accounts[1];
    const magdalene = accounts[2];

    const scooter1 = accounts[3];
    const scooter2 = accounts[4];

    beforeEach(async () => {
        instance = await MScooterLicense.new(25);
    });

    it("should add scooter", async () => {
        await instance.addScooter(scooter1);
        assert.isTrue(await instance.isScooter(scooter1), "scooter1 should be added");

        await instance.addScooter(scooter2);
        assert.isTrue(await instance.isScooter(scooter2), "scooter2 should be added");
    });


});
