const { expect } = require("chai");

describe("Nibbles", function() {
  let nibbles;

  beforeEach(async () => {
    const Nibbles = await ethers.getContractFactory("Nibbles");
    nibbles = await Nibbles.deploy();
    await nibbles.deployed();
  });

  it("should return the correct Nth byte", async function() {
    // Test data
    const testData = "0xf0112233445566778899aabbccddeeff0f0102030405060708090a0b0c0d0e0f";

    // Test cases
    const testCases = [
        { index: 0, expected: 0xf0 },
        { index: 1, expected: 0x11 },
        { index: 2, expected: 0x22 },
        { index: 3, expected: 0x33 },
        { index: 4, expected: 0x44 },
        { index: 5, expected: 0x55 },
        { index: 6, expected: 0x66 },
        { index: 7, expected: 0x77 },
        { index: 8, expected: 0x88 },
        { index: 9, expected: 0x99 },
        { index: 10, expected: 0xaa },
        { index: 11, expected: 0xbb },
        { index: 12, expected: 0xcc },
        { index: 13, expected: 0xdd },
        { index: 14, expected: 0xee },
        { index: 15, expected: 0xff },
        { index: 16, expected: 0x0f },
        { index: 17, expected: 0x01 },
        { index: 18, expected: 0x02 },
        { index: 19, expected: 0x03 },
        { index: 20, expected: 0x04 },
        { index: 21, expected: 0x05 },
        { index: 22, expected: 0x06 },
        { index: 23, expected: 0x07 },
        { index: 24, expected: 0x08 },
        { index: 25, expected: 0x09 },
        { index: 26, expected: 0x0a },
        { index: 27, expected: 0x0b },
        { index: 28, expected: 0x0c },
        { index: 29, expected: 0x0d },
        { index: 30, expected: 0x0e },
        { index: 31, expected: 0x0f }
    ];

    for (const { index, expected } of testCases) {
      const result = await nibbles.getNthByte(testData, index);
      expect(result).to.equal(expected);
    }
  });
});
