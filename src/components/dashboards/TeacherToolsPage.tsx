import { LogoutButton } from "../auth/LogoutButton";

type TeacherToolsPageProps = {
  userId: string;
  classCode: string;
};

export function TeacherToolsPage({ userId, classCode }: TeacherToolsPageProps) {
  return (
    <div className="teacher-tools-page">
      <div className="header">
        <h2>Teacher Tools</h2>
        <LogoutButton />
      </div>
      <p>Class Code: {classCode}</p>
      {/* Add teacher tools here */}
    </div>
  );
}
