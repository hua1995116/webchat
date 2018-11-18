const redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function inrcCache(key) {
    return new Promise((resv, rej) => {
        client.incr(key, (err, res) => {
            resv(1);
        });
    })
}

function getCacheById(key) {
    return new Promise((resv, rej) => {
        client.get(key, (err, reply) => {
            resv(reply);
        });
    })
    
}

function updateCache(key, value) {
    return new Promise((resv, rej) => {
        client.getset(key, value, (err, res) => {
            resv(1);
        })
    })
}

function deleteCacheById(key) {
    return new Promise((resv, rej) => {
        client.del(key, (err, reply) => {
            resv(1);
        });
    })
}

function resetCacheById(key) {
    return new Promise((resv, rej) => {
        client.getset(key, 0, (err, reply) => {
            resv(1);
        });
    })
}

function updatehCache(id, key, value) {
    return new Promise((resv, rej) => {
        client.hset(id, key, value, (err, res) => {
            resv(1);
        })
    })
}

function gethCacheById(id, key) {
    return new Promise((resv, rej) => {
        client.hmget(id, key, (err, res) => {
            resv(res[0]);
        })
    })
}

function gethAllCache(id) {
    return new Promise((resv, rej) => {
        client.hkeys(id, (err, res) => {
            resv(res);
        })
    })
}

module.exports = {
    inrcCache,
    getCacheById,
    updateCache,
    deleteCacheById,
    resetCacheById,
    updatehCache,
    gethCacheById,
    gethAllCache
};
