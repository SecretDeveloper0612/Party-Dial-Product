const fs = require('fs');

const file = fs.readFileSync('/Users/haldwani/Documents/Working/party_dial/vendor/src/app/dashboard/page.tsx', 'utf8');

let tags = [];
let lines = file.split('\n');
let inJsx = false;

// We can just use babel to parse the file. 
