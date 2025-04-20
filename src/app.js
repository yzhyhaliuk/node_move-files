/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

function moveFiles() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Enter 2 arguments');

    return;
  } else if (!fs.existsSync(args[0])) {
    console.error('Non-existing source file!');

    return;
  }

  if (args[0] === args[1]) {
    console.log('Source and destination are the same, doing nothing.');

    return;
  }

  const destPath = path.resolve(args[1]);

  function rewrite(fileName = '') {
    const content = fs.readFileSync(args[0], 'utf-8');
    const outputPath = path.join(destPath, fileName);

    fs.writeFileSync(outputPath, content);
    fs.rmSync(args[0]);
  }

  // Якщо призначення є директорією
  if (args[1].endsWith('/')) {
    if (!fs.existsSync(destPath)) {
      console.error('Non-existing directory!');

      return;
    }
    rewrite(path.basename(args[0]));
  } else if (fs.existsSync(destPath) && fs.statSync(destPath).isDirectory()) {
    rewrite(path.basename(args[0]));
  } else if (path.dirname(args[1]) === '.') {
    fs.renameSync(args[0], args[1]);
  } else {
    const parentDir = path.dirname(destPath);

    if (!fs.existsSync(parentDir)) {
      console.error('Non-existing parent directory!');

      return;
    }

    const content = fs.readFileSync(args[0], 'utf-8');

    fs.writeFileSync(destPath, content);
    fs.rmSync(args[0]);
  }
}

moveFiles();
