export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "teacher" | "student" | null;
  class_code: string | null;
  updated_at: string | null;
}
