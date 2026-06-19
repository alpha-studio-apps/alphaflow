-- AlphaFlow Schema
-- Correr este SQL en Supabase → SQL Editor

-- Leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  company text,
  email text,
  phone text,
  instagram text,
  alpha_project text not null,
  service_interested text,
  commercial_status text not null default 'Nuevo lead',
  temperature text not null default 'Frío',
  entry_channel text not null default 'Instagram',
  priority text not null default 'Media',
  estimated_value numeric,
  currency text default 'ARS',
  quick_notes text,
  follow_up_date date,
  first_contact_date date default current_date,
  last_contact_date date default current_date,
  is_client boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  alpha_project text not null,
  task_type text not null default 'Seguimiento',
  status text not null default 'Pendiente',
  priority text not null default 'Media',
  due_date date,
  lead_id uuid references leads(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  alpha_project text not null,
  name text not null,
  description text,
  ideal_client text,
  problem_solved text,
  deliverables text,
  base_price numeric,
  currency text default 'ARS',
  duration text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Email Templates
create table if not exists email_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alpha_project text not null,
  service_id uuid references services(id) on delete set null,
  commercial_stage text,
  recommended_temperature text,
  subject text not null,
  body text not null,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Proposals
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  title text not null,
  amount numeric,
  currency text default 'ARS',
  status text not null default 'Borrador',
  sent_date date,
  valid_until date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contact History
create table if not exists contact_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  interaction_type text not null,
  notes text,
  date timestamptz default now(),
  created_at timestamptz default now()
);

-- RLS: habilitar acceso público (hasta agregar auth)
alter table leads enable row level security;
alter table tasks enable row level security;
alter table services enable row level security;
alter table email_templates enable row level security;
alter table proposals enable row level security;
alter table contact_history enable row level security;

create policy "public_all" on leads for all using (true) with check (true);
create policy "public_all" on tasks for all using (true) with check (true);
create policy "public_all" on services for all using (true) with check (true);
create policy "public_all" on email_templates for all using (true) with check (true);
create policy "public_all" on proposals for all using (true) with check (true);
create policy "public_all" on contact_history for all using (true) with check (true);
