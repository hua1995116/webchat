const tinify = require("tinify");
const config = require('./config');
tinify.key = config.keys[0];

const sharkPic = async (list) => {
    for(let i = 0; i < list.length; i++) {
        const item = list[i];
        const source = tinify.fromFile(item.cacheUrl);
        await source.toFile(item.staticUrl);
    }
}

module.exports = sharkPic;