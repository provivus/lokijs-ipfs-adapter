var crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;

class Crypto {

    constructor(key) {
        this.cipher = crypto.createCipher(ALGORITHM, key);
        this.decipher = crypto.createDecipher(ALGORITHM, key);
    }

    encrypt(data) {
        return Buffer.concat([this.cipher.update(data), this.cipher.final()]);
    }

    decrypt(data) {
        return Buffer.concat([this.decipher.update(data), this.decipher.final()]);
    }

    static generateKey() {
        const key = crypto.randomBytes(KEY_LENGTH);
        return key.toString('hex');
    }

}

module.exports = Crypto;
