import { useState } from "react";
import { CreateClassForm } from "../class/CreateClassForm";
import { TeacherToolsPage } from "./TeacherToolsPage";
import { useAuth } from "../auth/AuthProvider";

type TeacherDashboardProps = {
  userId: string;
};

export function TeacherDashboard({ userId }: TeacherDashboardProps) {
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
  const [showToolsPage, setShowToolsPage] = useState(false);

  if ((showToolsPage && classCode) || classCode) {
    return <TeacherToolsPage userId={userId} classCode={classCode || ""} />;
  }

  return (
    <div className="teacher-panel">
      <CreateClassForm userId={userId} setShowToolsPage={setShowToolsPage} />
    </div>
  );
}
