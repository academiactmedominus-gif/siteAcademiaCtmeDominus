"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/authContext";
import { Dumbbell, Lock, Mail, Loader, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "teacher") {
        router.push("/dashboard/professor");
      } else {
        router.push("/dashboard/aluno");
      }
    }
  }, [user, role, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const loggedUser = userCredential.user;

      // Fetch role
      const userDocRef = doc(db, "users", loggedUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userRole = userDocSnap.data().role;
        if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "teacher") {
          router.push("/dashboard/professor");
        } else {
          router.push("/dashboard/aluno");
        }
      } else {
        // Fallback or mismatch
        setError("Erro: Perfil de usuário não encontrado no banco de dados.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("E-mail ou senha incorretos. Por favor, tente novamente.");
      } else if (err.code === "auth/invalid-email") {
        setError("Formato de e-mail inválido.");
      } else {
        setError("Falha ao entrar: " + (err.message || "Erro desconhecido"));
      }
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <Loader className="text-yellow animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "75vh", padding: "2rem 1.5rem" }}>
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "420px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
        
        {/* Logo and header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "rgba(212, 255, 0, 0.1)", marginBottom: "1rem" }}>
            <Dumbbell size={28} className="text-yellow" />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>Área de Usuário</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Acesse sua conta para ver treinos ou gerenciar o sistema.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center", color: "#F87171", fontSize: "0.85rem" }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="email"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ width: "100%", paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "0.5rem" }}>
            <label className="form-label" htmlFor="password">Senha</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ width: "100%", paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.9rem", borderRadius: "8px", marginTop: "1rem" }}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

        </form>

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
    </div>
  );
}
