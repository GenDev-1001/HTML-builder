const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {stdin: input, stdout: output} = require('process');

const rl = readline.createInterface({input, output});
const filepath = path.join(__dirname, './text.txt');
const ws = fs.createWriteStream(filepath);

rl.question('Entry text, please: \n', answer => {
  ws.write(`${answer}`, error => {
    if (error) throw error;
  });
  if (answer === 'exit') rl.close();
});

rl.on('line', (answer) => {
  ws.write(`${answer}`, error => {
    if (error) throw error;
  });

  if (answer === 'exit') rl.close();
})
  .on('close', () => {
    process.exit();
  });

process
  .on('SIGINT', () => process.exit())
  .on('exit', code => (code === 0) ? console.log('Good bye!') : code);










