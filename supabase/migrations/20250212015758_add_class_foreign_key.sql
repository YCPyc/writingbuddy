-- Add the foreign key constraint after both tables exist
alter table public.profiles
add constraint profiles_class_id_fkey
foreign key (class_code)
references public.classes(class_code); 