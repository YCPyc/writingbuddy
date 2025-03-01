import { useAuth } from "./AuthProvider";
import { Button } from "../ui/button";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button className="logout-button" onClick={signOut}>
      Sign Out
    </Button>
  );
}
