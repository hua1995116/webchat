
let fs = require('fs');
let join = require('path').join;
const uploadUrl = 'http://ozt4jt8av.bkt.clouddn.com/';
/**
 * 
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            let fPath = join(path,val);
            let stats = fs.statSync(fPath);
            // if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()&&val.indexOf('.map') === -1) result.push(val);
        });

    }
    finder(startPath);
    return result;
}
let JSfileNames = findSync('./dist/static/js');

let CSSfileNames = findSync('./dist/static/css');

function readFileSync() {
    fs.readFile('./dist/index.html', 'utf8', function(err, data) {
        if(err) {
            console.log(err);
        }
        data = data.toString();
        for(var i in JSfileNames) {
            data = data.replace(`/static/js/${JSfileNames[i]}`, `${uploadUrl}${JSfileNames[i]}`);
        }
        for(var i in CSSfileNames) {
            console.log(CSSfileNames[i]);
            const reg = new RegExp(`=\.{0,1}\/static\/css\/${CSSfileNames[i]}`);
            data = data.replace(reg, `=${uploadUrl}${CSSfileNames[i]}`);
        }
        fs.writeFile('./dist/index.html', data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });
}
readFileSync();