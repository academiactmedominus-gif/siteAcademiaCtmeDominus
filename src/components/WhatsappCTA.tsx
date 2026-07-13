"use client";

import React from "react";

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
        backgroundColor: "#25D366",
        color: "#FFFFFF",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
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
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="currentColor"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.488 4.654 1.493 5.433-.002 9.85-4.388 9.853-9.782.002-2.614-1.011-5.07-2.854-6.914C16.4 2.106 13.937.9 11.329.9c-5.438 0-9.858 4.402-9.86 9.803-.001 1.814.49 3.582 1.42 5.161l-1.031 3.766 3.799-1.026zM17.65 14.93c-.27-.134-1.602-.79-1.85-.88-.25-.09-.43-.134-.61.134-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.134-1.14-.422-2.172-1.343-.803-.715-1.344-1.602-1.502-1.87-.16-.27-.015-.417.12-.55.123-.12.27-.315.405-.47.135-.157.18-.27.27-.45.09-.18.045-.337-.023-.472-.067-.134-.61-1.472-.835-2.013-.22-.53-.44-.457-.61-.466-.16-.008-.34-.01-.52-.01-.18 0-.47.067-.716.337-.246.27-.94.919-.94 2.241s.96 2.624 1.096 2.803c.135.18 1.889 2.886 4.577 4.047.639.277 1.138.44 1.528.564.643.205 1.228.176 1.69.108.514-.077 1.602-.656 1.828-1.259.226-.603.226-1.12.16-1.228-.067-.109-.247-.176-.517-.31zm0 0" />
      </svg>
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
