pragma solidity ^0.5.17;

interface IStaking {
    function numUserStakingCheckpoints(address user, uint256 unlockDate) external view returns (uint32);
    function timestampToLockDate(uint256 timestamp) external view returns (uint256);
}