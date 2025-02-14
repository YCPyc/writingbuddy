import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { UserRole } from "../../types";
import { useAuth } from "../auth/AuthProvider";
import { userService } from "@/src/domains/user/service";
import { userRepository } from "@/src/domains/user/repository";

type RoleSelectorProps = {
  userId: string;
};

export function RoleSelector({ userId }: RoleSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const selectRole = async (selectedRole: UserRole) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({ role: selectedRole })
        .eq("id", userId);

      if (error) throw error;

      // Refresh user data after role update
      const newUserService = userService(userRepository(supabase));
      const { data: updatedUser, error: fetchError } =
        await newUserService.fetchUserInfo(userId);

      if (fetchError) throw fetchError;

      // Force a page refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Error setting role:", error);
      setError("Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {error && <div className="error">{error}</div>}
      <h2>Select your role</h2>
      <button onClick={() => selectRole("teacher")} disabled={loading}>
        I'm a Teacher
      </button>
      <button onClick={() => selectRole("student")} disabled={loading}>
        I'm a Student
      </button>
    </div>
  );
}
