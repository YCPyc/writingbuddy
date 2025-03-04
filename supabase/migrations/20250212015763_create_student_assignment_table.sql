-- Create the student_assignment table to track which students are assigned to which assignments
CREATE TABLE public.student_assignment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assignment_code UUID NOT NULL REFERENCES public.assignments(assignment_code) ON DELETE CASCADE,
    UNIQUE(student_id, assignment_code)
);

-- Create indexes for faster lookups
CREATE INDEX student_assignment_student_id_idx ON public.student_assignment (student_id);
CREATE INDEX student_assignment_assignment_code_idx ON public.student_assignment (assignment_code);

-- Add comment to table
COMMENT ON TABLE public.student_assignment IS 'Tracks which students are assigned to which assignments'; 