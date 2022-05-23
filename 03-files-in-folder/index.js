const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.stat(path.join(folderPath, file), (err, stats) => {
      if (!stats.isDirectory()) {
        console.log(`${file.split('.')[0]} - ${path.extname(file).slice(1)} - ${stats.size / 1000}kb`);
      }
    });
  }
});


