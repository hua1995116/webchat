let fs = require('fs');
let join = require('path').join;
const path = require('path'); 
const upload = require('./qiniu');

const url  = '//s3.qiufengh.com/';
const bucket = 'webchat/'
const uploadUrl = url + bucket;

/**
 * 
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
    let result = [];
    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if(stats.isFile()&&val.indexOf('.map') === -1) result.push(val);
        });

    }
    finder(startPath);
    return result;
}
let JSfileNames = findSync('../dist/static/js');

let CSSfileNames = findSync('../dist/static/css');

function readFileSync() {
    fs.readFile('../dist/index.html', 'utf8', function(err, data) {
        if(err) {
            console.log(err);
        }
        data = data.toString();
        for(var i in JSfileNames) {
            data = data.replace(`/static/js/${JSfileNames[i]}`, `${uploadUrl}${JSfileNames[i]}?v=${+new Date()}`);
        }
        for(var i in CSSfileNames) {
            const reg = new RegExp(`=\.{0,1}\/static\/css\/${CSSfileNames[i]}`);
            data = data.replace(reg, `=${uploadUrl}${CSSfileNames[i]}?v=${+new Date()}`);
        }
        
        const rootJs = path.join(process.cwd(), '../dist/static/js');
        const rootCss = path.join(process.cwd(), '../dist/static/css');
        const exportList = exportUrlList(rootJs, JSfileNames).concat(exportUrlList(rootCss, CSSfileNames));
        upload(exportList).then(() =>{
            fs.writeFile('../dist/index.html', data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        });
    });
}

function exportUrlList(root, arr) {
    return arr.map(item => (path.join(root, item)))
}

readFileSync();