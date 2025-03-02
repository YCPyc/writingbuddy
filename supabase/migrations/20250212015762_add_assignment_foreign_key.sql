-- Add foreign key constraint to profiles table
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_assignment_code_fkey
FOREIGN KEY (assignment_code)
REFERENCES public.assignments(assignment_code)
ON DELETE SET NULL;

