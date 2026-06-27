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

create trigger touch_schools before update on schools for each row execute function touch_updated_at();
create trigger touch_profiles before update on profiles for each row execute function touch_updated_at();
create trigger touch_families before update on families for each row execute function touch_updated_at();
create trigger touch_students before update on students for each row execute function touch_updated_at();
create trigger touch_bills before update on bills for each row execute function touch_updated_at();
create trigger payments_update_bill after insert on payments for each row execute function recalculate_bill_status();
create trigger payments_create_receipt after insert on payments for each row execute function create_receipt_for_payment();
