-- Create enum type for role
create type user_role as enum ('teacher', 'student');

create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text not null,
  first_name text,
  last_name text,
  role user_role null,
  assignment_code UUID null,
  class_code text null,
  updated_at timestamp with time zone default now()
);

-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
