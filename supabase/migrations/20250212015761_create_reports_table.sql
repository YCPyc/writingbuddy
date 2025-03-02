create table public.reports (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    teacher_id uuid not null references public.profiles(id),
    assignment_code uuid not null references public.assignments(assignment_code),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create index for faster lookups
CREATE INDEX reports_teacher_id_idx ON public.reports (teacher_id);
CREATE INDEX reports_assignment_code_idx ON public.reports (assignment_code);



