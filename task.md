# Task List - Academia Dominus (CtmeDominus)

Checklist de implementação do sistema.

- [x] **Etapa 1: Configuração do Projeto e Firebase**
  - [x] Inicializar o projeto Next.js com Tailwind CSS (opcional, mas como a instrução global diz para usar CSS Vanilla para máximo controle ou Tailwind se solicitado, e a imagem tem classes bastante flexíveis, usaremos Vanilla CSS estruturado em `globals.css` ou CSS Modules para máxima flexibilidade).
  - [x] Configurar Firebase no projeto: inicializar cliente no arquivo `src/lib/firebase/config.ts`.
  - [x] Configurar as variáveis de ambiente `.env.local` com as credenciais do Firebase.
  - [x] Escrever as regras de segurança padrão do Firestore e Storage.

- [x] **Etapa 2: Layout e Design System (Seguindo o Template)**
  - [x] Configurar `src/app/globals.css` com paleta de cores Dark/Amarelo, tipografia Outfit/Inter, e resets globais.
  - [x] Implementar o componente `Header.tsx` (Navbar transparente responsiva com links e botão de Login).
  - [x] Implementar o componente `Footer.tsx` (Rodapé padrão com redes sociais e contatos).
  - [x] Criar o componente de botão flutuante `WhatsappCTA.tsx` direcionando para o número `+55 48 9914-4413`.

- [x] **Etapa 3: Páginas Públicas (Landing Page e Blog)**
  - [x] Desenvolver o componente `Hero.tsx` conforme imagem (texto destacado, 3 estatísticas e botões de CTA).
  - [x] Criar o ticker animado horizontal (marquise com velocidade controlada e fundo amarelo neon).
  - [x] Desenvolver a seção `About.tsx` com o mosaico de 3 imagens reais da academia e os 4 diferenciais.
  - [x] Implementar o grid de `Modalidades.tsx` apresentando as 3 modalidades com imagens da pasta `/images`.
  - [x] Desenvolver a listagem do blog em `src/app/blog/page.tsx`.
  - [x] Desenvolver o detalhe do post em `src/app/blog/[slug]/page.tsx`.

- [x] **Etapa 4: Autenticação e Autorização**
  - [x] Desenvolver a página de login em `src/app/login/page.tsx` usando Firebase Auth.
  - [x] Implementar middleware ou lógica de rota protegida para redirecionar usuários logados conforme sua função (`student`, `teacher`, `admin`).
  - [x] Criar hooks de sessão para recuperar os dados do usuário autenticado no Firestore.

- [x] **Etapa 5: Dashboard e Fichas de Treino**
  - [x] **Área do Aluno (`/dashboard/aluno`)**: Tela mobile-first listando a ficha de exercícios ativa com séries, repetições, máquina e cargas.
  - [x] **Área do Professor (`/dashboard/professor`)**: Painel de gerenciamento onde seleciona-se um aluno e prescreve-se treinos (inserir, alterar e excluir exercícios).
  - [x] **Área do Administrador (`/dashboard/admin`)**:
    - [x] CRUD de usuários: Cadastro de Professores e Alunos com a role associada.
    - [x] CRUD de Posts de Blog com upload direto no Firebase Storage para a imagem do post.

- [x] **Etapa 6: Verificação e Polimento**
  - [x] Testar fluxos de rotas protegidas e regras de segurança do Firestore.
  - [x] Verificar responsividade em telas de dispositivos móveis.
  - [x] Exportar dados iniciais/mock (posts do blog e usuários de demonstração) para o Firestore para facilidade de testes.
