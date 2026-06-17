import React from "react";
import { Dumbbell, MapPin, Phone, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer-wrap">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>

        {/* Info Column */}
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <img
              src="/logo-ctme-dominus.png"
              alt="Academia CTME Dominus"
              style={{ height: "60px", width: "auto", display: "block", margin: 0, padding: 0 }}
            />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            Seu corpo aguenta quase tudo. É a sua mente que precisa ser convencida. Venha treinar na academia mais completa da região.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              href="https://www.instagram.com/ctmedominus/"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* Modalities Column */}
        <div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Modalidades
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            <li>Musculação</li>
            <li>Jiu-Jitsu</li>
            <li>Multi-Funcional</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Contato
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            <li style={{ display: "flex", gap: "0.5rem" }}>
              <Phone size={18} className="text-yellow" style={{ flexShrink: 0 }} />
              <span>+55 48 9914-4413</span>
            </li>
            <li style={{ display: "flex", gap: "0.5rem" }}>
              <MapPin size={18} className="text-yellow" style={{ flexShrink: 0 }} />
              <span>Rua Maria Geraldina Ramos, 271. Carianos, Florianópolis - SC, 88047-620</span>
            </li>
          </ul>
        </div>

        {/* Hours Column */}
        <div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Horários
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Clock size={16} className="text-yellow" />
              <span>Segunda a Sexta: 06:00 - 22:00</span>
            </li>
            <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Clock size={16} className="text-yellow" />
              <span>Sábado: 08:00 - 14:00</span>
            </li>
            <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Clock size={16} className="text-yellow" />
              <span>Domingo: Fechado</span>
            </li>
          </ul>
        </div>

      </div>

      <div style={{ borderTop: "1px solid rgba(30, 41, 59, 0.5)", paddingTop: "1.5rem", textAlign: "center", fontSize: "0.8rem", color: "#64748B" }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Academia Dominus. Todos os direitos reservados. Feito para alta performance.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
