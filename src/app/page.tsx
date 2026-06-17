"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Dumbbell, Award, Flame, Shield, Users, Trophy } from "lucide-react";
import BlogSection from "@/components/BlogSection";
import { motion, Variants } from "framer-motion";

// Animation variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 14 }
  }
};

export default function HomePage() {
  const whatsappUrl = "https://wa.me/554899144413?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20planos%20da%20Academia%20Dominus.";

  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { src: "/images/sobre/img (1).jpeg", alt: "Treino na Dominus", position: "center" },
    { src: "/images/sobre/img (2).jpeg", alt: "Musculação", position: "center" },
    { src: "/images/sobre/img (3).jpeg", alt: "Multi-Funcional", position: "center 75%" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: "6rem 0 4rem 0",
          backgroundImage: "linear-gradient(to bottom, rgba(10, 13, 20, 0.6) 0%, rgba(10, 13, 20, 0.8) 60%, rgba(10, 13, 20, 1) 100%), url('/images/hero_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
            style={{ maxWidth: "680px" }}
          >
            <motion.h1 
              variants={fadeInUp}
              style={{ fontSize: "clamp(2.0rem, 4vw, 3.2rem)", lineHeight: "1.1", marginBottom: "1.5rem", textTransform: "uppercase", fontWeight: 900 }}
            >
              Seu corpo pode <span className="text-yellow">aguentar</span> quase tudo. É a sua <span className="text-yellow">mente</span> que precisa ser convencida.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2.5rem" }}
            >
              Ultrapasse seus limites com a melhor infraestrutura da região. Treinamentos personalizados de Musculação, aulas dinâmicas de Jiu-Jitsu e circuitos Multi-Funcionais focados nos seus resultados.
            </motion.p>

            {/* Stats row */}
            <motion.div 
              variants={staggerContainer}
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem", borderLeft: "4px solid var(--primary-color)", paddingLeft: "1.5rem" }}
            >
              <motion.div variants={fadeInUp}>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800 }}>1200+</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Alunos Ativos</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800 }}>12+</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Professores Certificados</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800 }}>10+</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Anos de Tradição</p>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
            >
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Começar Agora <ChevronRight size={18} />
              </a>
              <a href="#modalidades" className="btn-outline">
                Modalidades
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. TICKER RUNNING BANNER */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker__group">
            <span className="ticker__item">✦ Musculação</span>
            <span className="ticker__item">✦ Jiu-Jitsu</span>
            <span className="ticker__item">✦ Treinamento Multi-Funcional</span>
            <span className="ticker__item">✦ Professores Qualificados</span>
            <span className="ticker__item">✦ Consulte Preços pelo WhatsApp</span>
            <span className="ticker__item">✦ Alta Performance</span>
          </div>
          <div className="ticker__group" aria-hidden="true">
            <span className="ticker__item">✦ Musculação</span>
            <span className="ticker__item">✦ Jiu-Jitsu</span>
            <span className="ticker__item">✦ Treinamento Multi-Funcional</span>
            <span className="ticker__item">✦ Professores Qualificados</span>
            <span className="ticker__item">✦ Consulte Preços pelo WhatsApp</span>
            <span className="ticker__item">✦ Alta Performance</span>
          </div>
        </div>
      </div>

      {/* 3. ABOUT US SECTION */}
      <section id="about" style={{ padding: "8rem 0", backgroundColor: "var(--bg-color)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center" }}>
          
          {/* Left Side: Mosaic on Desktop / Slider on Mobile */}
          <motion.div 
            className="about-image-container"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Desktop Mosaic Grid */}
            <div className="image-mosaic desktop-only">
              <div className="mosaic-main">
                <img
                  src="/images/sobre/img (1).jpeg"
                  alt="Treino na Dominus"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="mosaic-img"
                />
              </div>
              <div className="mosaic-sub1">
                <img
                  src="/images/sobre/img (2).jpeg"
                  alt="Musculação"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="mosaic-img"
                />
              </div>
              <div className="mosaic-sub2">
                <img
                  src="/images/sobre/img (3).jpeg"
                  alt="Multi-Funcional"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 80%" }}
                  className="mosaic-img"
                />
              </div>
            </div>

            {/* Mobile Image Slider */}
            <div className="mobile-slider mobile-only">
              <button 
                onClick={prevSlide} 
                className="slider-arrow prev-arrow" 
                aria-label="Slide anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="slider-viewport">
                <div 
                  className="slider-track" 
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <div className="slider-item" key={index}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="slider-img"
                        style={{ objectPosition: img.position }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={nextSlide} 
                className="slider-arrow next-arrow" 
                aria-label="Próximo slide"
              >
                <ChevronRight size={20} />
              </button>

              <div className="slider-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`slider-dot ${currentSlide === index ? "active" : ""}`}
                    aria-label={`Ir para o slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Info Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span 
              variants={fadeInUp}
              style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "inline-block", marginBottom: "0.75rem" }}
            >
              // SOBRE NÓS
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              style={{ fontSize: "2.5rem", lineHeight: "1.1", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 900 }}
            >
              Preparando você para atingir <span className="text-yellow">seus objetivos</span> de shape e saúde
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "2rem" }}
            >
              Na Academia Dominus, acreditamos que a atividade física vai além da estética: é um estilo de vida focado na disciplina, consistência e bem-estar. Nossa infraestrutura foi projetada para oferecer a melhor experiência, com equipamentos biomecanicamente avançados e professores focados na execução correta de cada movimento.
            </motion.p>

            {/* Feature lists grid */}
            <motion.div 
              variants={staggerContainer}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}
            >
              <motion.div variants={fadeInUp} style={{ display: "flex", gap: "0.75rem" }}>
                <Users className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Profissionais</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Professores dedicados à sua técnica.</p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} style={{ display: "flex", gap: "0.75rem" }}>
                <Flame className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Alta Intensidade</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Treinos desafiadores para evolução.</p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} style={{ display: "flex", gap: "0.75rem" }}>
                <Award className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Equipamentos</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Aparelhos modernos e seguros.</p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} style={{ display: "flex", gap: "0.75rem" }}>
                <Shield className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Segurança</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Foco na postura e integridade física.</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Mais Sobre Nós <ChevronRight size={18} />
              </a>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 4. MODALIDADES SECTION */}
      <section id="modalidades" style={{ padding: "6rem 0 8rem 0", backgroundColor: "rgba(17,22,34,0.4)", borderTop: "1px solid var(--border-color)" }}>
        <div className="container">
          
          <motion.div 
            style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem auto" }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "inline-block", marginBottom: "0.75rem" }}>
              // NOSSAS MODALIDADES
            </span>
            <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", fontWeight: 900, marginBottom: "1rem" }}>
              Treinos dinâmicos para sua evolução
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Selecione a atividade que melhor se adapta aos seus objetivos. Fale conosco no WhatsApp para agendar uma aula experimental.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div 
            className="modalidades-showcase"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            
            {/* Musculação Card */}
            <motion.div variants={scaleUp} className="modalidade-item">
              <img
                src="/images/musculacao.png"
                alt="Musculação"
                className="modalidade-item-img"
              />
              <div className="modalidade-content">
                <div className="modalidade-header">
                  <span className="modalidade-icon">
                    <Dumbbell size={22} />
                  </span>
                  <h3 className="modalidade-title">Musculação</h3>
                </div>
                <p className="modalidade-description">
                  Treino de força, ganho de masa muscular, tonificação e reabilitação. Grade ampla de maquinário moderno e suporte técnico contínuo na sala de musculação.
                </p>
                <div className="modalidade-cta-wrap">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="modalidade-btn">
                    Consultar Preços
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Jiu-Jitsu Card */}
            <motion.div variants={scaleUp} className="modalidade-item">
              <img
                src="/images/jiujitsu.png"
                alt="Jiu-Jitsu"
                className="modalidade-item-img"
              />
              <div className="modalidade-content">
                <div className="modalidade-header">
                  <span className="modalidade-icon">
                    <Trophy size={22} />
                  </span>
                  <h3 className="modalidade-title">Jiu-Jitsu</h3>
                </div>
                <p className="modalidade-description">
                  Arte suave voltada para defesa pessoal, condicionamento de alta intensidade, disciplina e tática mental. Treinos com tatame estruturado e professores graduados.
                </p>
                <div className="modalidade-cta-wrap">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="modalidade-btn">
                    Consultar Preços
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Multi-Funcional Card */}
            <motion.div variants={scaleUp} className="modalidade-item">
              <img
                src="/images/multifuncional.png"
                alt="Multi-Funcional"
                className="modalidade-item-img"
              />
              <div className="modalidade-content">
                <div className="modalidade-header">
                  <span className="modalidade-icon">
                    <Flame size={22} />
                  </span>
                  <h3 className="modalidade-title">Multi-Funcional</h3>
                </div>
                <p className="modalidade-description">
                  Aulas dinâmicas que unem agilidade, força, flexibilidade e capacidade cardiovascular. Exercícios integrados com cordas navais, kettlebells e peso corporal.
                </p>
                <div className="modalidade-cta-wrap">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="modalidade-btn">
                    Consultar Preços
                  </a>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 5. BLOG SECTION */}
      <BlogSection />

    </div>
  );
}
