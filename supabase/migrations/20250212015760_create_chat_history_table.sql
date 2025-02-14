create table public.chat_history (
    id uuid default gen_random_uuid() primary key,
    messages jsonb[] not null default array[]::jsonb[],
    student_id uuid not null references public.profiles(id),
    tool_name text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
); 