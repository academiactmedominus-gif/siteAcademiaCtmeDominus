import React from "react";
import { ChevronRight, Dumbbell, Award, Flame, Shield, Users, Trophy, Heart } from "lucide-react";
import BlogSection from "@/components/BlogSection";

export default function HomePage() {
  const whatsappUrl = "https://wa.me/554899144413?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20planos%20da%20Academia%20Dominus.";

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
          <div style={{ maxWidth: "680px" }}>
            <h1 style={{ fontSize: "clamp(2.0rem, 4vw, 3.2rem)", lineHeight: "1.1", marginBottom: "1.5rem", textTransform: "uppercase", fontWeight: 900 }}>
              Seu corpo pode <span className="text-yellow">aguentar</span> quase tudo. É a sua <span className="text-yellow">mente</span> que precisa ser convencida.
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
              Ultrapasse seus limites com a melhor infraestrutura da região. Treinamentos personalizados de Musculação, aulas dinâmicas de Jiu-Jitsu e circuitos Multi-Funcionais focados nos seus resultados.
            </p>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem", borderLeft: "4px solid var(--primary-color)", paddingLeft: "1.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800 }}>1200+</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Alunos Ativos</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800 }}>12+</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Professores Certificados</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800 }}>10+</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Anos de Tradição</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Começar Agora <ChevronRight size={18} />
              </a>
              <a href="#modalidades" className="btn-outline">
                Modalidades
              </a>
            </div>
          </div>
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
          
          {/* Left Side: Mosaic Grid */}
          <div className="image-mosaic">
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

          {/* Right Side: Info Content */}
          <div>
            <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "inline-block", marginBottom: "0.75rem" }}>
              // SOBRE NÓS
            </span>
            <h2 style={{ fontSize: "2.5rem", lineHeight: "1.1", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 900 }}>
              Preparando você para atingir <span className="text-yellow">seus objetivos</span> de shape e saúde
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "2rem" }}>
              Na Academia Dominus, acreditamos que a atividade física vai além da estética: é um estilo de vida focado na disciplina, consistência e bem-estar. Nossa infraestrutura foi projetada para oferecer a melhor experiência, com equipamentos biomecanicamente avançados e professores focados na execução correta de cada movimento.
            </p>

            {/* Feature lists grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Users className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Profissionais</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Professores dedicados à sua técnica.</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Flame className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Alta Intensidade</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Treinos desafiadores para evolução.</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Award className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Equipamentos</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Aparelhos modernos e seguros.</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Shield className="text-yellow" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Segurança</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Foco na postura e integridade física.</p>
                </div>
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Mais Sobre Nós <ChevronRight size={18} />
            </a>
          </div>

        </div>
      </section>

      {/* 4. MODALIDADES SECTION */}
      <section id="modalidades" style={{ padding: "6rem 0 8rem 0", backgroundColor: "rgba(17,22,34,0.4)", borderTop: "1px solid var(--border-color)" }}>
        <div className="container">
          
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem auto" }}>
            <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "inline-block", marginBottom: "0.75rem" }}>
              // NOSSAS MODALIDADES
            </span>
            <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", fontWeight: 900, marginBottom: "1rem" }}>
              Treinos dinâmicos para sua evolução
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Selecione a atividade que melhor se adapta aos seus objetivos. Fale conosco no WhatsApp para agendar uma aula experimental.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="modalidades-showcase">
            
            {/* Musculação Card */}
            <div className="modalidade-item">
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
                  Treino de força, ganho de massa muscular, tonificação e reabilitação. Grade ampla de maquinário moderno e suporte técnico contínuo na sala de musculação.
                </p>
                <div className="modalidade-cta-wrap">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="modalidade-btn">
                    Consultar Preços
                  </a>
                </div>
              </div>
            </div>

            {/* Jiu-Jitsu Card */}
            <div className="modalidade-item">
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
            </div>

            {/* Multi-Funcional Card */}
            <div className="modalidade-item">
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
            </div>

          </div>
        </div>
      </section>

      {/* 5. BLOG SECTION */}
      <BlogSection />

    </div>
  );
}
