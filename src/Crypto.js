"use strict";

const forge = require('node-forge');
const cipher = forge.cipher;
const util = forge.util;
const random = forge.random;

const ALGORITHM = 'AES-CBC';
const KEY_LENGTH = 32;
const IV = Buffer.from('7c2e1d3599f06b9cc926bb5773918622', 'hex').toString();

class Crypto {

    constructor(key) {
        const keyBytes = util.hexToBytes(key);
        this.cipher = cipher.createCipher(ALGORITHM, keyBytes);
        this.decipher = cipher.createDecipher(ALGORITHM, keyBytes);
    }

    encrypt(data) {
        this.cipher.start({iv: IV});
        this.cipher.update(util.createBuffer(data.toString('binary')));
        this.cipher.finish();
        return Buffer.from(this.cipher.output.getBytes(), 'binary');
    }

    decrypt(data) {
        this.decipher.start({iv: IV});
        this.decipher.update(util.createBuffer(data.toString('binary')));
        this.decipher.finish();
        return Buffer.from(this.decipher.output.getBytes(), 'binary');
    }

    static generateKey() {
        return util.bytesToHex(random.getBytesSync(KEY_LENGTH));
    }

}

module.exports = Crypto;
