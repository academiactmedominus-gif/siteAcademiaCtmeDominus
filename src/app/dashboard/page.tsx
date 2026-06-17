"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/authContext";
import { Loader } from "lucide-react";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "teacher") {
          router.push("/dashboard/professor");
        } else {
          router.push("/dashboard/aluno");
        }
      }
    }
  }, [user, role, loading, router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ textAlign: "center" }}>
        <Loader className="text-yellow animate-spin" size={40} style={{ marginBottom: "1rem" }} />
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}>Redirecionando...</p>
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
