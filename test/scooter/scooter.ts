import {MScooterLicenseInstance} from "../../types/truffle-contracts";
import {MScooterInstance} from "../../types/truffle-contracts";
import {BN} from "ethereumjs-util";

const MScooterLicense = artifacts.require("MScooterLicense");
const MScooter = artifacts.require("MScooter");

contract("MScooterLicense-admins", accounts => {
    let licenseInstance: MScooterLicenseInstance;
    let scooterInstance: MScooterInstance;

    const alice = accounts[0];
    const bob = accounts[1];
    const david = accounts[2];

    beforeEach(async () => {
        licenseInstance = await MScooterLicense.new(25);
        await licenseInstance.extend(3,{from: bob, value: new BN(100)});
        scooterInstance = await MScooter.new(licenseInstance.address, 0, 0, 1);
        await licenseInstance.addScooter(scooterInstance.address);
    });

    it("should update info with emitting when not running", async () => {
        await scooterInstance.updateInfo(24, 10, 20);
        let coords = await scooterInstance.coords;
        console.log(coords);
    });

    it("should start ride", async () => {
        await scooterInstance.beginRide(bob);
        assert.isTrue(await scooterInstance.isRunning(), "Should return running state");
        assert.isTrue(await licenseInstance.drivingState(bob), "Should change state of Bob");
    });

    it("should throw on user without valid license", async () => {
        await scooterInstance.beginRide(david)
            .then(() => assert.fail("should fail on invalid license"))
            .catch((error) => assert.include(
                error.message,
                "is currently using other device",
                "should throw is currently using other device error"
            ));
    });

    it("should update without emit while running", async () => {
        await scooterInstance.beginRide(bob);
        await scooterInstance.updateInfo(10, 10, 10);
    });

    it("should end ride", async () => {
        await scooterInstance.beginRide(bob);
        await scooterInstance.endRide();

        assert.isTrue(await scooterInstance.isIdle(), "should be idle");
    })
});
