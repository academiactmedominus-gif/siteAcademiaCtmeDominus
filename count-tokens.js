const fs = require('fs');
const path = require('path');

// Pastas e arquivos que devemos ignorar (pesados ou gerados automaticamente)
const IGNORE_LIST = [
  'node_modules',
  '.next',
  '.git',
  '.bluespec',
  '.agent',
  'package-lock.json',
  '.env.local'
];

// Extensões de arquivos de texto que queremos contar
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.rules'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.relative(__dirname, fullPath);

    // Ignora se estiver na lista de bloqueio
    if (IGNORE_LIST.some(ignore => file === ignore || relativePath.startsWith(ignore))) {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

console.log('\n=== CALCULANDO TOKENS DE TODO O SITE ===\n');

try {
  const allFiles = getAllFiles(__dirname);
  let totalSiteTokens = 0;

  allFiles.forEach(filePath => {
    const relativePath = path.relative(__dirname, filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    // Estimativa de tokens baseada em caracteres (~3.5 caracteres por token)
    const totalChars = content.length;
    const approxTokens = Math.ceil(totalChars / 3.5);
    totalSiteTokens += approxTokens;

    console.log(`📄 ${relativePath}`);
    console.log(`   Tokens: ${approxTokens.toLocaleString()} | Caracteres: ${totalChars.toLocaleString()}`);
    console.log('-'.repeat(50));
  });

  console.log(`\n📊 RESUMO TOTAL DO SITE:`);
  console.log(`   Total de arquivos lidos: ${allFiles.length}`);
  console.log(`   Total Geral de Tokens: ${totalSiteTokens.toLocaleString()}\n`);

} catch (error) {
  console.error('Erro ao ler arquivos:', error.message);
}
