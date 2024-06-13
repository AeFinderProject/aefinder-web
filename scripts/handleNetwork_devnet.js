// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const filePath = path.resolve(__dirname, `../src/constant/index.ts`);
const networkFilePath = './devnet';

fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) throw err;

  let lines = data.split('\n');
  lines.splice(0, 1);
  lines.unshift(`export * from '${networkFilePath}';`);

  let newData = lines.join('\n');
  fs.writeFile(filePath, newData, (err) => {
    if (err) throw err;
  });
});
