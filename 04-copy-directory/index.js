const fs = require('fs');
const path = require('path');

const copyDir = async (filePath, filePathCopy) => {
  await fs.promises.rm(filePathCopy, {recursive: true, force: true});
  await fs.promises.mkdir(filePathCopy, {recursive: true});
  const files = await fs.promises.readdir(filePath);
  files.forEach(file => {
    fs.stat(path.resolve(filePath, file), (err, stats) => {
      if (err) throw err;
      (!stats.isDirectory())
        ? fs.promises.copyFile(path.join(filePath, file), path.join(filePathCopy, file))
        : copyDir(path.resolve(filePath, file), path.resolve(filePathCopy, file));
    });
  });
};

copyDir(path.resolve(__dirname, 'files'), path.resolve(__dirname, 'files-copy')).then(() => console.log('Done, boss'));
