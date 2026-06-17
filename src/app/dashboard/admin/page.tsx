"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/firebase/authContext";
import { db } from "@/lib/firebase/config";
import {
  getAllUsers,
  createUserProfile,
  deleteUserProfile,
  getBlogPosts,
  UserProfile,
  BlogPost,
  getAllStudents,
  getStudentWorkouts,
  saveStudentWorkout,
  deleteWorkout,
  Workout,
  Exercise,
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
  Eye,
  Edit2,
  UserX,
  UserCheck,
  Search,
  Dumbbell,
  Save,
  User as UserIcon,
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

  const [activeTab, setActiveTab] = useState<"users" | "blog" | "workouts">("users");

  // Users State
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "teacher" | "admin">("student");
  const [creatingUser, setCreatingUser] = useState(false);

  // User Editing State
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserUid, setEditingUserUid] = useState<string | null>(null);

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

  // Workouts (Prescrição) Tab State
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [workoutTitle, setWorkoutTitle] = useState("Treino A");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [deleteWorkoutConfirmId, setDeleteWorkoutConfirmId] = useState<string | null>(null);

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
        loadStudentsData();
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

  const loadStudentsData = async () => {
    setLoadingStudents(true);
    const list = await getAllStudents();
    setStudents(list);
    setLoadingStudents(false);
  };

  // Safe User Creation using Secondary App Instance
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showNotification("Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    if (!isEditingUser && newUserPassword.length < 6) {
      showNotification("A senha inicial deve conter pelo menos 6 caracteres.", "error");
      return;
    }

    setCreatingUser(true);
    try {
      if (isEditingUser && editingUserUid) {
        // Edit User in Firestore
        await updateDoc(doc(db, "users", editingUserUid), {
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
        });

        // Update local state
        setUserList(userList.map(u => u.uid === editingUserUid ? { ...u, name: newUserName.trim(), email: newUserEmail.trim(), role: newUserRole } : u));
        
        // Reset and notify
        cancelEditUser();
        showNotification("Usuário atualizado com sucesso!", "success");
      } else {
        // Create User
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

        // 3. Create the user profile in Firestore
        await createUserProfile(newUid, newUserEmail.trim(), newUserName.trim(), newUserRole);

        // 4. Reset forms and reload
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("student");
        
        await loadUsersData();
        showNotification(`Usuário ${newUserName} criado com sucesso!`, "success");
      }
    } catch (err: any) {
      console.error(err);
      showNotification("Erro ao processar usuário: " + (err.message || err.code), "error");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleEditUser = (usr: UserProfile) => {
    setIsEditingUser(true);
    setEditingUserUid(usr.uid);
    setNewUserName(usr.name);
    setNewUserEmail(usr.email);
    setNewUserRole(usr.role);
    setNewUserPassword(""); // Clear password field
  };

  const cancelEditUser = () => {
    setIsEditingUser(false);
    setEditingUserUid(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("student");
  };

  const handleToggleUserStatus = async (usr: UserProfile) => {
    if (usr.uid === user?.uid) {
      showNotification("Você não pode desativar sua própria conta de administrador ativa.", "error");
      return;
    }
    const newStatus = !usr.disabled;
    try {
      await updateDoc(doc(db, "users", usr.uid), { disabled: newStatus });
      setUserList(userList.map(u => u.uid === usr.uid ? { ...u, disabled: newStatus } : u));
      showNotification(`Acesso de ${usr.name} ${newStatus ? "desativado" : "ativado"}!`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao alterar status do usuário.", "error");
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

      const adminName = userList.find(u => u.uid === user?.uid)?.name || "Administrador";

      // Save to Firestore
      const blogRef = collection(db, "blog");
      await addDoc(blogRef, {
        title: postTitle.trim(),
        slug: postSlug.trim().toLowerCase().replace(/\s+/g, "-"),
        summary: postSummary.trim(),
        content: postContent.trim(),
        imageUrl: finalImageUrl,
        author: adminName,
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

  // --- WORKOUT MANAGEMENT METHODS ---
  const handleSelectStudent = async (student: UserProfile) => {
    setSelectedStudent(student);
    setLoadingWorkouts(true);
    setIsEditingWorkout(false);
    setActiveWorkoutId(null);
    const studentWorkouts = await getStudentWorkouts(student.uid);
    setWorkouts(studentWorkouts);
    setLoadingWorkouts(false);
  };

  const handleStartNewWorkout = () => {
    setActiveWorkoutId(null);
    setWorkoutTitle("Treino " + (workouts.length === 0 ? "A" : String.fromCharCode(65 + workouts.length)));
    setExercises([{ name: "", machine: "", sets: 3, reps: "10-12", weight: "" }]);
    setIsEditingWorkout(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setActiveWorkoutId(workout.id);
    setWorkoutTitle(workout.title);
    setExercises([...workout.exercises]);
    setIsEditingWorkout(true);
  };

  const handleAddExerciseRow = () => {
    setExercises([...exercises, { name: "", machine: "", sets: 3, reps: "10-12", weight: "" }]);
  };

  const handleRemoveExerciseRow = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleExerciseChange = (idx: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[idx] = {
      ...updated[idx],
      [field]: field === "sets" ? Number(value) : value,
    };
    setExercises(updated);
  };

  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !user) return;
    if (exercises.length === 0) {
      showNotification("Adicione pelo menos um exercício na ficha.", "error");
      return;
    }

    setSavingWorkout(true);
    try {
      await saveStudentWorkout(activeWorkoutId, selectedStudent.uid, user.uid, workoutTitle.trim(), exercises);
      
      const updated = await getStudentWorkouts(selectedStudent.uid);
      setWorkouts(updated);
      setIsEditingWorkout(false);
      setActiveWorkoutId(null);
      showNotification("Treino salvo com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao salvar treino.", "error");
    } finally {
      setSavingWorkout(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w.id !== id));
      if (activeWorkoutId === id) {
        setIsEditingWorkout(false);
        setActiveWorkoutId(null);
      }
      showNotification("Treino excluído!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao excluir treino.", "error");
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

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
            <button
              onClick={() => setActiveTab("workouts")}
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
                backgroundColor: activeTab === "workouts" ? "var(--primary-color)" : "transparent",
                color: activeTab === "workouts" ? "#0A0D14" : "var(--text-muted)",
                transition: "all 0.2s",
              }}
            >
              <Dumbbell size={16} /> Treinos
            </button>
          </div>
        </div>

        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem" }} className="workspace-grid">
            
            {/* User creation/edit form */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.75rem", height: "fit-content" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <UserPlus className="text-yellow" size={20} />
                <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", color: "#fff" }}>
                  {isEditingUser ? "Editar Cadastro" : "Novo Cadastro"}
                </h3>
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

                {!isEditingUser ? (
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
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", border: "1px dashed var(--border-color)", padding: "0.75rem", borderRadius: "6px" }}>
                    <strong>Nota sobre a Senha:</strong> A alteração direta da senha de outros usuários não é permitida pelo SDK de cliente do Firebase. Caso o usuário esqueça sua credencial, utilize a opção de recriação de conta ou reenvio de e-mail de redefinição de senha.
                  </div>
                )}

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

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {isEditingUser && (
                    <button type="button" onClick={cancelEditUser} className="btn-outline" style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", justifyContent: "center" }}>
                      Cancelar
                    </button>
                  )}
                  <button type="submit" disabled={creatingUser} className="btn-primary" style={{ flex: 2, justifyContent: "center", padding: "0.8rem", borderRadius: "8px" }}>
                    {creatingUser ? <Loader className="animate-spin" size={18} /> : (isEditingUser ? <Save size={18} /> : <Plus size={18} />)}
                    {isEditingUser ? "Salvar Alterações" : "Cadastrar Usuário"}
                  </button>
                </div>
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
                        <th style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", textAlign: "center" }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((usr) => (
                        <tr key={usr.uid} style={{ borderBottom: "1px solid var(--border-color)", opacity: usr.disabled ? 0.5 : 1 }}>
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
                          <td style={{ padding: "0.75rem 1rem" }}>
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
                              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
                                {/* Toggle Active/Deactive */}
                                <button
                                  onClick={() => handleToggleUserStatus(usr)}
                                  disabled={usr.uid === user?.uid}
                                  title={usr.disabled ? "Ativar Acesso" : "Desativar Acesso"}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: usr.uid === user?.uid ? "var(--border-color)" : (usr.disabled ? "#EF4444" : "#10B981"),
                                    cursor: usr.uid === user?.uid ? "not-allowed" : "pointer",
                                    padding: "0.25rem",
                                  }}
                                >
                                  {usr.disabled ? <UserX size={16} /> : <UserCheck size={16} />}
                                </button>

                                {/* Edit User */}
                                <button
                                  onClick={() => handleEditUser(usr)}
                                  title="Editar Usuário"
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    padding: "0.25rem",
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary-color)"}
                                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                                >
                                  <Edit2 size={16} />
                                </button>

                                {/* Delete User */}
                                <button
                                  onClick={() => {
                                    setDeleteConfirmId(usr.uid);
                                    setDeleteConfirmType("user");
                                  }}
                                  disabled={usr.uid === user?.uid}
                                  title="Remover Usuário"
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
                              </div>
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
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                          {/* View Post Button */}
                          <button
                            onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                            title="Visualizar Artigo"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "var(--text-muted)",
                              cursor: "pointer",
                              padding: "0.25rem",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary-color)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                          >
                            <Eye size={16} />
                          </button>

                          {/* Delete Post Button */}
                          <button
                            onClick={() => {
                              setDeleteConfirmId(post.id);
                              setDeleteConfirmType("blog");
                            }}
                            title="Excluir Artigo"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#EF4444",
                              cursor: "pointer",
                              padding: "0.25rem",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: WORKOUT PRESCRIPTION */}
        {activeTab === "workouts" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem" }} className="workspace-grid">
            
            {/* LEFT SIDE: Students List */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem", height: "fit-content" }}>
              <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", marginBottom: "1rem", color: "#fff" }}>Alunos</h3>
              
              {/* Search Input */}
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", paddingLeft: "2.25rem", fontSize: "0.85rem" }}
                />
              </div>

              {loadingStudents ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                  <Loader className="text-yellow animate-spin" size={24} />
                </div>
              ) : filteredStudents.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>Nenhum aluno cadastrado.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "450px", overflowY: "auto" }}>
                  {filteredStudents.map((student) => (
                    <button
                      key={student.uid}
                      onClick={() => handleSelectStudent(student)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid " + (selectedStudent?.uid === student.uid ? "var(--primary-color)" : "var(--border-color)"),
                        backgroundColor: selectedStudent?.uid === student.uid ? "rgba(212, 255, 0, 0.05)" : "rgba(30, 41, 59, 0.2)",
                        color: selectedStudent?.uid === student.uid ? "var(--primary-color)" : "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <UserIcon size={18} />
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Workouts panel */}
            <div>
              {!selectedStudent ? (
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "4rem 2rem", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Dumbbell size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "0.5rem" }}>Nenhum Aluno Selecionado</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "300px" }}>Selecione um aluno na lista ao lado para gerenciar ou prescrever novos treinos.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  
                  {/* Selected Student Info Banner */}
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>{selectedStudent.name}</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{selectedStudent.email}</p>
                    </div>
                    {!isEditingWorkout && (
                      <button onClick={handleStartNewWorkout} className="btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                        <Plus size={16} /> Prescrever Treino
                      </button>
                    )}
                  </div>

                  {/* Edit Form / Workout Details */}
                  {isEditingWorkout ? (
                    <form onSubmit={handleSaveWorkout} style={{ background: "var(--bg-surface)", border: "1px solid var(--primary-color)", borderRadius: "12px", padding: "2rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.2rem", color: "#fff" }}>
                          {activeWorkoutId ? "Editar Ficha de Treino" : "Nova Ficha de Treino"}
                        </h3>
                        <button type="button" onClick={() => setIsEditingWorkout(false)} className="btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "6px" }}>
                          Cancelar
                        </button>
                      </div>

                      {/* Workout Title */}
                      <div className="form-group" style={{ marginBottom: "2rem" }}>
                        <label className="form-label">Título da Ficha (Ex: Treino A - Peito, Treino B)</label>
                        <input
                          type="text"
                          required
                          value={workoutTitle}
                          onChange={(e) => setWorkoutTitle(e.target.value)}
                          className="form-input"
                          placeholder="Ex: Treino A"
                          style={{ maxWidth: "400px" }}
                        />
                      </div>

                      {/* Exercises list */}
                      <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Exercícios</h4>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
                        {exercises.map((ex, idx) => (
                          <div key={idx} style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1fr 1.5fr 1.5fr auto", gap: "0.75rem", alignItems: "end" }} className="exercise-row">
                            
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Exercício</label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: Supino Reto"
                                value={ex.name}
                                onChange={(e) => handleExerciseChange(idx, "name", e.target.value)}
                                className="form-input"
                                style={{ fontSize: "0.85rem" }}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Máquina/Aparelho</label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: Máquina 04"
                                value={ex.machine}
                                onChange={(e) => handleExerciseChange(idx, "machine", e.target.value)}
                                className="form-input"
                                style={{ fontSize: "0.85rem" }}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Séries</label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={ex.sets}
                                onChange={(e) => handleExerciseChange(idx, "sets", e.target.value)}
                                className="form-input"
                                style={{ fontSize: "0.85rem" }}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Repetições</label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: 10-12"
                                value={ex.reps}
                                onChange={(e) => handleExerciseChange(idx, "reps", e.target.value)}
                                className="form-input"
                                style={{ fontSize: "0.85rem" }}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Carga (Opcional)</label>
                              <input
                                type="text"
                                placeholder="Ex: 20kg"
                                value={ex.weight || ""}
                                onChange={(e) => handleExerciseChange(idx, "weight", e.target.value)}
                                className="form-input"
                                style={{ fontSize: "0.85rem" }}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveExerciseRow(idx)}
                              style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                color: "#EF4444",
                                cursor: "pointer",
                                padding: "0.7rem",
                                borderRadius: "8px",
                                marginBottom: "1.25rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button type="button" onClick={handleAddExerciseRow} className="btn-outline" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                          <Plus size={16} /> Adicionar Exercício
                        </button>
                        
                        <button type="submit" disabled={savingWorkout} className="btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                          {savingWorkout ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                          Salvar Ficha
                        </button>
                      </div>

                    </form>
                  ) : loadingWorkouts ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                      <Loader className="text-yellow animate-spin" size={32} />
                    </div>
                  ) : workouts.length === 0 ? (
                    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "4rem 2rem", textAlign: "center" }}>
                      <FileText size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                      <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Nenhuma ficha cadastrada</h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Este aluno não tem rotinas de treinos ativas.</p>
                      <button onClick={handleStartNewWorkout} className="btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                        Criar Primeiro Treino
                      </button>
                    </div>
                  ) : (
                    /* Workouts list view */
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      {workouts.map((workout) => (
                        <div key={workout.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
                          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(30, 41, 59, 0.1)" }}>
                            <h4 style={{ color: "#fff", fontWeight: 700 }}>{workout.title}</h4>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              {deleteWorkoutConfirmId === workout.id ? (
                                <>
                                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", alignSelf: "center" }}>Excluir?</span>
                                  <button
                                    onClick={() => {
                                      handleDeleteWorkout(workout.id);
                                      setDeleteWorkoutConfirmId(null);
                                    }}
                                    style={{ backgroundColor: "#EF4444", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}
                                  >
                                    Sim
                                  </button>
                                  <button
                                    onClick={() => setDeleteWorkoutConfirmId(null)}
                                    className="btn-outline"
                                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderRadius: "6px" }}
                                  >
                                    Não
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleEditWorkout(workout)} className="btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderRadius: "6px" }}>
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => setDeleteWorkoutConfirmId(workout.id)}
                                    style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.3)", padding: "0.4rem 0.8rem", borderRadius: "6px", color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}
                                  >
                                    Excluir
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Exercises list summary */}
                          <div style={{ padding: "1.25rem 1.5rem" }}>
                            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", listStyle: "none" }}>
                              {workout.exercises.map((ex, idx) => (
                                <li key={idx} style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1fr 1.5fr 1.5fr", gap: "0.5rem", fontSize: "0.85rem", padding: "0.25rem 0", borderBottom: "1px dashed rgba(30,41,59,0.3)" }}>
                                  <span style={{ fontWeight: 600, color: "#fff" }}>{ex.name}</span>
                                  <span style={{ color: "var(--text-muted)" }}>{ex.machine}</span>
                                  <span style={{ color: "var(--primary-color)", fontWeight: 700 }}>{ex.sets}x</span>
                                  <span>{ex.reps}</span>
                                  <span style={{ color: "var(--text-muted)" }}>{ex.weight || "-"}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

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
        @media (max-width: 650px) {
          .exercise-row {
            grid-template-columns: 1fr !important;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 0.5rem;
          }
          .exercise-row button {
            margin-bottom: 0 !important;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
