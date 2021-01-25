import {MScooterLicenseInstance} from "../../types/truffle-contracts";

const MScooterLicense = artifacts.require("MScooterLicense");

contract("MScooterLicense-scooters", accounts => {
    let instance: MScooterLicenseInstance;

    const alice = accounts[0];
    const bob = accounts[1];

    const scooter1 = accounts[2];
    const scooter2 = accounts[3];

    beforeEach(async () => {
        instance = await MScooterLicense.new(25);
    });

    it("should add scooter", async () => {
        await instance.addScooter(scooter1);
        assert.isTrue(await instance.isScooter(scooter1), "scooter1 should be added");

        await instance.addScooter(scooter2);
        assert.isTrue(await instance.isScooter(scooter2), "scooter2 should be added");
    });

    it("should remove scooter", async () => {
        await instance.addScooter(scooter1);
        await instance.addScooter(scooter2);

        await instance.removeScooter(scooter1);

        assert.isFalse(await instance.isScooter(scooter1), "scooter1 should be already removed");
        assert.isTrue(await instance.isScooter(scooter2), "scooter2 should be still registered");

        await instance.removeScooter(scooter2);
        assert.isFalse(await instance.isScooter(scooter2), "scooter2 should be already removed");
    });

    it("should throw on adding or removing same scooter twice", async () => {
        await instance.addScooter(scooter1);
        await instance.addScooter(scooter1)
            .then(() => assert.fail("should fail on adding same scooter twice"))
            .catch((error) => assert.include(
                error.message,
                "scooter is already registered",
                "should throw scooter is already registered error"
            ));
        await instance.addScooter(scooter2);
        await instance.removeScooter(scooter2);
        await instance.removeScooter(scooter2)
            .then(() => assert.fail("should fail on removing same scooter twice"))
            .catch((error) => assert.include(
                error.message,
                "scooter is not registered",
                "should throw scooter is not registered error"
            ));
    });

    it("should throw on invalid account", async () => {
        instance.addScooter("0x0000000000000000000000000000000000000000")
            .then(() => assert.fail("should fail on invalid account"))
            .catch((error) => assert.include(
                error.message,
                "provided scooter is the zero address",
                "should throw provided scooter is the zero address error"
            ));
        instance.removeScooter("0x0000000000000000000000000000000000000000")
            .then(() => assert.fail("should fail on invalid accounte"))
            .catch((error) => assert.include(
                error.message,
                "provided scooter is the zero address",
                "should throw provided scooter is the zero address error"
            ));
    });

    it("should throw on add and remove by non admin user", async () => {
        await instance.addScooter(scooter1, {from: bob})
            .then(() => assert.fail("should fail on adding scooter by non admin user"))
            .catch((error) => assert.include(
                error.message,
                "is not an admin",
                "should throw is not an admin error"
            ));

        await instance.addScooter(scooter1);
        await instance.removeScooter(scooter2, {from: bob})
            .then(() => assert.fail("should fail on removing scooter by non admin user"))
            .catch((error) => assert.include(
                error.message,
                "is not an admin",
                "should throw is not an admin error"
            ));
    })
});
