import { LogoutButton } from "../auth/LogoutButton";

type StudentToolsPageProps = {
  userId: string;
  classCode: string;
};

export function StudentToolsPage({ userId, classCode }: StudentToolsPageProps) {
  return (
    <div className="student-tools-page">
      <div className="header">
        <h2>Student Tools</h2>
        <LogoutButton />
      </div>
      <p>Class Code: {classCode}</p>
      {/* Add student tools here */}
    </div>
  );
}
