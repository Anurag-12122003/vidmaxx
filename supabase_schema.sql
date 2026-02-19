-- Create a table for public profiles using Clerk ID as primary key
create table users (
  id text primary key, -- maps to Clerk user.id
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table users enable row level security;

-- Create Policy: Users can view their own data
create policy "Users can view own data" on users
  for select using (auth.uid()::text = id);

-- Create Policy: Service Role can do everything (required for Webhooks)
create policy "Service Role can do everything" on users
  for all
  using (true)
  with check (true);
