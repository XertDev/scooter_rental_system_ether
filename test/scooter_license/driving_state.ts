import {MScooterLicenseInstance} from "../../types/truffle-contracts";

const MScooterLicense = artifacts.require("MScooterLicense");

contract("MScooterLicense-drivingState", accounts => {
    let instance: MScooterLicenseInstance;

    const alice = accounts[0];
    const bob = accounts[1];

    const scooter1 = accounts[2];

    beforeEach(async () => {
        instance = await MScooterLicense.new(25);
    });

    it("should set default state to not driving", async () => {
       assert.isFalse(await instance.drivingState(alice), "should be set to false");
    });

    it("should throw on set state by account without permission", async () => {
        await instance.setDrivingState(alice, true, {from: bob})
            .then(() => assert.fail("should throw when user with permission try to change state"))
            .catch((error) => assert.include(
                error.message,
                "is not an admin or scooter",
                "should throw is not an admin or scooter error")
            );

    });

    it("should set state by admin or scooter", async () => {
        const dayPrice = await instance.dayPrice();
        await instance.extend(10, {from: bob, value: dayPrice.muln(10)});

        await instance.addScooter(scooter1);

        await instance.setDrivingState(bob, true, {from: scooter1});
        assert.isTrue(await instance.drivingState(bob), "should be set to true");

        await instance.setDrivingState(bob, false);
        assert.isFalse(await instance.drivingState(bob), "should be set to false");

    });

    it("should set state", async () => {
        const dayPrice = await instance.dayPrice();
        await instance.extend(10, {from: bob, value: dayPrice.muln(10)});

        await instance.setDrivingState(bob, true);
        assert.isTrue(await instance.drivingState(bob), "should be set to true");

        await instance.setDrivingState(bob, false);
        assert.isFalse(await instance.drivingState(bob), "should be set to false");
    });
});
