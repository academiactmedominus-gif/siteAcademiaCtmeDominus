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

const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection, addDoc, getDocs, Timestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const posts = [
  {
    title: "5 Dicas Essenciais para Iniciantes na Musculação",
    slug: "5-dicas-essenciais-iniciantes-musculacao",
    summary: "Começando agora? Descubra as melhores práticas de postura, frequência, progressão e descanso para evitar lesões e maximizar ganhos.",
    content: `Iniciar na musculação pode parecer intimidador devido à variedade de aparelhos e termos técnicos. Para garantir que seu começo seja seguro e eficiente, siga estas orientações fundamentais:

### 1. Foco Total na Execução Técnica
Antes de se preocupar com a carga, aprenda a executar o movimento corretamente. Executar um exercício com menos peso, mas amplitude total e técnica perfeita, ativa muito mais fibras musculares e previne lesões nas articulações.

### 2. Consistência é Melhor do que Intensidade Extrema
Ir à academia de 3 a 4 vezes por semana de forma consistente trará muito mais resultados a longo prazo do que ir 6 vezes na primeira semana com treinos exaustivos e desistir na segunda por dores intensas.

### 3. Não Subestime o Descanso
Os músculos não crescem durante o treino; eles se recuperam e hipertrofiam durante o descanso, principalmente no sono profundo. Durma de 7 a 8 horas por noite e dê pelo menos 48 horas de intervalo antes de treinar o mesmo grupo muscular novamente.

### 4. Mantenha um Diário de Treino
Anote os exercícios que realizou, as séries, repetições e a carga. A progressão de carga (aumentar gradualmente a dificuldade ao longo do tempo) é o motor da hipertrofia. Sem anotar, fica difícil saber se você está evoluindo.

### 5. Hidrate-se Adequadamente
Os músculos são compostos por cerca de 70% de água. Beber água de forma constante antes, durante e após os treinos é essencial para manter a força e o desempenho muscular no nível máximo.`,
    imageUrl: "/images/musculacao.png",
    author: "Prof. Marcos Silva",
  },
  {
    title: "Como o Jiu-Jitsu Melhora seu Foco e Disciplina Mental",
    slug: "como-jiu-jitsu-melhora-foco-disciplina-mental",
    summary: "Descubra como a prática da arte suave atua diretamente no controle do estresse e na capacidade de superação de desafios cotidianos.",
    content: `O Jiu-Jitsu Brasileiro é uma modalidade fantástica para quem busca aprender autodefesa e melhorar o condicionamento físico. Porém, o verdadeiro poder da "arte suave" reside nos impactos que ela gera no cérebro e na saúde mental do praticante.

### Resolução de Problemas sob Pressão
No tatame, cada combate é como uma partida de xadrez em alta velocidade, onde seu oponente está constantemente tentando te neutralizar. Sob pressão física e técnica, você é obrigado a manter a calma, respirar fundo e formular estratégias para sair de situações adversas. Essa habilidade traduz-se diretamente para o ambiente de trabalho e vida pessoal.

### O Desenvolvimento da Resiliência
No Jiu-Jitsu, você vai falhar e "bater" (desistir) dezenas de vezes nas primeiras aulas. Isso ensina que o erro não é o fim, mas sim uma etapa essencial do aprendizado. A prática constante nos torna resilientes, desenvolvendo a persistência para superar qualquer desafio cotidiano.

### Foco Inabalável e Redução de Ansiedade
Durante os 60 a 90 minutos de treino, você deve estar 100% focado no aqui e agora. Qualquer distração pode custar uma finalização. Esse nível extremo de presença age como uma meditação ativa, desligando a mente dos problemas do dia a dia e reduzindo drasticamente os níveis de ansiedade e estresse.`,
    imageUrl: "/images/jiujitsu.png",
    author: "Mestre Carlos Gracie",
  },
  {
    title: "Os Benefícios do Treinamento Funcional para o Dia a Dia",
    slug: "beneficios-treinamento-funcional-dia-a-dia",
    summary: "Entenda como trabalhar movimentos naturais do corpo melhora sua postura, flexibilidade e previne dores nas tarefas cotidianas.",
    content: `Diferente da musculação tradicional, que muitas vezes isola os músculos em aparelhos específicos, o treinamento funcional trabalha o corpo de forma integrada. O objetivo principal é aprimorar a capacidade de realizar movimentos naturais que utilizamos no cotidiano, como agachar, empurrar, puxar e rotacionar.

### Fortalecimento do Core e Prevenção de Dores
A maioria dos exercícios funcionais exige estabilização constante do abdômen e da região lombar (o core). Esse fortalecimento ajuda a melhorar significativamente a postura e atua diretamente na prevenção e alívio de dores nas costas causadas por longas horas de trabalho sentado.

### Agilidade e Equilíbrio
Ao realizar circuitos dinâmicos com kettlebells, cordas navais e peso corporal, o corpo desenvolve coordenação motora fina, senso de equilíbrio e agilidade de reação física. É um treino que te torna mais apto para a vida prática, seja para carregar compras pesadas ou praticar outros esportes.

### Alta Queima Calórica e Condicionamento
Os treinos funcionais são estruturados em circuitos de alta intensidade (HIIT). Esse formato eleva a frequência cardíaca de forma rápida e sustentada, impulsionando o metabolismo e gerando uma queima de gordura muito eficiente tanto durante quanto horas após o término da sessão.`,
    imageUrl: "/images/multifuncional.png",
    author: "Profª. Aline Costa",
  },
  {
    title: "Alimentação Pré e Pós-Treino: Guia Simples e Eficiente",
    slug: "alimentacao-pre-pos-treino-guia-simples-eficiente",
    summary: "Saiba o que consumir antes e depois de exercitar-se para garantir energia máxima durante as séries e uma rápida recuperação muscular.",
    content: `O treino estimula os músculos, mas a nutrição é a verdadeira responsável por fornecer energia para o desempenho e substrato para a reconstrução muscular. Ajustar o que você consome antes e depois da atividade física pode mudar completamente os seus resultados.

### O Pré-Treino: Foco em Energia
O objetivo do pré-treino é garantir que você não falte energia no meio da sessão e evite a queda de rendimento. O ideal é focar em carboidratos complexos de fácil digestão, acompanhados de uma dose moderada de proteínas:
- **Refeição sólida (1h30 a 2h antes):** Batata-doce ou arroz integral com peito de frango grelhado.
- **Lanche rápido (30 a 45 minutos antes):** Uma banana com aveia e mel, ou torradas de pão integral com pasta de amendoim.

### O Pós-Treino: Foco em Recuperação e Reconstrução
Após o esforço físico, seus músculos precisam de nutrientes rápidos para iniciar a síntese proteica e repor as reservas de glicogênio (energia estocada). A combinação ideal envolve proteínas de rápida absorção e carboidratos simples:
- **Lanche pós-treino imediato:** Shake de whey protein com dextrose ou uma fruta (como banana ou uva).
- **Refeição sólida pós-treino (1h a 2h depois):** Arroz branco com filé de carne vermelha magra ou peixe e salada colorida.

Lembre-se sempre de ajustar as quantidades às suas necessidades individuais com o suporte de um nutricionista.`,
    imageUrl: "/images/musculacao.png",
    author: "Nutricionista Julia Ramos",
  },
];

async function seed() {
  console.log("Autenticando como Administrador...");
  try {
    // Fazer login como admin
    await signInWithEmailAndPassword(auth, "admin@dominus.com", "admin123456");
    console.log("Autenticação realizada com sucesso!");

    console.log("Conectando ao Firestore...");
    const blogRef = collection(db, "blog");
    
    // Limpar posts antigos para evitar duplicação
    const { deleteDoc, doc } = require("firebase/firestore");
    const existingSnap = await getDocs(blogRef);
    if (existingSnap.size > 0) {
      console.log(`Coleção 'blog' já possui ${existingSnap.size} posts. Limpando posts antigos...`);
      for (const docSnap of existingSnap.docs) {
        await deleteDoc(doc(db, "blog", docSnap.id));
      }
      console.log("Posts antigos limpos.");
    }

    for (const post of posts) {
      const docData = {
        ...post,
        createdAt: Timestamp.now(),
      };
      const added = await addDoc(blogRef, docData);
      console.log(`Post criado com ID: ${added.id} (${post.title})`);
    }
    console.log("Todos os 4 posts de demonstração foram semeados com sucesso!");
  } catch (error) {
    console.error("Erro ao semear blog:", error);
  }
  process.exit(0);
}

seed();
