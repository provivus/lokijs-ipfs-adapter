const tmp = require('tmp');
const Store = require('fs-pull-blob-store');
const IPFSRepo = require('ipfs-repo');
const IPFS = require('ipfs');

module.exports = function(callback) {
    const repoPath = tmp.dirSync({unsafeCleanup: true}).name;
    const repo = new IPFSRepo(repoPath, {
        stores: Store
    });
    const node = new IPFS(repo);
    node.init({emptyRepo: true}, (err) => {
        if (err) {
            callback(err);
        }
        node.load((err) => {
            if (err) {
                callback(err);
            }
            node.goOnline((err) => {
                if (err) {
                    callback(err);
                }
                callback(null, node);
            });
        });
    });
};
