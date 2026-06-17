"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/authContext";
import { getStudentWorkouts, Workout } from "@/lib/firebase/firestore";
import { Dumbbell, Calendar, User, Loader, ClipboardList, CheckCircle2, Lock } from "lucide-react";

const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: "sample-1",
    studentId: "student-uid",
    teacherId: "teacher-uid",
    title: "Treino A - Membros Superiores (Peito, Tríceps e Ombros)",
    updatedAt: new Date(),
    exercises: [
      { name: "Supino Reto na Máquina", machine: "Máquina 04 (Articulado)", sets: 4, reps: "10-12", weight: "15kg cada lado" },
      { name: "Pec Deck / Voador", machine: "Máquina 08", sets: 3, reps: "12", weight: "40kg" },
      { name: "Desenvolvimento de Ombros", machine: "Halteres de Ferro", sets: 4, reps: "10", weight: "12kg cada" },
      { name: "Elevação Lateral", machine: "Halteres / Polia", sets: 3, reps: "12-15", weight: "8kg" },
      { name: "Tríceps Pulley", machine: "Polia Alta / Crossover", sets: 4, reps: "12", weight: "25kg" },
      { name: "Tríceps Testa com Barra", machine: "Banco Plano / Barra W", sets: 3, reps: "10", weight: "5kg cada lado" },
    ],
  },
  {
    id: "sample-2",
    studentId: "student-uid",
    teacherId: "teacher-uid",
    title: "Treino B - Membros Inferiores (Quadríceps, Posterior e Panturrilha)",
    updatedAt: new Date(),
    exercises: [
      { name: "Leg Press 45º", machine: "Máquina 15", sets: 4, reps: "12", weight: "120kg total" },
      { name: "Cadeira Extensora", machine: "Máquina 11", sets: 4, reps: "10-12 (Pausa de 2s)", weight: "50kg" },
      { name: "Mesa Flexora", machine: "Máquina 12", sets: 4, reps: "12", weight: "30kg" },
      { name: "Cadeira Adutora", machine: "Máquina 14", sets: 3, reps: "15", weight: "45kg" },
      { name: "Panturrilha Sentado", machine: "Gêmeos Sentado", sets: 4, reps: "15-20", weight: "35kg" },
    ],
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const { user, role, loading } = useAuth();
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [studentName, setStudentName] = useState("Aluno");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "student" && role !== "admin") {
        // Teachers go to their dashboard, but admins can preview student page
        if (role === "teacher") {
          router.push("/dashboard/professor");
        }
      } else {
        // Fetch workouts and student profile details
        loadWorkouts();
        fetchStudentName();
      }
    }
  }, [user, role, loading, router]);

  const fetchStudentName = async () => {
    if (!user) return;
    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/config");
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        setStudentName(docSnap.data().name || "Aluno");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadWorkouts = async () => {
    if (!user) return;
    setLoadingWorkouts(true);
    const dbWorkouts = await getStudentWorkouts(user.uid);
    if (dbWorkouts.length > 0) {
      setWorkouts(dbWorkouts);
    } else {
      setWorkouts(SAMPLE_WORKOUTS);
    }
    setLoadingWorkouts(false);
  };

  const toggleExercise = (workoutId: string, exerciseIdx: number) => {
    const key = `${workoutId}-${exerciseIdx}`;
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading || (user && !role)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <Loader className="text-yellow animate-spin" size={40} />
      </div>
    );
  }

  if (user && role !== "student" && role !== "admin") {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <Lock size={48} style={{ color: "#EF4444", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Acesso Restrito</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Apenas alunos têm acesso a esta área.</p>
        <button onClick={() => router.push("/login")} className="btn-primary">Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "3rem 0 6rem 0", minHeight: "80vh" }}>
      <div className="container">
        
        {/* Welcome Banner */}
        <div style={{ background: "linear-gradient(135deg, var(--bg-surface) 0%, #151C2C 100%)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "2.5rem", marginBottom: "3rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: "2rem", bottom: "-1rem", opacity: 0.05 }}>
            <Dumbbell size={180} />
          </div>
          
          <span style={{ color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", display: "block", marginBottom: "0.5rem" }}>
            Ficha de Treino Ativa
          </span>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, textTransform: "uppercase" }}>
            Olá, {studentName}!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.5rem", maxWidth: "600px" }}>
            Aqui estão suas rotinas de exercícios prescritas. Use esta página no celular durante o treino para marcar seus exercícios concluídos!
          </p>
        </div>

        {loadingWorkouts ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <Loader className="text-yellow animate-spin" size={32} />
          </div>
        ) : workouts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", border: "2px dashed var(--border-color)", borderRadius: "12px", background: "rgba(30,41,59,0.1)" }}>
            <ClipboardList size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Nenhum treino prescrito</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 1.5rem auto" }}>
              Nenhum professor te vinculou a uma rotina de treinos ainda. Fale com um professor na academia para prescrever sua ficha.
            </p>
          </div>
        ) : (
          /* Workout routines */
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {workouts.map((workout) => (
              <div key={workout.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
                
                {/* Workout Card Header */}
                <div style={{ borderBottom: "1px solid var(--border-color)", padding: "1.25rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(30, 41, 59, 0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <ClipboardList className="text-yellow" size={20} />
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{workout.title}</h3>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={12} />
                    Atualizado: {workout.updatedAt.toLocaleDateString("pt-BR")}
                  </div>
                </div>

                {/* Desktop View Table */}
                <div className="desktop-table-container" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(10, 13, 20, 0.3)" }}>
                        <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700 }}>Concluir</th>
                        <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700 }}>Exercício</th>
                        <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700 }}>Aparelho/Máquina</th>
                        <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700 }}>Séries</th>
                        <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700 }}>Repetições</th>
                        <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700 }}>Carga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workout.exercises.map((exercise, idx) => {
                        const isDone = completedExercises[`${workout.id}-${idx}`] || false;
                        return (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: "1px solid var(--border-color)",
                              backgroundColor: isDone ? "rgba(var(--primary-rgb), 0.02)" : "transparent",
                              transition: "background-color 0.2s",
                            }}
                          >
                            <td style={{ padding: "1rem 1.5rem" }}>
                              <button
                                onClick={() => toggleExercise(workout.id, idx)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: isDone ? "var(--primary-color)" : "var(--border-color)",
                                  display: "flex",
                                  alignItems: "center",
                                  transition: "color 0.2s",
                                }}
                              >
                                <CheckCircle2 size={24} style={{ fill: isDone ? "var(--primary-color)" : "transparent", color: isDone ? "#0A0D14" : "var(--border-color)" }} />
                              </button>
                            </td>
                            <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: isDone ? "var(--text-muted)" : "#fff", textDecoration: isDone ? "line-through" : "none" }}>
                              {exercise.name}
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                              {exercise.machine || "-"}
                            </td>
                            <td style={{ padding: "1rem 1.5rem", fontWeight: 700, color: isDone ? "var(--text-muted)" : "var(--primary-color)" }}>
                              {exercise.sets}
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: isDone ? "var(--text-muted)" : "#fff" }}>
                              {exercise.reps}
                            </td>
                            <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>
                              {exercise.weight || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="mobile-cards-container">
                  {workout.exercises.map((exercise, idx) => {
                    const isDone = completedExercises[`${workout.id}-${idx}`] || false;
                    return (
                      <div
                        key={idx}
                        className={`exercise-card ${isDone ? "done" : ""}`}
                        onClick={() => toggleExercise(workout.id, idx)}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid var(--border-color)",
                          padding: "1.25rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                          backgroundColor: isDone ? "rgba(212, 255, 0, 0.01)" : "transparent",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: isDone ? "var(--text-muted)" : "#fff", textDecoration: isDone ? "line-through" : "none", margin: 0 }}>
                              {exercise.name}
                            </h4>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.25rem 0 0 0" }}>
                              Aparelho: <strong style={{ color: isDone ? "var(--text-muted)" : "#E2E8F0" }}>{exercise.machine || "-"}</strong>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExercise(workout.id, idx);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: isDone ? "var(--primary-color)" : "var(--border-color)",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CheckCircle2 size={26} style={{ fill: isDone ? "var(--primary-color)" : "transparent", color: isDone ? "#0A0D14" : "var(--border-color)" }} />
                          </button>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "0.5rem", background: "rgba(10, 13, 20, 0.4)", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.02)" }}>
                          <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.15rem", fontWeight: 600 }}>Séries</span>
                            <strong style={{ fontSize: "1.05rem", color: isDone ? "var(--text-muted)" : "var(--primary-color)" }}>{exercise.sets}</strong>
                          </div>
                          <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.15rem", fontWeight: 600 }}>Repetições</span>
                            <strong style={{ fontSize: "0.95rem", color: isDone ? "var(--text-muted)" : "#fff" }}>{exercise.reps}</strong>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.15rem", fontWeight: 600 }}>Carga</span>
                            <strong style={{ fontSize: "0.95rem", color: isDone ? "var(--text-muted)" : "#fff" }}>{exercise.weight || "-"}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
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
        .desktop-table-container {
          display: block;
        }
        .mobile-cards-container {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-table-container {
            display: none;
          }
          .mobile-cards-container {
            display: flex;
            flex-direction: column;
            gap: 0;
          }
          .exercise-card {
            border-bottom: 1px solid var(--border-color);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .exercise-card:last-child {
            border-bottom: none !important;
          }
          .exercise-card:hover {
            background: rgba(255, 255, 255, 0.01) !important;
          }
          .exercise-card.done {
            background: rgba(212, 255, 0, 0.02) !important;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
