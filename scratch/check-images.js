const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const width = buffer.readInt32BE(16);
  const height = buffer.readInt32BE(20);
  return { width, height };
}

function getJpgDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  let i = 0;
  if (buffer[i] !== 0xFF || buffer[i + 1] !== 0xD8) {
    throw new Error('Not a valid JPEG');
  }
  i += 2;
  while (i < buffer.length) {
    if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
      // Found SOF0 or SOF2
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    i++;
  }
  return null;
}

const dir = path.resolve('public', 'images', 'sobre');
const files = fs.readdirSync(dir);
console.log('Imagens em public/images/sobre:');
files.forEach(file => {
  const filePath = path.join(dir, file);
  try {
    let dim;
    if (file.endsWith('.png')) {
      dim = getPngDimensions(filePath);
    } else if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      dim = getJpgDimensions(filePath);
    }
    if (dim) {
      console.log(`- ${file}: ${dim.width}x${dim.height} (Aspect: ${(dim.width / dim.height).toFixed(2)})`);
    } else {
      console.log(`- ${file}: Não foi possível ler dimensões`);
    }
  } catch (err) {
    console.log(`- ${file}: Erro - ${err.message}`);
  }
});
