import { useAuth } from "./AuthProvider";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      onClick={signOut}
      variant="outline"
      className="border-lime-200 hover:bg-lime-50 transition-colors flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
