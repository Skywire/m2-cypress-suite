const fs = require('fs');
let ncp = require('ncp').ncp;

let testPath = `${process.env.INIT_CWD}/dev/tests/cypress`;
ncp.limit = 16;

fs.mkdirSync(testPath, {recursive: true});

ncp('cypress', testPath, {clobber: false}, function (result) {
    if (result) {
        console.log(result);
    }
});

ncp('cypress.json.dist', `${process.env.INIT_CWD}/cypress.json`, {clobber: false}, (result) => {
    if (result) {
        console.log(result);
    }
});