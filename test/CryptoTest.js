const assert = require('assert');
const Crypto = require('../src/Crypto');

describe('Crypto', () => {

    const KEY = 'theCryptoKey';
    const CONTENT = 'contentToEncrypt';

    describe('encrypt', () => {
        it('should encrypt and decrypt content', () => {
            const crypto = new Crypto(KEY);
            const encrypted = crypto.encrypt(Buffer.from(CONTENT));
            const decrypted = crypto.decrypt(encrypted);
            assert.equal(decrypted.toString(), CONTENT);
        });
    });

    describe('generate key', () => {
        it('should generate random key', () => {
            const key = Crypto.generateKey();
            assert.equal(key.length, 64);
        });
    });

});
