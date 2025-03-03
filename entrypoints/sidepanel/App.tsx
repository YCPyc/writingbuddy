import { useAuth, AuthProvider } from "@/src/components/auth/AuthProvider";
import { TeacherDashboard } from "@/src/components/dashboards/TeacherDashboard";
import { StudentDashboard } from "@/src/components/dashboards/StudentDashboard";
import { AuthPage } from "@/src/components/auth/AuthPage";
function AppContent() {
  const { id, role } = useAuth();
  if (!id || !role) {
    return <AuthPage />;
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
