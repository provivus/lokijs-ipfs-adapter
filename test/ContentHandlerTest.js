const assert = require('assert');
const setupIpfsNode = require('./setupIpfsNode');
const ContentHandler = require('../src/ContentHandler');
const Crypto = require('../src/Crypto');

describe('ContentHandler', function() {
    this.timeout(10000);

    const CONTENT_DATA = 'testdata';
    const global = {};

    before(function() {
        return setupIpfsNode()
            .then((node) => {
                global.ipfs = node;
                global.contentHandler = new ContentHandler({
                    ipfs: global.ipfs
                });
                global.encryptedContentHandler = new ContentHandler({
                    ipfs: global.ipfs,
                    encryption: true,
                    encryptionKey: Crypto.generateKey()
                });
            });
    });

    after(function(done) {
        global.ipfs.goOffline((err) => {
            done(err);
        });
    });

    describe('save and load', function() {

        it('should save and load content', (done) => {
            global.contentHandler.save(CONTENT_DATA)
                .then((hash) => {
                    return global.contentHandler.load(hash)
                        .then((data) => {
                            assert.equal(data.toString(), CONTENT_DATA);
                            done();
                        });
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should save and load encrypted content', (done) => {
            global.encryptedContentHandler.save(CONTENT_DATA)
                .then((hash) => {
                    return global.encryptedContentHandler.load(hash)
                        .then((data) => {
                            assert.equal(data.toString(), CONTENT_DATA);
                            done();
                        });
                })
                .catch((err) => {
                    done(err);
                });
        });

    });

});

