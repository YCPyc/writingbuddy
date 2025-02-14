import { useAuth } from "./AuthProvider";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button className="logout-button" onClick={signOut}>
      Sign Out
    </button>
  );
}
