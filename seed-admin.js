const fs = require("fs");
const path = require("path");

// Parser simples para ler o arquivo .env.local sem dependências extras
const envPath = path.resolve(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const cleanLine = line.replace(/\r/g, "").trim();
    const match = cleanLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  });
}

// Inicializar o Firebase utilizando o SDK instalado no projeto
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Configuração carregada:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const usersToCreate = [
    {
      email: "admin@dominus.com",
      password: "admin123456",
      name: "Administrador Dominus",
      role: "admin",
    },
    {
      email: "professor@dominus.com",
      password: "professor123456",
      name: "Professor Teste",
      role: "teacher",
    },
    {
      email: "aluno@dominus.com",
      password: "aluno123456",
      name: "Aluno Teste",
      role: "student",
    },
  ];

  console.log("Conectando ao Firebase para semear usuários...");
  for (const item of usersToCreate) {
    try {
      console.log(`Criando conta: ${item.email}...`);
      // 1. Criar o usuário na autenticação do Firebase
      const cred = await createUserWithEmailAndPassword(auth, item.email, item.password);
      const uid = cred.user.uid;

      // 2. Criar o perfil no Firestore
      await setDoc(doc(db, "users", uid), {
        email: item.email,
        name: item.name,
        role: item.role,
        createdAt: Timestamp.now(),
      });
      console.log(`Usuário ${item.name} (${item.role}) criado com sucesso!`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`O usuário ${item.email} já foi criado anteriormente.`);
      } else {
        console.error(`Erro ao criar ${item.email}:`, error.message || error);
      }
    }
  }

  console.log("\n==============================================");
  console.log("SUCESSO! O Banco de dados foi inicializado.");
  console.log("Contas criadas:");
  usersToCreate.forEach((u) => {
    console.log(`- ${u.name} [${u.role.toUpperCase()}]: ${u.email} (senha: ${u.password})`);
  });
  console.log("==============================================\n");
  process.exit(0);
}

run();
