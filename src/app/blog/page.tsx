"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, BlogPost } from "@/lib/firebase/firestore";
import { Clock, User, ArrowRight, Loader } from "lucide-react";

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Hipertrofia Eficiente: O Guia de Repetições e Carga",
    slug: "hipertrofia-eficiente-carga-e-repeticoes",
    summary: "Descubra como equilibrar o volume de treino, as séries e o peso ideal para maximizar o ganho de massa muscular na musculação.",
    content: `A hipertrofia muscular é o objetivo da maioria dos praticantes de musculação. Porém, muitos se perdem no planejamento de quantas repetições fazer e qual carga utilizar. 

### O Estímulo de Tensão Mecânica
A tensão mecânica é o principal fator para a sinalização hipertrófica. Isso significa que você precisa levantar pesos que desafiem seus músculos. Fazer repetições excessivas (acima de 20) com pesos muito leves estimula mais a resistência do que a hipertrofia propriamente dita.

### A Faixa Ideal de Repetições
Estudos modernos de fisiologia mostram que a hipertrofia pode ocorrer em uma ampla faixa de repetições (de 6 a 15 repetições), desde que a série seja levada próxima à falha muscular (cerca de 1 a 2 repetições de reserva).
- **6 a 8 repetições**: Foco maior em ganho de força e tensão mecânica.
- **10 a 12 repetições**: O "ponto doce" clássico, equilibrando tensão mecânica e estresse metabólico.
- **12 a 15 repetições**: Foco em pump e acúmulo de metabólitos.

### Conclusão
Não existe um número mágico. O mais eficiente é variar as faixas de repetições no seu treino e, acima de tudo, manter a progressão de carga (aumentar gradualmente o peso ou as repetições ao longo das semanas) mantendo a execução perfeita do exercício.`,
    imageUrl: "/images/musculacao.png",
    author: "Prof. Marcos Silva",
    createdAt: new Date("2026-06-10T10:00:00Z"),
  },
  {
    id: "2",
    title: "A Filosofia e os Benefícios do Jiu-Jitsu para o Cotidiano",
    slug: "filosofia-beneficios-jiu-jitsu",
    summary: "Entenda por que a arte suave é muito mais que autodefesa física: ela molda a mente, reduz o estresse e desenvolve foco inabalável.",
    content: `O Jiu-Jitsu Brasileiro (BJJ), carinhosamente conhecido como a "arte suave", é um esporte de combate focado em alavancas, pressões e finalizações no solo. Mas os maiores benefícios ocorrem fora do tatame.

### Controle Mental sob Pressão
No tatame, você é constantemente colocado em posições desconfortáveis e sob pressão física. Aprender a respirar, raciocinar e encontrar saídas em situações difíceis no treino traduz-se perfeitamente para o estresse do trabalho e da vida cotidiana. Você passa a reagir com calma às adversidades.

### Disciplina e Humildade
O Jiu-Jitsu é um eterno aprendizado. Independentemente da sua faixa, sempre haverá técnicas a aprimorar. Isso gera uma mentalidade de constante evolução (growth mindset) e um profundo respeito pelo próximo.

### Condicionamento Físico Completo
Um treino de Jiu-Jitsu de 60 minutos consome até 800 calorias, trabalhando intensamente a força do core, flexibilidade, equilíbrio e resistência cardiovascular. É uma excelente alternativa para quem busca queimar gordura de forma dinâmica.`,
    imageUrl: "/images/jiujitsu.png",
    author: "Mestre Carlos Gracie",
    createdAt: new Date("2026-06-12T14:30:00Z"),
  },
  {
    id: "3",
    title: "Treinamento Funcional vs. Musculação: Qual escolher?",
    slug: "treinamento-funcional-vs-musculacao",
    summary: "Análise comparativa das duas modalidades para te ajudar a escolher a ideal de acordo com os seus objetivos pessoais de fitness.",
    content: `A dúvida entre praticar musculação tradicional ou treinamento funcional é muito comum. Ambas as modalidades são excelentes, mas possuem focos e dinâmicas distintas.

### Musculação: Foco em Força e Isolamento
A musculação trabalha de forma mais isolada os grupos musculares. É a modalidade padrão ouro para:
- Hipertrofia direcionada (desenhar o shape).
- Correção de assimetrias musculares.
- Aumento de força máxima absoluta.

### Treinamento Funcional: Foco em Movimento e Integração
O funcional foca em movimentos naturais do corpo humano (agachar, empurrar, puxar, girar) e trabalha vários grupos musculares integrados na mesma sessão. É ideal para:
- Ganho de agilidade e coordenação motora.
- Condicionamento cardiovascular dinâmico.
- Queima calórica elevada em curto espaço de tempo.

### Qual escolher?
A melhor escolha depende dos seus objetivos. Se você busca ganho de massa muscular bruto e definição muscular específica, a musculação é a resposta. Se prefere treinos variados, alta intensidade cardiovascular e melhora da performance do corpo no dia a dia, opte pelo multi-funcional. O melhor de tudo? Você pode conciliar ambos na Academia Dominus!`,
    imageUrl: "/images/multifuncional.png",
    author: "Profª. Aline Costa",
    createdAt: new Date("2026-06-15T09:15:00Z"),
  },
];

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const dbPosts = await getBlogPosts();
      if (dbPosts.length > 0) {
        setPosts(dbPosts);
      } else {
        setPosts(DEFAULT_POSTS);
      }
      setLoading(false);
    }
    loadPosts();
  }, []);

  return (
    <div style={{ padding: "4rem 0 6rem 0", minHeight: "80vh" }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ borderLeft: "4px solid var(--primary-color)", paddingLeft: "1.5rem", marginBottom: "4rem" }}>
          <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "block", marginBottom: "0.5rem" }}>
            // NOSSO BLOG
          </span>
          <h1 style={{ fontSize: "3rem", textTransform: "uppercase", fontWeight: 900 }}>
            Dicas de Saúde, Treino e Alta Performance
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px" }}>
            Fique por dentro das melhores orientações dos nossos professores para acelerar os seus resultados.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <Loader className="text-yellow animate-spin" size={40} />
          </div>
        ) : (
          /* Grid list of posts */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-img-wrap">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className="meta-item">
                      <User size={14} />
                      {post.author}
                    </span>
                    <span className="meta-item">
                      <Clock size={14} />
                      {post.createdAt.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-summary">{post.summary}</p>
                  
                  <Link href={`/blog/${post.slug}`} className="blog-link">
                    Ler Artigo <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      <style jsx>{`
        .blog-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-color);
        }
        .blog-img-wrap {
          position: relative;
          height: 200px;
          width: 100%;
          border-bottom: 1px solid var(--border-color);
        }
        .blog-body {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .blog-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .blog-title {
          font-size: 1.25rem;
          line-height: 1.3;
          margin-bottom: 0.75rem;
          color: #fff;
          font-weight: 700;
        }
        .blog-summary {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .blog-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--primary-color);
          text-decoration: none;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          transition: transform 0.2s ease;
        }
        .blog-link:hover {
          transform: translateX(3px);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
