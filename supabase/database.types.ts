export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          assignment_code: string
          class_code: string
          created_at: string | null
          due_date: string
          exemplar: string | null
          instruction: string
          rubric: string | null
          standard: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignment_code?: string
          class_code: string
          created_at?: string | null
          due_date: string
          exemplar?: string | null
          instruction: string
          rubric?: string | null
          standard?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignment_code?: string
          class_code?: string
          created_at?: string | null
          due_date?: string
          exemplar?: string | null
          instruction?: string
          rubric?: string | null
          standard?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_code_fkey"
            columns: ["class_code"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_code"]
          },
        ]
      }
      chat_history: {
        Row: {
          assignment_code: string
          created_at: string | null
          id: string
          messages: Json[]
          student_id: string
          tool_name: string
          updated_at: string | null
        }
        Insert: {
          assignment_code: string
          created_at?: string | null
          id?: string
          messages?: Json[]
          student_id: string
          tool_name: string
          updated_at?: string | null
        }
        Update: {
          assignment_code?: string
          created_at?: string | null
          id?: string
          messages?: Json[]
          student_id?: string
          tool_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_assignment_code_fkey"
            columns: ["assignment_code"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["assignment_code"]
          },
          {
            foreignKeyName: "chat_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          class_code: string
          class_name: string
          teacher_id: string
        }
        Insert: {
          class_code: string
          class_name: string
          teacher_id: string
        }
        Update: {
          class_code?: string
          class_name?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assignment_code: string | null
          class_code: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          assignment_code?: string | null
          class_code?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          assignment_code?: string | null
          class_code?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_assignment_code_fkey"
            columns: ["assignment_code"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["assignment_code"]
          },
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_code"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_code"]
          },
        ]
      }
      reports: {
        Row: {
          assignment_code: string
          content: string
          created_at: string | null
          id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          assignment_code: string
          content: string
          created_at?: string | null
          id?: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          assignment_code?: string
          content?: string
          created_at?: string | null
          id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_assignment_code_fkey"
            columns: ["assignment_code"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["assignment_code"]
          },
          {
            foreignKeyName: "reports_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assignment: {
        Row: {
          assignment_code: string
          id: string
          student_id: string
        }
        Insert: {
          assignment_code: string
          id?: string
          student_id: string
        }
        Update: {
          assignment_code?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_assignment_assignment_code_fkey"
            columns: ["assignment_code"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["assignment_code"]
          },
          {
            foreignKeyName: "student_assignment_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

