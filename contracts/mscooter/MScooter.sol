pragma solidity >=0.4.22 <0.9.0;

import "../mlicense/IMScooterLicense.sol";

contract MScooter {
    enum State { Running, Idle }
    State state;

    struct Coords {
        int128 lat;
        int128 long;
    }
    Coords public coords;

    address owner;
    uint16 public id;
    address licenseController;
    uint8 public batteryLevel = 0;

    address currentlyDriving;

    constructor(address _licenseController, uint16 _id, int128 lat, int128 long) public {
        owner = msg.sender;
        licenseController = _licenseController;
        id = _id;
        state = State.Idle;
        currentlyDriving = address(0);
        coords.lat = lat;
        coords.long = long;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not an admin");
        _;
    }

    event StartRide(uint8 batteryLevel, int128 lat, int128 long);
    event Snapshot(uint8 batteryLevel);
    event EndRide(uint8 batteryLevel, int128 lat, int128 long);

    function isRunning() public view returns (bool) {
        return state == State.Running;
    }

    function isIdle() public view returns (bool) {
        return state == State.Idle;
    }

    /**
     * @dev Starts ride, check if user has valid license
     */
    function beginRide(address account) public onlyOwner {
        require(account != address(0), "Invalid account address");
        IMScooterLicense license = IMScooterLicense(licenseController);
        require(license.canDrive(account), "Client is currently using other device");

        license.setDrivingState(account, true);
        currentlyDriving = account;

        emit StartRide(batteryLevel, coords.lat, coords.long);
        state = State.Running;
    }

    function endRide() public onlyOwner {
        IMScooterLicense license = IMScooterLicense(licenseController);
        license.setDrivingState(currentlyDriving, false);

        currentlyDriving = address(0);
        state = State.Idle;
        emit EndRide(batteryLevel, coords.lat, coords.long);
    }

    function updateInfo(uint8 _battLevel, int128 lat, int128 long) public onlyOwner {
        require(_battLevel < 100, "Battery level can't be more than maximum battery level");
        batteryLevel = _battLevel;
        coords.lat = lat;
        coords.long = long;

        if(currentlyDriving != address(0)) {
            emit Snapshot(batteryLevel);
        }
    }
}
