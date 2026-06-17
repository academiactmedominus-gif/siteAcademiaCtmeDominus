"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogPosts, BlogPost } from "@/lib/firebase/firestore";
import { Clock, User, ArrowRight, Loader } from "lucide-react";
import { motion, Variants } from "framer-motion";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 14 }
  }
};


const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Hipertrofia Eficiente: O Guia de Repetições e Carga",
    slug: "hipertrofia-eficiente-carga-e-repeticoes",
    summary: "Descubra como equilibrar o volume de treino, as séries e o peso ideal para maximizar o ganho de massa muscular na musculação.",
    content: "",
    imageUrl: "/images/musculacao.png",
    author: "Prof. Marcos Silva",
    createdAt: new Date("2026-06-10T10:00:00Z"),
  },
  {
    id: "2",
    title: "A Filosofia e os Benefícios do Jiu-Jitsu para o Cotidiano",
    slug: "filosofia-beneficios-jiu-jitsu",
    summary: "Entenda por que a arte suave é muito mais que autodefesa física: ela molda a mente, reduz o estresse e desenvolve foco inabalável.",
    content: "",
    imageUrl: "/images/jiujitsu.png",
    author: "Mestre Carlos Gracie",
    createdAt: new Date("2026-06-12T14:30:00Z"),
  },
  {
    id: "3",
    title: "Treinamento Funcional vs. Musculação: Qual escolher?",
    slug: "treinamento-funcional-vs-musculacao",
    summary: "Análise comparativa das duas modalidades para te ajudar a escolher a ideal de acordo com os seus objetivos pessoais de fitness.",
    content: "",
    imageUrl: "/images/multifuncional.png",
    author: "Profª. Aline Costa",
    createdAt: new Date("2026-06-15T09:15:00Z"),
  },
];

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const dbPosts = await getBlogPosts();
      if (dbPosts.length > 0) {
        // Show only the 3 most recent posts
        setPosts(dbPosts.slice(0, 3));
      } else {
        setPosts(DEFAULT_POSTS);
      }
      setLoading(false);
    }
    loadPosts();
  }, []);

  return (
    <section id="blog-section" style={{ padding: "6rem 0 8rem 0", backgroundColor: "var(--bg-color)" }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ borderLeft: "4px solid var(--primary-color)", paddingLeft: "1.5rem" }}>
            <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "block", marginBottom: "0.5rem" }}>
              // CONTEÚDO E DICAS
            </span>
            <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", fontWeight: 900 }}>
              Novidades do Nosso Blog
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Dicas de treinos, saúde e performance escritas por nossos especialistas.
            </p>
          </div>
          
          <Link href="/blog" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Ver Todos os Artigos <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <Loader className="text-yellow animate-spin" size={32} />
          </div>
        ) : (
          /* Cards Grid */
          <motion.div 
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {posts.map((post) => (
              <motion.article 
                key={post.id} 
                className="blog-card" 
                variants={scaleUp}
                style={{ display: "flex", flexDirection: "column", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden", transition: "all 0.25s ease" }}
              >
                <div style={{ position: "relative", height: "200px", width: "100%", borderBottom: "1px solid var(--border-color)" }}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  
                  {/* Meta items */}
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <User size={14} />
                      {post.author}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Clock size={14} />
                      {post.createdAt.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", color: "#fff", fontWeight: 700, lineHeight: 1.3, marginBottom: "0.75rem" }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem", flex: 1 }}>
                    {post.summary}
                  </p>

                  <Link href={`/blog/${post.slug}`} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--primary-color)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }} className="blog-link-hover">
                    Ler Artigo <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

      </div>
      
      {/* Hover animations style */}
      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-color) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .blog-link-hover {
          transition: transform 0.2s ease;
        }
        .blog-link-hover:hover {
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
    </section>
  );
};

export default BlogSection;
