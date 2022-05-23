const fs = require('fs');
const { Transform } = require('stream');
const path = require('path');
const {stdin: input, stdout: output} = require('process');
const readline = require('readline');

async function createFolder() {
  let filePath = path.resolve(__dirname, 'project-dist');
  await fs.promises.rm(filePath, { recursive: true, force: true });
  await fs.promises.mkdir(filePath, { recursive: true });
}

async function copyDir(filePath, filePathCopy) {
  await fs.promises.rm(filePathCopy, { recursive: true, force: true });
  await fs.promises.mkdir(filePathCopy, { recursive: true });
  const files = await fs.promises.readdir(filePath);
  files.forEach((file) => {
    fs.stat(path.resolve(filePath, file), (err, stats) => {
      if (err) throw err;
      !stats.isDirectory()
        ? fs.promises.copyFile(
          path.join(filePath, file),
          path.join(filePathCopy, file)
        )
        : copyDir(
          path.resolve(filePath, file),
          path.resolve(filePathCopy, file)
        );
    });
  });
}

const createStylesBundle = async() => {
  const distFolder = path.resolve(__dirname, 'project-dist');
  const filepath = path.join(distFolder, './style.css');
  const ws = fs.createWriteStream(filepath);
  const rl = readline.createInterface({ input, output });
  const stylesFolder = path.resolve(__dirname, 'styles');
  fs.readdir(stylesFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (path.extname(file).slice(1) === 'css') {
        const filepath = path.join(stylesFolder, file);
        let stream = fs.createReadStream(filepath);
        stream.on('data', (data) => {
          ws.write(data);
          rl.close();
        });
      }
    });
  });
};

async function generateHtmlFile(file) {
  let rs = fs.createReadStream(file).setEncoding('utf8');
  let result = '';
  for await (const chunk of rs) {
    result += chunk;
  }
  return result;
}

async function createBundleHtml() {
  let ws = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
  let rs = fs.createReadStream(path.resolve(__dirname, 'template.html'));
  const TransformTemplate = new Transform({
    async transform(chunk) {
      const re = /{{(.*)}}/gi;
      const replacement = [...chunk.toString().matchAll(re)];
      const results = await Promise.all(
        replacement.reduce((acc, el) => {
          acc.push((async (el) => {
            let html = await generateHtmlFile(
              path.resolve(__dirname, 'components', el[1] + '.html')
            );
            return { placeholder: el[0], html: html };
          })(el));
          return acc;
        }, [])
      );
      let html = chunk.toString();
      results.forEach((result) => {
        html = html.replace(result.placeholder, result.html);
      });
      this.push(html);
    },
  });
  rs.pipe(TransformTemplate).pipe(ws);
}

async function bundle() {
  await createFolder();
  await copyDir(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist', 'assets'));
  await createStylesBundle();
  await createBundleHtml();
  console.log('Done, boss');
}

bundle();
