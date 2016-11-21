const assert = require('assert');
const Crypto = require('../src/Crypto');
const forge = require('node-forge');

describe('Crypto', () => {

    const CONTENT = 'contentToEncrypt';

    const global = {};

    before(() => {
        global.key = Crypto.generateKey();
    });

    describe('encrypt', () => {
        it('should encrypt and decrypt content', () => {
            const crypto = new Crypto(global.key);
            const encrypted = crypto.encrypt(Buffer.from(CONTENT));
            const decrypted = crypto.decrypt(encrypted);
            assert.equal(decrypted.toString(), CONTENT);
        });
    });

    describe('generate key', () => {
        it('should generate random key', () => {
//            const key = Crypto.generateKey();
            assert.equal(global.key.length, 64);
        });
    });

});
