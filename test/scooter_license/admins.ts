import {MScooterLicenseInstance} from "../../types/truffle-contracts";

const MScooterLicense = artifacts.require("MScooterLicense");

contract("MScooterLicense-admins", accounts => {
    let instance: MScooterLicenseInstance;

    const alice = accounts[0];
    const bob = accounts[1];
    const magdalene = accounts[2];

    beforeEach(async () => {
        instance = await MScooterLicense.new(25);
    });

    it("should register creator as administrator", async () => {
        assert.equal(
            await instance.isAdmin(alice),
            true,
            "Creator wasn't registered as admin"
        );
    });

    it("should register additional administrators", async () => {
        await instance.grantAdmin(bob);

        assert.equal(
            await instance.isAdmin(bob),
            true,
            "Granted account should be admin"
        );
        assert.equal(
            await instance.isAdmin(alice),
            true,
            "Creator account should be admin"
        );
    });

    it("revoked administrator should not be visible as administrator", async () => {
        await instance.grantAdmin(bob);
        await instance.grantAdmin(magdalene);
        await instance.revokeAdmin(alice);

        assert.equal(
            await instance.isAdmin(alice),
            false,
            "Revoked account shouldn't be currently in admin group"
        );
        assert.equal(
            await instance.isAdmin(bob),
            true,
            "Granted account should be an admin"
        );

        await instance.revokeAdmin(bob, {from: magdalene});

        assert.equal(
            await instance.isAdmin(alice),
            false,
            "Creator account shouldn't be currently in admin group"
        );
    });

    it("should trigger error on unauthorized access to admin control functions", async () => {
        await instance.grantAdmin(bob, {from: magdalene})
            .then(
                () => assert.fail("Should fail for account not registered as admin")
            )
            .catch(
                (error) => assert.include(error.message, "is not an admin", "Should throw is not admin error")
            );
    });

    it("should throw on invalid address in admin control", async () => {
        await instance.grantAdmin("0x0000000000000000000000000000000000000000", {from: alice})
            .then(
                () => assert.fail("Should fail for invalid account for new admin")
            )
            .catch(
                (error) => assert.include(error.message, "account is the zero address", "Should throw account is the zero address error")
            );

        await instance.revokeAdmin("0x0000000000000000000000000000000000000000", {from: alice})
            .then(
                () => assert.fail("Should fail for invalid account for new admin")
            )
            .catch(
                (error) => assert.include(error.message, "account is the zero address", "Should throw account is the zero address error")
            );
    });
    it("should throw on invalid operation in admin control", async () => {
        await instance.grantAdmin(alice)
            .then(
                () => assert.fail("Should fail for trying to grant admin permission for admin")
            )
            .catch(
                (error) => assert.include(error.message, "account is already an admin", "Should throw if account is already an admin")
            );

        await instance.revokeAdmin(bob)
            .then(
                () => assert.fail("Should fail for trying to revoke permission for not-admin user")
            )
            .catch(
                (error) => assert.include(error.message, "account is not an admin", "Should throw if account isn't admin")
            );
    });
});
