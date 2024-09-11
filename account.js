const fs = require("fs");
const path = require("path");
const { Keys } = require("casper-js-sdk");

const createAccountKeys = () => {
    // Generating keys
    const edKeyPair = Keys.Ed25519.new();
    const { publicKey, privateKey } = edKeyPair;

    // Create a hexadecimal representation of the public key
    const accountAddress = publicKey.toHex();

    // Get the account hash (Uint8Array) from the public key
    const accountHash = publicKey.toAccountHash();

    // Store keys as PEM files
    const publicKeyInPem = edKeyPair.exportPublicKeyInPem();
    const privateKeyInPem = edKeyPair.exportPrivateKeyInPem();

    const folder = path.join("./", "casper_keys");

    if (!fs.existsSync(folder)) {
        const tempDir = fs.mkdirSync(folder);
    }

    fs.writeFileSync(folder + "/" + accountAddress + "_public.pem", publicKeyInPem);
    fs.writeFileSync(folder + "/" + accountAddress + "_private.pem", privateKeyInPem);

    return accountAddress;
};

const newAccountAddress = createAccountKeys();