const assert = require('assert');
const setupIpfsNode = require('./setupIpfsNode');
const ContentHandler = require('../src/ContentHandler');

describe('ContentHandler', function() {
    this.timeout(30000);

    const CONTENT_DATA = 'testdata';
    const global = {};

    before(function(done) {
        setupIpfsNode((err, node) => {
            global.ipfs = node;
            done();
        });
    });


    after(function(done) {
        global.ipfs.goOffline((err) => {
            done(err);
        });
    });

    describe('save and load', function() {

        it('should save and load content', (done) => {
            let content = new ContentHandler({
                ipfs: global.ipfs
            });
            content.save(CONTENT_DATA)
                .then((hash) => {
                    return content.load(hash)
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
            let content = new ContentHandler({
                ipfs: global.ipfs,
                encryption: true,
                encryptionKey: 'theEncryptionKey'
            });
            content.save(CONTENT_DATA)
                .then((hash) => {
                    return content.load(hash)
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

