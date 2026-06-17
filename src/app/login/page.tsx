"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  const [initializing, setInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState("");

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  const handleInitializeTestAccounts = async () => {
    setInitializing(true);
    setError("");
    setInitMessage("");
    
    const usersToCreate = [
      {
        email: "admin@dominus.com",
        password: "admin123456",
        name: "Administrador Dominus",
        role: "admin",
      },
      {
        email: "professor@dominus.com",
        password: "professor123456",
        name: "Professor Teste",
        role: "teacher",
      },
      {
        email: "aluno@dominus.com",
        password: "aluno123456",
        name: "Aluno Teste",
        role: "student",
      },
    ];

    try {
      let createdCount = 0;
      let existCount = 0;

      for (const item of usersToCreate) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, item.email, item.password);
          await setDoc(doc(db, "users", cred.user.uid), {
            email: item.email,
            name: item.name,
            role: item.role,
            createdAt: new Date(),
          });
          createdCount++;
        } catch (err: any) {
          if (err.code === "auth/email-already-in-use") {
            try {
              const cred = await signInWithEmailAndPassword(auth, item.email, item.password);
              await setDoc(doc(db, "users", cred.user.uid), {
                email: item.email,
                name: item.name,
                role: item.role,
                createdAt: new Date(),
              }, { merge: true });
              await auth.signOut();
              existCount++;
            } catch (loginErr) {
              console.error("Erro ao verificar/atualizar perfil existente:", loginErr);
              existCount++;
            }
          } else {
            throw err;
          }
        }
      }
      
      setInitMessage(`Contas prontas: ${createdCount} criadas, ${existCount} atualizadas.`);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao inicializar contas de teste: " + (err.message || "Erro desconhecido"));
    } finally {
      setInitializing(false);
    }
  };

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
        const userData = userDocSnap.data();
        if (userData.disabled) {
          setError("Acesso desativado. Entre em contato com a administração.");
          await auth.signOut();
          setLoading(false);
          return;
        }
        const userRole = userData.role;
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

        {/* Test Accounts Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0 1rem 0", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
          <span>Acesso de Teste</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleQuickFill("admin@dominus.com", "admin123456")}
              className="test-account-btn admin-btn"
              style={{
                background: "rgba(212, 255, 0, 0.05)",
                border: "1px solid rgba(212, 255, 0, 0.2)",
                borderRadius: "8px",
                padding: "0.6rem 0.25rem",
                color: "#D4FF00",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center"
              }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("professor@dominus.com", "professor123456")}
              className="test-account-btn teacher-btn"
              style={{
                background: "rgba(6, 182, 212, 0.05)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "8px",
                padding: "0.6rem 0.25rem",
                color: "#06B6D4",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center"
              }}
            >
              Professor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("aluno@dominus.com", "aluno123456")}
              className="test-account-btn student-btn"
              style={{
                background: "rgba(168, 85, 247, 0.05)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                borderRadius: "8px",
                padding: "0.6rem 0.25rem",
                color: "#A855F7",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center"
              }}
            >
              Aluno
            </button>
          </div>
          
          <button
            type="button"
            onClick={handleInitializeTestAccounts}
            disabled={initializing}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.7rem",
              textDecoration: "underline",
              cursor: "pointer",
              textAlign: "center",
              marginTop: "0.25rem"
            }}
          >
            {initializing ? "Configurando contas..." : "Inicializar contas de teste no Firebase"}
          </button>
          {initMessage && (
            <div style={{ fontSize: "0.75rem", color: "#10B981", textAlign: "center", marginTop: "0.25rem" }}>
              {initMessage}
            </div>
          )}
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
        .test-account-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .test-account-btn:hover {
          transform: translateY(-2px);
        }
        .admin-btn:hover {
          background: rgba(212, 255, 0, 0.15) !important;
          border-color: rgba(212, 255, 0, 0.6) !important;
          box-shadow: 0 0 10px rgba(212, 255, 0, 0.2);
        }
        .teacher-btn:hover {
          background: rgba(6, 182, 212, 0.15) !important;
          border-color: rgba(6, 182, 212, 0.6) !important;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
        }
        .student-btn:hover {
          background: rgba(168, 85, 247, 0.15) !important;
          border-color: rgba(168, 85, 247, 0.6) !important;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
        }
      `}</style>
    </div>
  );
}
