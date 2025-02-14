export interface Class {
  class_name: string;
  class_code: string;
  teacher_id: string;
}

export interface Profile {
  class_code: string | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  role: string | null;
  updated_at: string | null;
}
