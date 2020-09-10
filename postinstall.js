const fs = require('fs');
let ncp = require('ncp').ncp;

let testPath = `${process.env.INIT_CWD}/dev/tests/cypress`;
ncp.limit = 16;

fs.mkdirSync(testPath, {recursive: true});

ncp('.', testPath, {clobber: false}, function (result) {
    console.log(result);
});

fs.rmdirSync(testPath + '/.git', {recursive: true});
