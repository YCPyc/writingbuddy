create table public.reports (
    report_id uuid default gen_random_uuid() primary key,
    content text not null,
    teacher_id uuid not null references public.profiles(id),
    assignment_code uuid not null references public.assignments(assignment_code),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create index for faster lookups
CREATE INDEX reports_teacher_id_idx ON public.reports (teacher_id);
CREATE INDEX reports_assignment_code_idx ON public.reports (assignment_code);

-- Add RLS policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own reports
CREATE POLICY "Teachers can view their own reports" 
ON public.reports FOR SELECT 
USING (auth.uid() = teacher_id);

-- Teachers can insert their own reports
CREATE POLICY "Teachers can insert their own reports" 
ON public.reports FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own reports
CREATE POLICY "Teachers can update their own reports" 
ON public.reports FOR UPDATE 
USING (auth.uid() = teacher_id);

-- Teachers can delete their own reports
CREATE POLICY "Teachers can delete their own reports" 
ON public.reports FOR DELETE 
USING (auth.uid() = teacher_id);

