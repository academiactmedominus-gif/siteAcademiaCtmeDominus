"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/authContext";
import { Menu, X, LogIn, LogOut, Dumbbell, User } from "lucide-react";

export const Header: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="header-nav">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", margin: 0, padding: 0 }}>
          <img
            src="/logo-ctme-dominus.png"
            alt="Academia CTME Dominus"
            style={{
              height: "65px",
              width: "auto",
              display: "block",
              margin: 0,
              padding: 0
            }}
          />
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-menu">
          <Link href="/" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Home
          </Link>
          <Link href="/#about" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Sobre
          </Link>
          <Link href="/#modalidades" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Modalidades
          </Link>
          <Link href="/blog" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Blog
          </Link>

          {/* User Auth Conditional Buttons */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link
                href={
                  role === "admin"
                    ? "/dashboard/admin"
                    : role === "teacher"
                      ? "/dashboard/professor"
                      : "/dashboard/aluno"
                }
                className="btn-outline"
                style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}
              >
                <User size={16} />
                Painel
              </Link>
              <button
                onClick={() => logout()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#EF4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary"
              style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}
            >
              <LogIn size={16} />
              Área do Aluno
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-toggle-btn"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            backgroundColor: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-color)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            zIndex: 99,
          }}
        >
          <Link href="/" onClick={() => setIsOpen(false)} style={{ textDecoration: "none", color: "#fff", fontWeight: 500 }}>
            Home
          </Link>
          <Link href="/#about" onClick={() => setIsOpen(false)} style={{ textDecoration: "none", color: "#fff", fontWeight: 500 }}>
            Sobre
          </Link>
          <Link href="/#modalidades" onClick={() => setIsOpen(false)} style={{ textDecoration: "none", color: "#fff", fontWeight: 500 }}>
            Modalidades
          </Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} style={{ textDecoration: "none", color: "#fff", fontWeight: 500 }}>
            Blog
          </Link>

          {user ? (
            <>
              <Link
                href={
                  role === "admin"
                    ? "/dashboard/admin"
                    : role === "teacher"
                      ? "/dashboard/professor"
                      : "/dashboard/aluno"
                }
                onClick={() => setIsOpen(false)}
                className="btn-outline"
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                <User size={16} />
                Painel
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <LogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              <LogIn size={16} />
              Área do Aluno
            </Link>
          )}
        </div>
      )}

      {/* CSS overrides for responsive header layout */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};
export default Header;
