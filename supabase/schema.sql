create extension if not exists "pgcrypto";

create type app_role as enum ('platform_admin','school_admin','headteacher','accountant','cashier','parent');
create type bill_status as enum ('draft','published','partially_paid','paid','overdue','cancelled');
create type plan_status as enum ('active','on_track','missed_payment','completed','cancelled');
create type installment_status as enum ('pending','partially_paid','paid','overdue');
create type reminder_status as enum ('draft','scheduled','sent','partial','failed');
create type reminder_channel as enum ('sms','email','both');

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  logo_url text,
  currency text not null default 'GHS',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists school_payment_methods (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references schools(id),
  family_id uuid,
  full_name text not null,
  email text not null unique,
  role app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table academic_years (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table terms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  academic_year_id uuid not null references academic_years(id) on delete cascade,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table families (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  guardian_full_name text not null,
  phone text not null,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles add constraint profiles_family_fk foreign key (family_id) references families(id) on delete set null;

create table students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete restrict,
  class_id uuid not null references classes(id) on delete restrict,
  first_name text not null,
  last_name text not null,
  student_code text not null,
  status text not null default 'active',
  optional_services text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, student_code)
);

create table fee_items (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  category text not null,
  is_required boolean not null default true,
  default_due_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table fee_rules (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  term_id uuid not null references terms(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  fee_item_id uuid not null references fee_items(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  is_required boolean not null default true,
  due_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (term_id, class_id, fee_item_id)
);

create table bills (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete restrict,
  student_id uuid not null references students(id) on delete restrict,
  term_id uuid not null references terms(id) on delete restrict,
  bill_number text not null,
  status bill_status not null default 'draft',
  total_amount numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  due_date date not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, bill_number)
);

create table bill_items (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  bill_id uuid not null references bills(id) on delete cascade,
  fee_item_id uuid references fee_items(id) on delete set null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete restrict,
  student_id uuid references students(id) on delete set null,
  bill_id uuid references bills(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  method text not null,
  reference_number text,
  payment_date date not null default current_date,
  notes text,
  recorded_by uuid references profiles(id),
  source text not null default 'manual' check (source in ('manual','paystack')),
  provider text,
  provider_reference text,
  provider_channel text,
  provider_fees numeric(12,2),
  verified_at timestamptz,
  reversed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_reference)
);

create table online_payment_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete restrict,
  student_id uuid references students(id) on delete set null,
  bill_id uuid references bills(id) on delete set null,
  payment_plan_id uuid,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'GHS',
  provider text not null default 'paystack',
  provider_reference text not null unique,
  provider_access_code text,
  authorization_url text,
  provider_channel text,
  status text not null default 'initialized' check (status in ('initialized','pending','success','failed','abandoned')),
  metadata jsonb not null default '{}',
  provider_response jsonb,
  verified_at timestamptz,
  paid_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete set null,
  provider text not null,
  event_type text,
  provider_reference text,
  payload jsonb not null,
  signature_valid boolean not null default false,
  processing_status text not null default 'received' check (processing_status in ('received','processed','ignored','failed')),
  processing_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table receipts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete restrict,
  student_id uuid references students(id) on delete set null,
  payment_id uuid not null references payments(id) on delete restrict,
  receipt_number text not null,
  amount numeric(12,2) not null,
  method text not null,
  reference_number text,
  receipt_date date not null default current_date,
  recorded_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, receipt_number)
);

create table payment_plans (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete restrict,
  total_balance numeric(12,2) not null check (total_balance > 0),
  status plan_status not null default 'active',
  approved_by uuid references profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table online_payment_sessions
  add constraint online_payment_sessions_payment_plan_id_fkey
  foreign key (payment_plan_id) references payment_plans(id) on delete set null;

create table payment_plan_installments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  payment_plan_id uuid not null references payment_plans(id) on delete cascade,
  due_date date not null,
  amount numeric(12,2) not null check (amount > 0),
  paid_amount numeric(12,2) not null default 0,
  status installment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reminder_templates (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  type text not null,
  channel reminder_channel not null default 'sms',
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  family_id uuid not null references families(id) on delete cascade,
  reminder_template_id uuid references reminder_templates(id) on delete set null,
  channel reminder_channel not null,
  status reminder_status not null default 'draft',
  message text not null,
  provider_response jsonb,
  sent_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  plan text not null default 'starter',
  status text not null default 'active',
  starts_on date not null default current_date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on profiles (school_id, role);
create index on families (school_id);
create index on students (school_id, family_id, class_id);
create index on bills (school_id, family_id, student_id, status);
create index on payments (school_id, family_id, payment_date);
create index on online_payment_sessions (school_id, family_id, status);
create index on online_payment_sessions (provider_reference);
create index on payment_webhook_events (provider, provider_reference);
create index on payment_webhook_events (school_id, created_at);
create index on receipts (school_id, family_id, receipt_date);
create index on reminders (school_id, family_id, status);
create index on bill_items (bill_id);
create index on payment_plans (school_id, family_id);
create index on payment_plan_installments (payment_plan_id);
create index on audit_logs (school_id, created_at);
create index on profiles (family_id);
create index on terms (school_id);
create index on fee_rules (school_id, term_id);
create index on fee_items (school_id);
create index on subscriptions (school_id);
create index on students (school_id, status);
