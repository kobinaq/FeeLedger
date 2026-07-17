-- Production hardening migration (apply after base schema/functions/policies, or use for existing projects)

alter table payment_webhook_events add column if not exists school_id uuid references schools(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'online_payment_sessions_payment_plan_id_fkey'
  ) then
    alter table online_payment_sessions
      add constraint online_payment_sessions_payment_plan_id_fkey
      foreign key (payment_plan_id) references payment_plans(id) on delete set null;
  end if;
end $$;

create index if not exists payment_webhook_events_school_id_created_at_idx on payment_webhook_events (school_id, created_at);
create index if not exists bill_items_bill_id_idx on bill_items (bill_id);
create index if not exists payment_plans_school_id_family_id_idx on payment_plans (school_id, family_id);
create index if not exists payment_plan_installments_payment_plan_id_idx on payment_plan_installments (payment_plan_id);
create index if not exists audit_logs_school_id_created_at_idx on audit_logs (school_id, created_at);
create index if not exists profiles_family_id_idx on profiles (family_id);
create index if not exists terms_school_id_idx on terms (school_id);
create index if not exists fee_rules_school_id_term_id_idx on fee_rules (school_id, term_id);
create index if not exists fee_items_school_id_idx on fee_items (school_id);
create index if not exists subscriptions_school_id_idx on subscriptions (school_id);
create index if not exists students_school_id_status_idx on students (school_id, status);
