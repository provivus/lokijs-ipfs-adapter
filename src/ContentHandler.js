"use strict";

const Crypto = require('./Crypto');

class ContentHandler {

    constructor(options) {
        this.ipfs = options.ipfs;
        this.encryption = options.encryption || false;
        this.encryptionKey = options.encryptionKey;

        if (this.encryption) {
            this.crypto = new Crypto(this.encryptionKey);
        }
    }

    load(hash) {
        return this.ipfs.files.cat(hash)
            .then((is) => {
                return new Promise((resolve) => {
                    let chunks = [];

                    is.on('data', (data) => {
                        chunks.push(data);
                    });

                    is.on('end', () => {
                        let content = Buffer.concat(chunks);
                        if (this.encryption) {
                            content = this.crypto.decrypt(content);
                        }
                        resolve(content);
                    });
                });
            });
    }

    save(content) {
        let data = ContentHandler._toBuffer(content);
        if (this.encryption) {
            data = this.crypto.encrypt(data);
        }
        return this.ipfs.files.add(data)
            .then((results) => {
                return results[0].hash;
            });
    }

    static _toBuffer(content) {
        if (content instanceof Buffer) {
            return content;
        } else if (typeof content === 'string' || content instanceof String) {
            return Buffer.from(content);
        } else if (content instanceof Object) {
            return Buffer.from(JSON.stringify(content));
        } else {
            throw new Error("Unhandled type " + typeof content)
        }
    }

}

module.exports = ContentHandler;
