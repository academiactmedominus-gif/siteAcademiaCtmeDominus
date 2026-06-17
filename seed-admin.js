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
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc, collection, addDoc, getDocs, query, where, Timestamp } = require("firebase/firestore");

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

  console.log("Conectando ao Firebase para obter UIDs...");
  const uids = {};

  for (const item of usersToCreate) {
    try {
      console.log(`Criando conta Auth para ${item.email}...`);
      const cred = await createUserWithEmailAndPassword(auth, item.email, item.password);
      uids[item.email] = cred.user.uid;
      console.log(`Conta Auth criada: ${item.email} (UID: ${cred.user.uid})`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`A conta Auth para ${item.email} já existe. Obtendo UID...`);
        const cred = await signInWithEmailAndPassword(auth, item.email, item.password);
        uids[item.email] = cred.user.uid;
        console.log(`Conta Auth verificada: ${item.email} (UID: ${cred.user.uid})`);
      } else {
        console.error(`Erro ao criar/verificar ${item.email}:`, error.message || error);
        throw error;
      }
    }
  }

  // Fazer login como Admin para ter privilégios de gravação
  console.log("\nAutenticando como Admin para gravar perfis e treinos no Firestore...");
  await signInWithEmailAndPassword(auth, "admin@dominus.com", "admin123456");
  console.log("Autenticado como Admin com sucesso!");

  // Gravar perfis
  console.log("\nGravando perfis de usuários no Firestore...");
  for (const item of usersToCreate) {
    const uid = uids[item.email];
    if (uid) {
      await setDoc(doc(db, "users", uid), {
        email: item.email,
        name: item.name,
        role: item.role,
        createdAt: Timestamp.now(),
      }, { merge: true });
      console.log(`Perfil no Firestore gravado para: ${item.name} (${item.role})`);
    }
  }

  // Gravar treinos
  const studentUid = uids["aluno@dominus.com"];
  const teacherUid = uids["professor@dominus.com"];
  if (studentUid && teacherUid) {
    console.log("\nGravando treinos de teste para o aluno...");
    const workoutsRef = collection(db, "workouts");
    
    // Limpar treinos antigos para evitar duplicação nas execuções consecutivas
    const q = query(workoutsRef, where("studentId", "==", studentUid));
    const snap = await getDocs(q);
    const { deleteDoc } = require("firebase/firestore");
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(db, "workouts", docSnap.id));
    }
    console.log("Treinos antigos do aluno limpos.");

    const sampleWorkouts = [
      {
        studentId: studentUid,
        teacherId: teacherUid,
        title: "Treino A - Membros Superiores (Peito, Tríceps e Ombros)",
        updatedAt: Timestamp.now(),
        exercises: [
          { name: "Supino Reto na Máquina", machine: "Máquina 04 (Articulado)", sets: 4, reps: "10-12", weight: "15kg cada lado" },
          { name: "Pec Deck / Voador", machine: "Máquina 08", sets: 3, reps: "12", weight: "40kg" },
          { name: "Desenvolvimento de Ombros", machine: "Halteres de Ferro", sets: 4, reps: "10", weight: "12kg cada" },
          { name: "Elevação Lateral", machine: "Halteres / Polia", sets: 3, reps: "12-15", weight: "8kg" },
          { name: "Tríceps Pulley", machine: "Polia Alta / Crossover", sets: 4, reps: "12", weight: "25kg" },
          { name: "Tríceps Testa com Barra", machine: "Banco Plano / Barra W", sets: 3, reps: "10", weight: "5kg cada lado" },
        ],
      },
      {
        studentId: studentUid,
        teacherId: teacherUid,
        title: "Treino B - Membros Inferiores (Quadríceps, Posterior e Panturrilha)",
        updatedAt: Timestamp.now(),
        exercises: [
          { name: "Leg Press 45º", machine: "Máquina 15", sets: 4, reps: "12", weight: "120kg total" },
          { name: "Cadeira Extensora", machine: "Máquina 11", sets: 4, reps: "10-12 (Pausa de 2s)", weight: "50kg" },
          { name: "Mesa Flexora", machine: "Máquina 12", sets: 4, reps: "12", weight: "30kg" },
          { name: "Cadeira Adutora", machine: "Máquina 14", sets: 3, reps: "15", weight: "45kg" },
          { name: "Panturrilha Sentado", machine: "Gêmeos Sentado", sets: 4, reps: "15-20", weight: "35kg" },
        ],
      }
    ];

    for (const w of sampleWorkouts) {
      await addDoc(workoutsRef, w);
      console.log(`Treino "${w.title}" semeado com sucesso!`);
    }
  }

  console.log("\n==============================================");
  console.log("SUCESSO! O Banco de dados foi totalmente inicializado.");
  console.log("Contas de teste configuradas com perfis e treinos.");
  console.log("==============================================\n");
  process.exit(0);
}

run().catch((err) => {
  console.error("Erro geral na execução do script:", err);
  process.exit(1);
});
