"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/firebase/authContext";
import { db } from "@/lib/firebase/config";
import {
  getAllUsers,
  createUserProfile,
  deleteUserProfile,
  getBlogPosts,
  UserProfile,
  BlogPost,
} from "@/lib/firebase/firestore";
import {
  Users,
  FileText,
  UserPlus,
  Plus,
  Trash2,
  Upload,
  Loader,
  Lock,
  Globe,
  Settings,
} from "lucide-react";

// Secondary Firebase Config to create users without logging current admin out
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "placeholder-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "placeholder-app-id",
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"users" | "blog">("users");

  // Users State
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "teacher" | "admin">("student");
  const [creatingUser, setCreatingUser] = useState(false);

  // Blog State
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postImageUrl, setPostImageUrl] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);

  // Toast notifications state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  // Custom confirmations state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmType, setDeleteConfirmType] = useState<"user" | "blog" | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "admin") {
        router.push("/dashboard");
      } else {
        loadUsersData();
        loadBlogData();
      }
    }
  }, [user, role, loading, router]);

  const loadUsersData = async () => {
    setLoadingUsers(true);
    const list = await getAllUsers();
    setUserList(list);
    setLoadingUsers(false);
  };

  const loadBlogData = async () => {
    setLoadingBlog(true);
    const list = await getBlogPosts();
    setBlogList(list);
    setLoadingBlog(false);
  };

  // Safe User Creation using Secondary App Instance
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || newUserPassword.length < 6) {
      showNotification("Por favor, preencha todos os campos. A senha deve conter pelo menos 6 caracteres.", "error");
      return;
    }

    setCreatingUser(true);
    try {
      // 1. Initialize secondary app to avoid logging out admin
      let secondaryApp;
      if (getApps().some(app => app.name === "SecondaryAuthApp")) {
        secondaryApp = getApp("SecondaryAuthApp");
      } else {
        secondaryApp = initializeApp(firebaseConfig, "SecondaryAuthApp");
      }
      
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create the user in Auth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newUserEmail.trim(),
        newUserPassword
      );
      const newUid = userCredential.user.uid;

      // 3. Create the user profile in Firestore (under the main app database)
      await createUserProfile(newUid, newUserEmail.trim(), newUserName.trim(), newUserRole);

      // 4. Reset forms and reload
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("student");
      
      await loadUsersData();
      showNotification(`Usuário ${newUserName} criado com sucesso!`, "success");
    } catch (err: any) {
      console.error(err);
      showNotification("Erro ao criar usuário: " + (err.message || err.code), "error");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === user?.uid) {
      showNotification("Você não pode deletar sua própria conta de administrador ativa.", "error");
      return;
    }

    try {
      await deleteUserProfile(uid);
      setUserList(userList.filter((u) => u.uid !== uid));
      showNotification("Usuário removido!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao remover usuário.", "error");
    }
  };

  // Blog creation with Storage Image Upload
  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postSlug.trim() || !postSummary.trim() || !postContent.trim()) {
      showNotification("Preencha todos os campos obrigatórios do post.", "error");
      return;
    }

    setCreatingPost(true);
    try {
      let finalImageUrl = postImageUrl || "/images/hero_bg.png";

      // Upload image to Vercel Blob via our API route
      if (postImageFile) {
        const formData = new FormData();
        formData.append("file", postImageFile);

        const res = await fetch("/api/blog/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Erro no upload para o Vercel Blob");
        }

        const blobData = await res.json();
        finalImageUrl = blobData.url;
      }

      // Save to Firestore
      const blogRef = collection(db, "blog");
      await addDoc(blogRef, {
        title: postTitle.trim(),
        slug: postSlug.trim().toLowerCase().replace(/\s+/g, "-"),
        summary: postSummary.trim(),
        content: postContent.trim(),
        imageUrl: finalImageUrl,
        author: user?.displayName || "Administrador",
        createdAt: Timestamp.now(),
      });

      // Clear Form
      setPostTitle("");
      setPostSlug("");
      setPostSummary("");
      setPostContent("");
      setPostImageFile(null);
      setPostImageUrl("");

      await loadBlogData();
      showNotification("Artigo publicado com sucesso no Blog!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao publicar artigo no blog.", "error");
    } finally {
      setCreatingPost(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blog", id));
      setBlogList(blogList.filter((p) => p.id !== id));
      showNotification("Artigo excluído do blog.", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao excluir artigo.", "error");
    }
  };

  const autoGenerateSlug = (title: string) => {
    setPostTitle(title);
    setPostSlug(
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // replace spaces with hyphens
    );
  };

  if (loading || (user && !role)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <Loader className="text-yellow animate-spin" size={40} />
      </div>
    );
  }

  if (user && role !== "admin") {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <Lock size={48} style={{ color: "#EF4444", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Acesso Restrito</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Apenas administradores têm acesso a esta área.</p>
        <button onClick={() => router.push("/login")} className="btn-primary">Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "3rem 0 6rem 0", minHeight: "80vh" }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ borderLeft: "4px solid var(--primary-color)", paddingLeft: "1.5rem", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="admin-header">
          <div>
            <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "block" }}>
              // CONSOLE DO ADMINISTRADOR
            </span>
            <h1 style={{ fontSize: "2.25rem", textTransform: "uppercase", fontWeight: 900 }}>
              Painel de Controle
            </h1>
          </div>
          
          {/* Tabs switch */}
          <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", padding: "0.4rem", borderRadius: "10px" }}>
            <button
              onClick={() => setActiveTab("users")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                backgroundColor: activeTab === "users" ? "var(--primary-color)" : "transparent",
                color: activeTab === "users" ? "#0A0D14" : "var(--text-muted)",
                transition: "all 0.2s",
              }}
            >
              <Users size={16} /> Usuários
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                backgroundColor: activeTab === "blog" ? "var(--primary-color)" : "transparent",
                color: activeTab === "blog" ? "#0A0D14" : "var(--text-muted)",
                transition: "all 0.2s",
              }}
            >
              <FileText size={16} /> Blog
            </button>
          </div>
        </div>

        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem" }} className="workspace-grid">
            
            {/* User creation form */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.75rem", height: "fit-content" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <UserPlus className="text-yellow" size={20} />
                <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", color: "#fff" }}>Novo Cadastro</h3>
              </div>

              <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Souza"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="aluno@exemplo.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Senha Inicial (mínimo 6 dígitos)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Acesso (Função)</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="form-input"
                    style={{ backgroundColor: "rgba(30,41,59,0.5)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="student" style={{ backgroundColor: "#111622" }}>Aluno</option>
                    <option value="teacher" style={{ backgroundColor: "#111622" }}>Professor</option>
                    <option value="admin" style={{ backgroundColor: "#111622" }}>Administrador</option>
                  </select>
                </div>

                <button type="submit" disabled={creatingUser} className="btn-primary" style={{ justifyContent: "center", width: "100%", padding: "0.8rem", borderRadius: "8px", marginTop: "0.5rem" }}>
                  {creatingUser ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
                  Cadastrar Usuário
                </button>
              </form>
            </div>

            {/* Users List */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.75rem" }}>
              <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", marginBottom: "1.5rem", color: "#fff" }}>Usuários Cadastrados</h3>
              
              {loadingUsers ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                  <Loader className="text-yellow animate-spin" size={32} />
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(10,13,20,0.3)" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Nome</th>
                        <th style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>E-mail</th>
                        <th style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Função</th>
                        <th style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", textAlign: "center" }}>Excluir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((usr) => (
                        <tr key={usr.uid} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#fff" }}>{usr.name}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>{usr.email}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.2rem 0.6rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                backgroundColor:
                                  usr.role === "admin"
                                    ? "rgba(239, 68, 68, 0.1)"
                                    : usr.role === "teacher"
                                    ? "rgba(59, 130, 246, 0.1)"
                                    : "rgba(var(--primary-rgb), 0.1)",
                                color:
                                  usr.role === "admin"
                                    ? "#F87171"
                                    : usr.role === "teacher"
                                    ? "#60A5FA"
                                    : "var(--primary-color)",
                              }}
                            >
                              {usr.role === "admin" ? "Admin" : usr.role === "teacher" ? "Professor" : "Aluno"}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                            {deleteConfirmId === usr.uid && deleteConfirmType === "user" ? (
                              <div style={{ display: "flex", gap: "0.25rem", justifyContent: "center" }}>
                                <button
                                  onClick={() => {
                                    handleDeleteUser(usr.uid);
                                    setDeleteConfirmId(null);
                                    setDeleteConfirmType(null);
                                  }}
                                  style={{ backgroundColor: "#EF4444", border: "none", padding: "0.2rem 0.4rem", borderRadius: "4px", color: "#fff", cursor: "pointer", fontSize: "0.7rem", fontWeight: "bold" }}
                                >
                                  Sim
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmId(null);
                                    setDeleteConfirmType(null);
                                  }}
                                  style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "none", padding: "0.2rem 0.4rem", borderRadius: "4px", color: "#fff", cursor: "pointer", fontSize: "0.7rem" }}
                                >
                                  Não
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setDeleteConfirmId(usr.uid);
                                  setDeleteConfirmType("user");
                                }}
                                disabled={usr.uid === user?.uid}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: usr.uid === user?.uid ? "var(--border-color)" : "#EF4444",
                                  cursor: usr.uid === user?.uid ? "not-allowed" : "pointer",
                                  padding: "0.25rem",
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: BLOG MANAGEMENT */}
        {activeTab === "blog" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }} className="workspace-grid">
            
            {/* Create Blog Post form */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <Globe className="text-yellow" size={20} />
                <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", color: "#fff" }}>Publicar Artigo</h3>
              </div>

              <form onSubmit={handleCreateBlogPost} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="form-group">
                  <label className="form-label">Título do Artigo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Guia de Alongamentos"
                    value={postTitle}
                    onChange={(e) => autoGenerateSlug(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slug URL amigável (gerado automaticamente)</label>
                  <input
                    type="text"
                    required
                    placeholder="ex-guia-de-alongamentos"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="form-input"
                    style={{ color: "var(--primary-color)", fontWeight: "bold" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Resumo do Artigo (Para a listagem)</label>
                  <input
                    type="text"
                    required
                    placeholder="Uma breve frase resumindo o tema do post..."
                    value={postSummary}
                    onChange={(e) => setPostSummary(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Conteúdo Completo (Quebras de parágrafo geram blocos de texto)</label>
                  <textarea
                    required
                    placeholder="Escreva aqui o artigo completo. Você pode usar ### para criar subtítulos ou iniciar linhas com - para listas..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="form-input"
                    rows={8}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label className="form-label">Imagem de Destaque (Upload)</label>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        backgroundColor: "rgba(30,41,59,0.3)",
                        border: "1px dashed var(--border-color)",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary-color)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                    >
                      <Upload size={16} />
                      {postImageFile ? postImageFile.name : "Selecionar Foto"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPostImageFile(e.target.files?.[0] || null)}
                        style={{ display: "none" }}
                      />
                    </label>
                    {postImageFile && (
                      <span style={{ fontSize: "0.75rem", color: "var(--primary-color)" }}>Imagem selecionada.</span>
                    )}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "0.25rem" }}>Se nenhuma foto for selecionada, o post usará uma imagem de fundo padrão da academia.</p>
                </div>

                <button type="submit" disabled={creatingPost} className="btn-primary" style={{ justifyContent: "center", width: "100%", padding: "0.8rem", borderRadius: "8px", marginTop: "0.5rem" }}>
                  {creatingPost ? <Loader className="animate-spin" size={18} /> : <Globe size={18} />}
                  Publicar Artigo
                </button>
              </form>
            </div>

            {/* Blog Posts list */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.75rem", height: "fit-content" }}>
              <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", marginBottom: "1.5rem", color: "#fff" }}>Posts no Blog</h3>
              
              {loadingBlog ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                  <Loader className="text-yellow animate-spin" size={32} />
                </div>
              ) : blogList.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>Nenhum artigo publicado ainda.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "650px", overflowY: "auto" }}>
                  {blogList.map((post) => (
                    <div
                      key={post.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "rgba(30,41,59,0.2)",
                      }}
                    >
                      <div style={{ overflow: "hidden", paddingRight: "1rem" }}>
                        <h4 style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 600, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</h4>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>/{post.slug}</p>
                      </div>
                      {deleteConfirmId === post.id && deleteConfirmType === "blog" ? (
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <button
                            onClick={() => {
                              handleDeletePost(post.id);
                              setDeleteConfirmId(null);
                              setDeleteConfirmType(null);
                            }}
                            style={{ backgroundColor: "#EF4444", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px", color: "#fff", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}
                          >
                            Sim
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmId(null);
                              setDeleteConfirmType(null);
                            }}
                            style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px", color: "#fff", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDeleteConfirmId(post.id);
                            setDeleteConfirmType("blog");
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "0.25rem",
                            flexShrink: 0,
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            backgroundColor: notification.type === "success" ? "#10B981" : "#EF4444",
            color: "#fff",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 600,
          }}>
            <span>{notification.message}</span>
          </div>
        )}

      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .workspace-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
