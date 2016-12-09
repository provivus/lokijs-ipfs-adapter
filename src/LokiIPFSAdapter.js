'use strict';

const EventEmitter = require('events');
const ContentHandler = require('./ContentHandler');

class LokiIPFSAdapter extends EventEmitter {

    constructor(options) {
        super();
        this.databases = {};
        this.configHash = options.configHash;
        this.contentHandler = new ContentHandler({
            ipfs: options.ipfs
        });
    }

    _loadConfig() {
        if (this.configHash) {
            return this.contentHandler.load(this.configHash)
                .then((data) => {
                    this.databases = JSON.parse(data);
                    return this.databases;
                });
        } else {
            return new Promise((resolve) => {
                resolve({});
            });
        }
    }

    loadDatabase(dbname, callback) {
        this._loadConfig()
            .then((databases) => {
                this.databases = databases;
                const dbhash = this.databases[dbname];
                if (dbhash) {
                    return this.contentHandler.load(dbhash)
                        .then((data) => {
                            callback(data.toString());
                        });
                } else {
                    callback({});
                }
            })
            .catch((err) => {
                callback(err);
            });
    }

    saveDatabase(dbname, dbstring, callback) {
        this.contentHandler.save(dbstring)
            .then((dbhash) => {
                this.databases[dbname] = dbhash;
            })
            .then(() => {
                return this._saveConfig();
            })
            .then(() => {
                this.emit('saved', {
                    dbname: dbname,
                    hash: this.databases[dbname]
                });
                callback();
            })
            .catch((err) => {
                callback(err);
            });
    };

    _saveConfig() {
        return this.contentHandler.save(this.databases)
            .then((hash) => {
                this.configHash = hash;
            });
    }

    getConfigHash() {
        return this.configHash;
    }

}

module.exports = LokiIPFSAdapter;
