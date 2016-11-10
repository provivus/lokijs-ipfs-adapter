"use strict";

const ContentHandler = require('./ContentHandler');

class IpfsAdapter {

    constructor(options) {
        this.databases = {};
        this.metaDataHash = null;
        this.contentHandler = new ContentHandler({
            ipfs: options.ipfs
        });
    }

    _saveMetadata() {
        return this.contentHandler.save(this.databases)
            .then((hash) => {
                return hash;
            });
    }

    _loadMetadata() {
        return this.contentHandler.load(this.metaDataHash)
            .then((data) => {
                this.databases = JSON.parse(data);
                return this.databases;
            });
    }

    loadDatabase(dbname, callback) {
        const hash = this.databases[dbname];
        if (!hash) {
            callback({});
        } else {
            this.contentHandler.load(hash)
                .then((data) => {
                    callback(data.toString());
                })
                .catch((err) => {
                    callback(err);
                });
        }
    }

    saveDatabase(dbname, dbstring, callback) {
        this.contentHandler.save(dbstring)
            .then((hash) => {
                this.databases[dbname] = hash;
                callback();
            })
            .catch((err) => {
                callback(err);
            });
    };

}

module.exports = IpfsAdapter;
