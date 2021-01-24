pragma solidity >=0.4.22 <0.9.0;

interface IMScooterLicense {
    /**
     * @dev Returns the end time of subscription.
     */
    function dueTo() external view returns (uint256);

    /**
     * @dev Return current state of license
     */
    function active() external view returns (bool);

    function isScooter(address scooter) external view returns (bool);

    function isAdmin(address account) external view returns (bool);

    /**
     * @dev Return true if currently driving otherwise false.
     */
    function drivingState(address account) external view returns (bool);

    /**
     * @dev Update driving state
     */
    function setDrivingState(address account, bool state) external;
}
