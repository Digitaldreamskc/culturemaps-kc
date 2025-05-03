-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum for location categories
create type location_category as enum (
    'mural',
    'music_venue',
    'museum',
    'historic_place',
    'gallery',
    'theater',
    'other'
);

-- Create users table (extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text unique,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create locations table
create table public.locations (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    category location_category not null,
    latitude double precision not null,
    longitude double precision not null,
    photo_url text,
    contributor_id uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Add a constraint to ensure valid coordinates
    constraint valid_coordinates check (
        latitude between -90 and 90 and
        longitude between -180 and 180
    )
);

-- Create indexes for better query performance
create index locations_category_idx on public.locations(category);
create index locations_contributor_idx on public.locations(contributor_id);
create index locations_created_at_idx on public.locations(created_at);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.locations enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Locations are viewable by everyone"
    on public.locations for select
    using (true);

create policy "Authenticated users can insert locations"
    on public.locations for insert
    with check (auth.role() = 'authenticated');

create policy "Users can update their own locations"
    on public.locations for update
    using (auth.uid() = contributor_id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username, full_name, avatar_url)
    values (
        new.id,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 