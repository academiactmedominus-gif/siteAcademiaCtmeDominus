"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getBlogPostBySlug, BlogPost } from "@/lib/firebase/firestore";
import { ArrowLeft, Clock, User, Loader } from "lucide-react";

// Mirror of default posts for fallback display
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

export default function BlogPostDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const dbPost = await getBlogPostBySlug(slug);
      if (dbPost) {
        setPost(dbPost);
      } else {
        // Fallback to local default posts
        const defaultPost = DEFAULT_POSTS.find((p) => p.slug === slug);
        if (defaultPost) {
          setPost(defaultPost);
        } else {
          setPost(null);
        }
      }
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <Loader className="text-yellow animate-spin" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Artigo não encontrado</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>O artigo solicitado não existe ou foi removido.</p>
        <Link href="/blog" className="btn-primary">
          <ArrowLeft size={16} /> Voltar para o Blog
        </Link>
      </div>
    );
  }

  return (
    <article style={{ padding: "4rem 0 6rem 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Back navigation */}
        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "2rem", fontSize: "0.95rem" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary-color)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
          <ArrowLeft size={16} /> Voltar para a listagem
        </Link>

        {/* Article Meta */}
        <div style={{ display: "flex", gap: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <User size={14} className="text-yellow" />
            {post.author}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Clock size={14} className="text-yellow" />
            {post.createdAt.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1.15", textTransform: "uppercase", fontWeight: 900, marginBottom: "2rem", color: "#fff" }}>
          {post.title}
        </h1>

        {/* Featured Image */}
        <div style={{ position: "relative", height: "450px", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border-color)", marginBottom: "3rem" }}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Article Content */}
        <div className="article-content" style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#E2E8F0" }}>
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("###")) {
              return (
                <h3 key={index} style={{ fontSize: "1.6rem", color: "#fff", marginTop: "2rem", marginBottom: "1rem", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>
                  {paragraph.replace("###", "").trim()}
                </h3>
              );
            }
            if (paragraph.startsWith("-")) {
              return (
                <ul key={index} style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
                  {paragraph.split("\n").map((li, idx) => (
                    <li key={idx} style={{ marginBottom: "0.5rem" }}>
                      {li.replace("-", "").trim()}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} style={{ marginBottom: "1.5rem" }}>
                {paragraph}
              </p>
            );
          })}
        </div>

      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </article>
  );
}
