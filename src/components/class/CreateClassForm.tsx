import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import { supabase } from "@/lib/supabaseClient";
import { generateClassCode } from "./utils";
import { userRepository } from "@/src/domains/user/repository";
import { userService } from "@/src/domains/user/service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
  const { classCode, setClassCode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newClassCode = generateClassCode();
      const newClassService = classService(classRepository(supabase));
      const { data, error } = await newClassService.createClass(
        className,
        userId,
        newClassCode
      );

      if (error) {
        throw new Error(error);
      }

      const newUserService = userService(userRepository(supabase));
      const { data: userData, error: userError } =
        await newUserService.updateClassCode(userId, newClassCode);

      if (userError) {
        throw new Error(userError);
      }

      setClassCode(data?.class_code || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="className">Class Name</Label>
          <Input
            id="className"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter a name for your class"
            className="border-lime-100 focus:border-lime-300 focus:ring-lime-200"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !className}
          className="w-full bg-lime-600 hover:bg-lime-700 text-white"
        >
          {loading ? "Creating..." : "Create Class"}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {classCode && (
        <div className="space-y-4">
          <Alert className="bg-lime-50 border-lime-200">
            <CheckCircle2 className="h-4 w-4 text-lime-600" />
            <AlertTitle className="text-lime-800">
              Class Created Successfully!
            </AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                Class Code: <span className="font-medium">{classCode}</span>
              </p>
              <p className="text-sm text-lime-700 mt-1">
                Share this code with your students to join the class.
              </p>
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => setShowToolsPage(true)}
            className="w-full bg-lime-600 hover:bg-lime-700 text-white"
          >
            Go to Teacher Tools →
          </Button>
        </div>
      )}
    </div>
  );
}
