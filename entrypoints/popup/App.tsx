import { useAuth, AuthProvider } from "@/src/components/auth/AuthProvider";
import { RoleSelector } from "@/src/components/role/RoleSelector";
import { TeacherDashboard } from "@/src/components/dashboards/TeacherDashboard";
import { StudentDashboard } from "@/src/components/dashboards/StudentDashboard";
import { useState } from "react";
import type { UserRole } from "@/src/types";

function AppContent() {
  const {
    id,
    email,
    role,
    classCode,
    setRole,
    setClassCode,
    signInWithGoogle,
    signOut,
  } = useAuth();
  if (!id) {
    return (
      <div className="container">
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    );
  }

  if (!role) {
    return <RoleSelector userId={id} />;
  }

  return role === "teacher" ? (
    <TeacherDashboard userId={id} />
  ) : (
    <StudentDashboard userId={id} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
