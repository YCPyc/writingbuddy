create table public.classes (
    class_code text primary key,
    teacher_id uuid not null references public.profiles(id),
    class_name text not null
);

