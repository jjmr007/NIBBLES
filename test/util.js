var B = "0xf0112233445566778899aabbccddeeff0f0102030405060708090a0b0c0d0e0f";
for (i=0;i<32;i++) {
    console.log("{ index: " + i + ", expected: " + "0x" + B.slice(i*2+2,i*2+4) + " },");
}