# Product Requirement Document (PRD) - Academia Dominus (CtmeDominus)

Este documento define os requisitos de produto para o website da Academia Dominus, englobando a área pública, o blog institucional, a área restrita do aluno e o painel administrativo.

---

## 1. Visão Geral do Produto
A Academia Dominus necessita de um website moderno, dinâmico e seguro para atrair novos clientes (leads) e melhorar a experiência dos alunos atuais. O site deve contar com um design premium no tema escuro (Dark) com detalhes em amarelo, e conter um portal interno para alunos visualizarem seus treinos prescritos por professores.

### Objetivos do Negócio
- **Geração de Leads**: Direcionar visitantes interessados para o WhatsApp da academia para consulta de preços.
- **Retenção de Alunos**: Proporcionar uma interface simples e moderna para que alunos acessem suas fichas de treino pelo celular.
- **Presença Digital**: Publicar artigos informativos e dicas de treino/nutrição via blog para melhorar o SEO.
- **Custo Zero de Infraestrutura**: Utilizar a Vercel e o Firebase em suas modalidades gratuitas, garantindo que o banco de dados permaneça sempre ativo (sem pausas automáticas de inatividade).

---

## 2. Personas e Acesso
O sistema terá três níveis principais de acesso de usuário, além do público visitante:

| Papel | Descrição | Permissões |
| :--- | :--- | :--- |
| **Visitante** (Público) | Usuário não autenticado buscando informações sobre a academia ou lendo o blog. | Ver landing page, ler blog, clicar no CTA do WhatsApp. |
| **Aluno** | Cliente da academia autenticado. | Visualizar os treinos ativos prescritos para si (máquinas, séries, repetições). |
| **Professor** | Funcionário da academia responsável pela prescrição técnica de treinos. | Visualizar alunos, cadastrar, editar e excluir treinos para os alunos. |
| **Administrador** | Proprietário ou gerente da academia com controle total do site. | Tudo o que o Professor faz + gerenciar usuários (adicionar/remover alunos/professores) e criar/editar/deletar posts no blog. |

---

## 3. Requisitos Funcionais (RF)

### 3.1. Landing Page Pública (Área Institucional)
- **RF001**: O site deve ter um tema Dark refinado, com cor primária amarela, tipografia moderna e animações sutis.
- **RF002**: Exibição em destaque das três modalidades: **Musculação**, **Jiu-Jitsu** e **Multi-Funcional** com fotos reais da academia.
- **RF003**: Inexistência de preços públicos no site. Toda a precificação deve ser consultada através do **WhatsApp CTA** (+55 48 9914-4413), que deve estar fixo/visível no layout.
- **RF004**: Galeria responsiva usando as imagens reais da academia presentes na pasta `/images`.

### 3.2. Blog
- **RF005**: Lista pública de artigos/posts ordenados por data de publicação.
- **RF006**: Detalhe de cada artigo contendo título, conteúdo rico (markdown/HTML), autor, data e imagem destacada.
- **RF007**: Painel administrativo (para o Administrador) para Criar, Ler, Atualizar e Deletar (CRUD) artigos do blog, incluindo upload da imagem de destaque.

### 3.3. Autenticação e Usuários
- **RF008**: Login seguro usando e-mail e senha gerenciado via Firebase Auth.
- **RF009**: Controle de acesso por rotas com base em papéis (Roles: Aluno, Professor, Administrador).
- **RF010**: Cadastro de novos usuários feito apenas por Administradores no painel (para evitar cadastros públicos indevidos).

### 3.4. Gestão e Visualização de Treinos
- **RF011**: O Aluno deve visualizar uma lista clara de seus treinos prescritos (Exemplo: Treino A, Treino B) contendo os exercícios, o nome da máquina/equipamento, número de séries e quantidade de repetições.
- **RF012**: O Professor deve ter um painel para selecionar um Aluno e prescrever novos treinos (adicionar exercícios com nome da máquina, séries e repetições) ou alterar os existentes.
- **RF013**: O Aluno não pode alterar seus treinos, apenas marcá-los como visualizados/concluídos.

---

## 4. Requisitos Não Funcionais (RNF)

- **RNF001 - Responsividade**: O site deve ser totalmente mobile-first. Alunos usarão o celular no meio do treino para olhar a ficha.
- **RNF002 - Segurança**: Proteção contra injeção de dados e acesso não autorizado. As regras de segurança do Firestore devem proibir que Alunos leiam treinos de outros alunos ou criem/modifiquem dados.
- **RNF003 - Stack Sem Custo (100% Free)**:
  - Frontend: **Next.js** (App Router) hospedado na **Vercel** (Plano Free).
  - Database: **Firebase Firestore** (plano Spark) - sem suspensão do banco de dados por inatividade.
  - Auth: **Firebase Authentication**.
  - Storage: **Firebase Cloud Storage** para as imagens de postagens de blog.
- **RNF004 - Performance**: Carregamento rápido da página inicial e imagens otimizadas pelo componente `<Image>` do Next.js.
- **RNF005 - SEO**: Uso correto de tags semânticas HTML5, metadados dinâmicos e carregamento otimizado de fontes.

---

## 5. Limitações e Regras de Negócio
- Não haverá checkout ou pagamento online no site.
- Nenhuma informação de preço ou planos deve ser mencionada no código ou nos textos.
- Cadastro de Alunos e Professores é restrito ao painel administrativo. Não haverá botão "Cadastre-se" na área pública.
