const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, './text.txt');
let stream = fs.createReadStream(filepath);

stream.on('data', (data) =>
  console.log(data.toString())
);

