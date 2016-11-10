const assert = require('assert');
const loki = require('lokijs');
const setupIpfsNode = require('./setupIpfsNode');
const Adapter = require('../src/Adapter');

describe('Adapter', function() {
    this.timeout(30000);

    const global = {};

    before((done) => {
        setupIpfsNode((err, node) => {
            if (err) {
                done(err);
            }
            global.ipfs = node;
            global.adapter = new Adapter({
                ipfs: global.ipfs
            });
            done();
        });
    });

    after((done) => {
        global.ipfs.goOffline((err) => {
            done(err);
        });
    });

    describe('saveDatabase', () => {
        it('should save database', (done) => {
            const db = new loki('db1', {adapter: global.adapter});
            const collection = db.addCollection('collection1');
            collection.insert({id: 1, firstName: 'john', lastName: 'doe'});
            collection.insert({id: 2, firstName: 'jane', lastName: 'doe'});
            db.saveDatabase((err) => {
                done(err);
            });
        })
    });

    describe('loadDatabase', () => {
        it('should load database', (done) => {
            const db = new loki('db1', {adapter: global.adapter});
            db.loadDatabase({}, (err) => {
                const collection = db.getCollection('collection1');
                const results = collection.find({firstName: 'jane'});
                assert.equal(results.length, 1);
                assert.equal(results[0].id, 2);
                done(err);
            });
        })
    });

});
