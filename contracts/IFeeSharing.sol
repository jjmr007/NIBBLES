pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;

interface IFeeSharing {
    struct Checkpoint {
        uint32 blockNumber;
        uint32 timestamp;
        uint96 totalWeightedStake;
        uint96 numTokens;
    }
    function totalTokenCheckpoints(address token) external view returns (uint256);
    function processedCheckpoints(address user, address token) external view returns (uint256);
    function tokenCheckpoints(address token, uint256 counter) external view returns (Checkpoint memory);
}