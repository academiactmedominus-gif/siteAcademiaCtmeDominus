"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export const WhatsappCTA: React.FC = () => {
  const phoneNumber = "554899144413";
  const message = "Olá! Gostaria de consultar os planos e preços da Academia Dominus.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        backgroundColor: "var(--primary-color)",
        color: "#0A0D14",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(var(--primary-rgb), 0.4)",
        zIndex: 999,
        transition: "all 0.3s ease",
        textDecoration: "none",
      }}
      className="whatsapp-float-btn"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1) translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
      }}
    >
      <MessageCircle size={32} style={{ fill: "#0A0D14" }} />
      <span className="tooltip-text">Fale Conosco</span>

      <style jsx>{`
        .whatsapp-float-btn {
          position: relative;
        }
        .tooltip-text {
          visibility: hidden;
          width: 120px;
          background-color: #1E293B;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 0;
          position: absolute;
          z-index: 1000;
          right: 75px;
          opacity: 0;
          transition: opacity 0.3s;
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .whatsapp-float-btn:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </a>
  );
};
export default WhatsappCTA;
