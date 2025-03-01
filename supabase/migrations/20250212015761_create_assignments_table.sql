create table public.assignments (
    assignment_code uuid default gen_random_uuid() primary key,
    class_code text not null references public.classes(class_code),
    title text not null,
    instruction text not null,
    standard text,
    rubric text,
    exemplar text,
    due_date timestamp with time zone not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

