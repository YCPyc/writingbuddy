create table public.reports (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    class_code text not null references public.classes(class_code),
    teacher_id uuid not null references public.profiles(id),
    created_at timestamp with time zone default now()
);

