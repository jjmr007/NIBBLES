pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;

import "./IStaking.sol";
import "./IFeeSharing.sol";


contract Nibbles {

    uint256 public constant TWO_WEEKS = 1209600;
    // uint256 public constant KICK_OFF_TS = 1613125695;
    uint256 public constant KICK_OFF_TS = 1613220308; // testnet value
    // address public constant STAKING_ADDRESS = 0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e;
    address public constant STAKING_ADDRESS = 0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3; // testnet value
    // address public constant FEE_SHARING_ADDRESS = 0x115caf168c51ed15ec535727f64684d33b7b08d1;
    address public constant FEE_SHARING_ADDRESS = 0xedD92fb7C556E4A4faf8c4f5A90f471aDCD018f4; // testnet value
    IStaking public staking;
    IFeeSharing public feeShare;

    constructor() public {
        staking = IStaking(STAKING_ADDRESS);
        feeShare = IFeeSharing(FEE_SHARING_ADDRESS);
    }

    function getNthByte(bytes32 data, uint8 index) public pure returns (uint8) {
        return uint8(uint256(data) / (2**(uint256(8) * (31 - index))));
    }

    function retrieveStepFromUint8(uint8 value, uint8 step) public pure returns (bool) {
        uint8 index = 7 - step;
        bool binary = ((value >> index) & 1) == 1 ? true : false;
        return binary;
    }

    function replaceNthByte(bytes32 data, uint8 replaceWith, uint8 byteIndex) public pure returns (bytes32) {
        require(byteIndex < 32, "Invalid byte index");
        
        bytes32 mask = bytes32(uint256(0xFF) << uint256(31 - byteIndex) * uint256(8));
        bytes32 clearedData = data & (~mask);
        bytes32 newByte = bytes32(uint256(replaceWith)) << uint256(31 - byteIndex) * uint256(8);
        bytes32 updatedData = clearedData | newByte;
        
        return updatedData;
    }

    function createByte(address user, uint256 initialUnlockTime, uint8 capped) public view returns (uint8 sum) {
        uint8 until = capped == 0 ? 8 : capped;
        uint256 unlockDate = staking.timestampToLockDate(initialUnlockTime);
        
        for (uint8 i = 0; i < until; i++) {
            unlockDate += i * TWO_WEEKS;
            uint32 numCheckpoints = staking.numUserStakingCheckpoints(user, unlockDate);
            if (numCheckpoints != 0) {
                sum += uint8(uint256(2)**i);
            }
        }
    }

    function createEmptyHintArray(address user, address token) public view 
        returns (
            uint256 initialTimeStamp,
            uint256 endingTimeStamp,
            uint32 hintSize,
            uint8 arraySize
        ) {
        uint256 initialCounter = feeShare.processedCheckpoints(user, token);
        uint256 lastCounter = feeShare.totalTokenCheckpoints(token);
        initialTimeStamp = staking.timestampToLockDate(uint256(feeShare.tokenCheckpoints(token, initialCounter).timestamp));
        endingTimeStamp = 78 * TWO_WEEKS;
        endingTimeStamp += staking.timestampToLockDate(uint256(feeShare.tokenCheckpoints(token, lastCounter).timestamp));
        require((endingTimeStamp - initialTimeStamp) % TWO_WEEKS == 0, 'wrong timestamp settings');
        hintSize = uint32((endingTimeStamp - initialTimeStamp) / TWO_WEEKS);
        arraySize = hintSize % 256 == 0 ? uint8(hintSize / 256) : uint8(1 + (hintSize / 256));
        // hintArray = new bytes32[](arraySize);
    }

    function createHintArray(
        address user, 
        uint256 initialTimeStamp, 
        uint32 hintSize, 
        uint8 arraySize
    ) public view returns(bytes32[] memory hintArray) {
        hintArray = new bytes32[](arraySize);
        uint8 modulus = uint8(hintSize % 8);
        uint32 bytesAmount = modulus == 0 ? hintSize / 8 : 1 + (hintSize / 8);
        uint32 residualBytes = bytesAmount % 32 == 0 ? 32 : bytesAmount % 32;
        uint256 iterationDate = initialTimeStamp;
        
        for(uint32 i = 0; i < arraySize - 1; i++) {
            for(uint8 j = 0; j < 32; j++) {
                uint8 _sum = createByte(user, iterationDate, 0);
                hintArray[i] = replaceNthByte(hintArray[i], _sum, j);
                iterationDate += 8 * TWO_WEEKS;
            }
        }
        
        for(uint8 k = 0; k < residualBytes - 1; k++) {
            uint8 _sum = createByte(user, iterationDate, 0);
            hintArray[arraySize - 1] = replaceNthByte(hintArray[arraySize - 1], _sum, k);
            iterationDate += 8 * TWO_WEEKS;
        }
        
        uint8 sum = createByte(user, iterationDate, modulus);
        hintArray[arraySize - 1] = replaceNthByte(hintArray[arraySize - 1], sum, uint8(residualBytes - 1));
    }

    function readHintByTime(
        bytes32[] memory hintArray,
        uint256 initialTimeStamp,
        uint256 querableTimestamp
    ) public pure returns(bool) {
        require((querableTimestamp - initialTimeStamp) % TWO_WEEKS == 0, 'Wrong time to query');
        uint32 counter = uint32(
            (querableTimestamp - initialTimeStamp) / TWO_WEEKS
        );
        uint8 arrayPosition = counter % 256 == 0 ? uint8((counter / 256) - 1) : uint8(counter / 256);
        uint8 bytePosition = counter % 32 == 0 ? uint8(31) : (counter % 32) % 8 == 0 ? uint8(((counter % 32) / 8) - 1) : uint8((counter % 32) / 8);
        uint8 bitPosition = counter % 8 == 0 ? uint8(7) : uint8((counter % 8) - 1);
        
        if(hintArray[arrayPosition] == bytes32(0)) return false;
        uint8 byteToQuery = getNthByte(hintArray[arrayPosition], bytePosition);
        if(byteToQuery == 0) return false;
        return retrieveStepFromUint8(byteToQuery, bitPosition);
    }

}