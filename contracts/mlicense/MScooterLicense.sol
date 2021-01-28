pragma solidity >=0.4.22 <0.9.0;

import "./IMScooterLicense.sol";

contract MScooterLicense is IMScooterLicense{
    mapping (address => bool) _admins;
    mapping (address => bool) _scooters;

    mapping (address => uint256) _licenseEndTimes;
    mapping (address => bool) _drivingStates;

    uint256 public dayPrice;

    constructor(uint256 _dayPrice) public {
        require(_dayPrice > 0);

        _admins[msg.sender] = true;
        dayPrice = _dayPrice;
    }

    modifier onlyAdmin() {
        require(_admins[msg.sender], "Sender is not an admin");
        _;
    }

    modifier onlyScooter() {
        require(_scooters[msg.sender], "Sender is not a scooter");
        _;
    }

    modifier onlyAdminAndScooter() {
        require(_admins[msg.sender] || _scooters[msg.sender], "Sender is not an admin or scooter");
        _;
    }

    function grantAdmin(address account) public onlyAdmin {
        require(account != address(0), "provided account is the zero address");
        require(!_admins[account], "provided account is already an admin");

        _admins[account] = true;
    }

    function revokeAdmin(address account) public onlyAdmin {
        require(account != address(0), "provided account is the zero address");
        require(_admins[account], "provided account is not an admin");

        _admins[account] = false;
    }

    function isAdmin(address account) external view returns (bool) {
        return _admins[account];
    }

    function addScooter(address scooter) public onlyAdmin {
        require(scooter != address(0), "provided scooter is the zero address");
        require(!_scooters[scooter], "provided scooter is already registered");

        _scooters[scooter] = true;
    }

    function removeScooter(address scooter) public onlyAdmin {
        require(scooter != address(0), "provided scooter is the zero address");
        require(_scooters[scooter], "provided scooter is not registered");

        _scooters[scooter] = false;
    }

    function isScooter(address scooter) external view returns (bool) {
        return _scooters[scooter];
    }

    /**
     * @dev Deposit etherum for gas.
     */
    function deposit() public payable {
    }

    /**
     * @dev Withdraw additional etherum.
     */
    function withdraw(uint256 value) public onlyAdmin {
        msg.sender.transfer(value);
    }

    /**
     * @dev Returns the end time of subscription.
     */
    function dueTo() external view returns (uint256) {
        return _licenseEndTimes[msg.sender];
    }

    /**
     * @dev Return current state of license
     */
    function active() external view returns (bool) {
        return now < _licenseEndTimes[msg.sender];
    }

    /**
     * @dev Return true if currently driving otherwise false.
     */
    function drivingState(address account) external view returns (bool) {
        return _drivingStates[account];
    }

    /**
     * @dev Return true if user can currently start driving.
     */
    function canDrive(address account) external view returns (bool) {
        if(now >= _licenseEndTimes[account]) {
            return false;
        }

        return !_drivingStates[account];
    }

    /**
     * @dev Update driving state
     */
    function setDrivingState(address account, bool state) external onlyAdminAndScooter {
        require(account != address(0), "provided account is the zero address");
        if(!state) {
            _drivingStates[account] = false;
        } else {
            require(now < _licenseEndTimes[account], "provided account has no valid subscription");
            _drivingStates[account] = true;
        }
    }

    /**
     * @dev Extend current license by day count `day_extend`.
     *
     * Returns a bolean indicationg whether the operation succeded.
     */
    function extend(uint8 day_extend) public payable{
        require(day_extend * dayPrice <= msg.value, "Not enough etherum for given duration");

        uint256 toPayback = msg.value - day_extend * dayPrice;

        if(now > _licenseEndTimes[msg.sender]) {
            _licenseEndTimes[msg.sender] = now + day_extend * 1 days;
        } else {
            _licenseEndTimes[msg.sender] += day_extend * 1 days;
        }

        if(toPayback > 0) {
            msg.sender.transfer(toPayback);
        }
    }

}
