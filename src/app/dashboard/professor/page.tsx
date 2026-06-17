"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/authContext";
import {
  getAllStudents,
  getStudentWorkouts,
  saveStudentWorkout,
  deleteWorkout,
  UserProfile,
  Workout,
  Exercise,
} from "@/lib/firebase/firestore";
import { Dumbbell, User, Plus, Trash2, Save, Loader, Search, ArrowLeft, Lock, FileText } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  // Form State for creating/editing a workout
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [workoutTitle, setWorkoutTitle] = useState("Treino A");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Authenticate and fetch students
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "teacher" && role !== "admin") {
        router.push("/dashboard/aluno");
      } else {
        fetchStudents();
      }
    }
  }, [user, role, loading, router]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    const list = await getAllStudents();
    setStudents(list);
    setLoadingStudents(false);
  };

  const handleSelectStudent = async (student: UserProfile) => {
    setSelectedStudent(student);
    setLoadingWorkouts(true);
    setIsEditing(false);
    setActiveWorkoutId(null);
    const studentWorkouts = await getStudentWorkouts(student.uid);
    setWorkouts(studentWorkouts);
    setLoadingWorkouts(false);
  };

  const handleStartNewWorkout = () => {
    setActiveWorkoutId(null);
    setWorkoutTitle("Treino " + (workouts.length === 0 ? "A" : String.fromCharCode(65 + workouts.length)));
    setExercises([{ name: "", machine: "", sets: 3, reps: "10-12", weight: "" }]);
    setIsEditing(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setActiveWorkoutId(workout.id);
    setWorkoutTitle(workout.title);
    setExercises([...workout.exercises]);
    setIsEditing(true);
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

    setSaving(true);
    try {
      await saveStudentWorkout(activeWorkoutId, selectedStudent.uid, user.uid, workoutTitle.trim(), exercises);
      
      // Reload workouts
      const updated = await getStudentWorkouts(selectedStudent.uid);
      setWorkouts(updated);
      setIsEditing(false);
      setActiveWorkoutId(null);
      showNotification("Treino salvo com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao salvar treino.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w.id !== id));
      if (activeWorkoutId === id) {
        setIsEditing(false);
        setActiveWorkoutId(null);
      }
      showNotification("Treino excluído!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Erro ao excluir treino.", "error");
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || (user && !role)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <Loader className="text-yellow animate-spin" size={40} />
      </div>
    );
  }

  if (user && role !== "teacher" && role !== "admin") {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <Lock size={48} style={{ color: "#EF4444", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Acesso Restrito</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Apenas professores têm acesso a esta área.</p>
        <button onClick={() => router.push("/login")} className="btn-primary">Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "3rem 0 6rem 0", minHeight: "80vh" }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ borderLeft: "4px solid var(--primary-color)", paddingLeft: "1.5rem", marginBottom: "3rem" }}>
          <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "block" }}>
            // ÁREA DO PROFESSOR
          </span>
          <h1 style={{ fontSize: "2.25rem", textTransform: "uppercase", fontWeight: 900 }}>
            Prescrição de Treinos
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Selecione um aluno na lista para gerenciar suas fichas de treino.
          </p>
        </div>

        {/* Workspace Layout */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <User size={18} />
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
                  {!isEditing && (
                    <button onClick={handleStartNewWorkout} className="btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                      <Plus size={16} /> Prescrever Treino
                    </button>
                  )}
                </div>

                {/* Edit Form / Workout Details */}
                {isEditing ? (
                  <form onSubmit={handleSaveWorkout} style={{ background: "var(--bg-surface)", border: "1px solid var(--primary-color)", borderRadius: "12px", padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                      <h3 style={{ fontSize: "1.2rem", color: "#fff" }}>
                        {activeWorkoutId ? "Editar Ficha de Treino" : "Nova Ficha de Treino"}
                      </h3>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "6px" }}>
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
                      
                      <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                        {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
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
                            {deleteConfirmId === workout.id ? (
                              <>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", alignSelf: "center" }}>Excluir?</span>
                                <button
                                  onClick={() => {
                                    handleDeleteWorkout(workout.id);
                                    setDeleteConfirmId(null);
                                  }}
                                  style={{ backgroundColor: "#EF4444", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}
                                >
                                  Sim
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
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
                                  onClick={() => setDeleteConfirmId(workout.id)}
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
