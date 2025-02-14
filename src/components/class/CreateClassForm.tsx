import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import { supabase } from "@/lib/supabaseClient";
import { generateClassCode } from "./utils";
import { userRepository } from "@/src/domains/user/repository";
import { userService } from "@/src/domains/user/service";

type CreateClassFormProps = {
  userId: string;
  setShowToolsPage: (show: boolean) => void;
};

export function CreateClassForm({
  userId,
  setShowToolsPage,
}: CreateClassFormProps) {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newClassCode = generateClassCode();
    const newClassService = classService(classRepository(supabase));
    const { data, error } = await newClassService.createClass(
      className,
      userId,
      newClassCode
    );
    const newUserService = userService(userRepository(supabase));
    const { data: userData, error: userError } =
      await newUserService.updateClassCode(userId, newClassCode);
    if (error || userError) {
      setError(error || userError || "An error occurred");
      throw new Error(error || userError || "An error occurred");
    } else {
      setClassCode(data?.class_code || "");
    }
    setLoading(false);
  };

  return (
    <div className="create-class-form">
      <h2>Create a New Class</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="className">Class Name:</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            required
          />
        </div>
        <button type="submit" disabled={loading || !className}>
          {loading ? "Creating..." : "Create Class"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {classCode && (
        <div className="success-message">
          <h3>Class Created Successfully!</h3>
          <p>
            Class Code: <strong>{classCode}</strong>
          </p>
          <p>Share this code with your students to join the class.</p>
          <button
            className="next-button"
            onClick={() => setShowToolsPage(true)}
          >
            Go to Teacher Tools →
          </button>
        </div>
      )}
    </div>
  );
}
