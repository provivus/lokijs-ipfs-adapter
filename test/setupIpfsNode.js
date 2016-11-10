var fs = require('fs-extra');
var Store = require('fs-pull-blob-store');
var IPFSRepo = require('ipfs-repo');
var IPFS = require('ipfs');

module.exports = function(callback) {
    var repoPath = '/tmp/ipfsrepo';
    fs.removeSync(repoPath);

    var repo = new IPFSRepo(repoPath, {
        stores: Store
    });
    var node = new IPFS(repo);
    node.init({emptyRepo: true}, function(err) {
        if (err) {
            callback(err);
        }
        node.load(function(err) {
            if (err) {
                callback(err);
            }
            node.goOnline(function(err) {
                if (err) {
                    callback(err);
                }
                callback(null, node);
            });
        });
    });
};
