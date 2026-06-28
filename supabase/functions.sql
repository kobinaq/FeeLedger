create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_profile()
returns profiles
language sql
security definer
set search_path = public
stable
as $$
  select * from profiles where id = auth.uid();
$$;

create or replace function public.current_role()
returns app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function public.current_school_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select school_id from profiles where id = auth.uid();
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'platform_admin');
$$;

create or replace function public.staff_can_manage_money()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('school_admin','accountant','cashier')
  );
$$;

create or replace function public.recalculate_bill_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_bill bills%rowtype;
begin
  if new.bill_id is null then
    return new;
  end if;

  update bills
  set paid_amount = least(total_amount, paid_amount + new.amount),
      status = case
        when least(total_amount, paid_amount + new.amount) >= total_amount then 'paid'::bill_status
        when least(total_amount, paid_amount + new.amount) > 0 then 'partially_paid'::bill_status
        else status
      end,
      updated_at = now()
  where id = new.bill_id
  returning * into target_bill;

  return new;
end;
$$;

create or replace function public.create_receipt_for_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into receipts (
    school_id, family_id, student_id, payment_id, receipt_number,
    amount, method, reference_number, receipt_date, recorded_by
  )
  values (
    new.school_id, new.family_id, new.student_id, new.id,
    'RCPT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('receipt_number_seq')::text, 5, '0'),
    new.amount, new.method, new.reference_number, new.payment_date, new.recorded_by
  );
  return new;
end;
$$;

create sequence if not exists receipt_number_seq start 1000;

create or replace function public.update_payment_plan_installment_for_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_installment payment_plan_installments%rowtype;
begin
  select i.*
  into target_installment
  from payment_plan_installments i
  join payment_plans p on p.id = i.payment_plan_id
  where p.family_id = new.family_id
    and p.school_id = new.school_id
    and p.status in ('active','on_track','missed_payment')
    and i.status <> 'paid'
  order by i.due_date asc
  limit 1;

  if target_installment.id is null then
    return new;
  end if;

  update payment_plan_installments
  set paid_amount = least(amount, paid_amount + new.amount),
      status = case
        when least(amount, paid_amount + new.amount) >= amount then 'paid'::installment_status
        when least(amount, paid_amount + new.amount) > 0 then 'partially_paid'::installment_status
        when due_date < current_date then 'overdue'::installment_status
        else status
      end,
      updated_at = now()
  where id = target_installment.id;

  update payment_plans
  set status = case
    when not exists (
      select 1 from payment_plan_installments
      where payment_plan_id = target_installment.payment_plan_id and status <> 'paid'
    ) then 'completed'::plan_status
    else 'on_track'::plan_status
  end,
  updated_at = now()
  where id = target_installment.payment_plan_id;

  return new;
end;
$$;

drop trigger if exists touch_schools on schools;
drop trigger if exists touch_profiles on profiles;
drop trigger if exists touch_families on families;
drop trigger if exists touch_students on students;
drop trigger if exists touch_bills on bills;
drop trigger if exists touch_payments on payments;
drop trigger if exists touch_online_payment_sessions on online_payment_sessions;
drop trigger if exists touch_reminders on reminders;
drop trigger if exists payments_update_bill on payments;
drop trigger if exists payments_create_receipt on payments;
drop trigger if exists payments_update_plan on payments;

create trigger touch_schools before update on schools for each row execute function touch_updated_at();
create trigger touch_profiles before update on profiles for each row execute function touch_updated_at();
create trigger touch_families before update on families for each row execute function touch_updated_at();
create trigger touch_students before update on students for each row execute function touch_updated_at();
create trigger touch_bills before update on bills for each row execute function touch_updated_at();
create trigger touch_payments before update on payments for each row execute function touch_updated_at();
create trigger touch_online_payment_sessions before update on online_payment_sessions for each row execute function touch_updated_at();
create trigger touch_reminders before update on reminders for each row execute function touch_updated_at();
create trigger payments_update_bill after insert on payments for each row execute function recalculate_bill_status();
create trigger payments_create_receipt after insert on payments for each row execute function create_receipt_for_payment();
create trigger payments_update_plan after insert on payments for each row execute function update_payment_plan_installment_for_payment();
