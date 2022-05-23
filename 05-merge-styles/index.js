const fs = require('fs');
const path = require('path');
const {stdin: input, stdout: output} = require('process');
const readline = require('readline');

const rl = readline.createInterface({input, output});
const stylesFolder = path.resolve(__dirname, 'styles');
const distFolder = path.resolve(__dirname, 'project-dist');
const filepath = path.join(distFolder, './bundle.css');
const ws = fs.createWriteStream(filepath);

fs.readdir(stylesFolder, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (path.extname(file).slice(1) === 'css') {
      const filepath = path.join(stylesFolder, file);
      let stream = fs.createReadStream(filepath);
      stream.on('data', (data) => {
        ws.write(data);
        rl.close();

      });
    }
  });
  console.log('Done, boss');
});

