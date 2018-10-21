const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const fileTool = require('fs-extra');

const cmder = async cmd => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if(err) {
                reject(err);
                return;
            }
            resolve('success');
        })
    })
}

const rmDirFiles = dir => {
    const dirPath = fs.readdirSync(dir);
    dirPath.map(item => {
        const currentPath = path.join(dir, item);
        console.log(`rmove ${currentPath}`);
        fileTool.removeSync(currentPath);
    });
}

module.exports = {
    cmder,
    rmDirFiles
};