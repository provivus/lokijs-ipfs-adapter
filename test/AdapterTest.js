const assert = require('assert');
const Loki = require('lokijs');
const setupIpfsNode = require('./setupIpfsNode');
const LokiIPFSAdapter = require('../src/LokiIPFSAdapter');

describe('LokiIPFSAdapter', function() {
    this.timeout(10000);

    const global = {};

    before(() => {
        return setupIpfsNode()
            .then((node) => {
                global.ipfs = node;
            })
            .then(() => {
                return _initdb();
            });
    });

    function _initdb() {
        return new Promise((resolve) => {
            const adapter = new LokiIPFSAdapter({
                ipfs: global.ipfs
            });
            const db = new Loki('db1', {adapter: adapter});
            const collection = db.addCollection('users');
            collection.insert({id: 1, firstName: 'john', lastName: 'doe'});

            adapter.on('saved', () => {
                global.configHash = adapter.getConfigHash();
                resolve();
            });

            db.saveDatabase();
        });
    }

    after((done) => {
        global.ipfs.goOffline((err) => {
            done(err);
        });
    });

    describe('loadDatabase', () => {

        it('should load existing database', (done) => {
            const db = _db('db1', {}, {
                ipfs: global.ipfs,
                configHash: global.configHash
            });

            db.loadDatabase({}, (err) => {
                const results = db.getCollection('users').find({firstName: 'john'});
                assert.equal(results.length, 1);
                done(err);
            });
        });

        it('should create empty database', (done) => {
            const db = _db('db1', {}, {
                ipfs: global.ipfs
            });
            db.loadDatabase({}, (err) => {
                const collection = db.getCollection('users');
                assert.equal(collection, null);
                done(err);
            });
        });

    });


    it('should autosave changes', (done) => {
        const db = _db('db1',
            {
                autosave: true,
                autosaveInterval: 500
            },
            {
                ipfs: global.ipfs,
                configHash: global.configHash
            }
        );
        db.loadDatabase({}, (err) => {
            if (err) {
                return done(err);
            }
            db.getCollection('users').insert({id: 2, firstName: 'jane', lastName: 'doe'});
        });

        setInterval(() => {
            assert.ok(!db.autosaveDirty());
            done();
        }, 1000);
    });

    function _db(dbname, dbOptions = {}, adapterOptions = {}) {
        dbOptions.adapter = new LokiIPFSAdapter(adapterOptions);
        return new Loki(dbname, dbOptions);
    }

});
