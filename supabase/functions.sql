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

create or replace function public.record_payment_transaction(
  p_school_id uuid,
  p_family_id uuid,
  p_student_id uuid default null,
  p_bill_id uuid default null,
  p_amount numeric default 0,
  p_method text default 'manual',
  p_reference_number text default null,
  p_payment_date date default current_date,
  p_notes text default null,
  p_recorded_by uuid default auth.uid(),
  p_source text default 'manual',
  p_provider text default null,
  p_provider_reference text default null,
  p_provider_channel text default null,
  p_provider_fees numeric default null,
  p_verified_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  payment_id uuid;
  target_bill bills%rowtype;
  family_exists boolean;
  student_exists boolean;
  is_service_role boolean := coalesce(auth.role(), '') = 'service_role';
begin
  if p_amount <= 0 then
    raise exception 'Payment amount must be more than zero.';
  end if;

  if p_source not in ('manual','paystack') then
    raise exception 'Unsupported payment source.';
  end if;

  if not is_service_role then
    if current_school_id() is null or p_school_id <> current_school_id() then
      raise exception 'Payment school does not match the signed-in profile.';
    end if;

    if p_source = 'paystack' then
      raise exception 'Online payment verification must use the service role.';
    end if;

    if public.current_role() not in ('school_admin','accountant','cashier') then
      raise exception 'You do not have permission to record this payment.';
    end if;
  end if;

  if p_provider is not null and p_provider_reference is not null then
    select id into payment_id
    from payments
    where provider = p_provider and provider_reference = p_provider_reference;

    if payment_id is not null then
      return payment_id;
    end if;
  end if;

  select exists (
    select 1 from families
    where id = p_family_id and school_id = p_school_id
  ) into family_exists;

  if not family_exists then
    raise exception 'Family not found for this school.';
  end if;

  if p_student_id is not null then
    select exists (
      select 1 from students
      where id = p_student_id and family_id = p_family_id and school_id = p_school_id
    ) into student_exists;

    if not student_exists then
      raise exception 'Student not found for this family.';
    end if;
  end if;

  if p_bill_id is not null then
    select *
    into target_bill
    from bills
    where id = p_bill_id
    for update;

    if target_bill.id is null then
      raise exception 'Bill not found.';
    end if;

    if target_bill.school_id <> p_school_id or target_bill.family_id <> p_family_id then
      raise exception 'Bill does not belong to this family.';
    end if;

    if p_amount > (target_bill.total_amount - target_bill.paid_amount) then
      raise exception 'Payment amount cannot be more than the selected bill balance.';
    end if;
  end if;

  insert into payments (
    school_id, family_id, student_id, bill_id, amount, method,
    reference_number, payment_date, notes, recorded_by, source,
    provider, provider_reference, provider_channel, provider_fees, verified_at
  )
  values (
    p_school_id, p_family_id, p_student_id, p_bill_id, p_amount, p_method,
    p_reference_number, coalesce(p_payment_date, current_date), p_notes, p_recorded_by, p_source,
    p_provider, p_provider_reference, p_provider_channel, p_provider_fees, p_verified_at
  )
  returning id into payment_id;

  insert into audit_logs (school_id, actor_id, action, entity_type, entity_id, metadata)
  values (
    p_school_id,
    p_recorded_by,
    case when p_source = 'paystack' then 'verified_online_payment' else 'recorded_payment' end,
    'payments',
    payment_id,
    jsonb_build_object(
      'amount', p_amount,
      'method', p_method,
      'source', p_source,
      'bill_id', p_bill_id,
      'provider', p_provider,
      'provider_reference', p_provider_reference
    )
  );

  return payment_id;
end;
$$;

-- Cascade payment amount across open installments (earliest due first).
create or replace function public.update_payment_plan_installment_for_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining numeric(12,2) := new.amount;
  rec record;
  apply_amount numeric(12,2);
  new_paid numeric(12,2);
begin
  for rec in
    select i.id, i.amount, i.paid_amount, i.due_date, i.payment_plan_id
    from payment_plan_installments i
    join payment_plans p on p.id = i.payment_plan_id
    where p.family_id = new.family_id
      and p.school_id = new.school_id
      and p.status in ('active', 'on_track', 'missed_payment')
      and i.status <> 'paid'
    order by i.due_date asc
  loop
    exit when remaining <= 0;
    apply_amount := least(rec.amount - rec.paid_amount, remaining);
    if apply_amount <= 0 then
      continue;
    end if;

    new_paid := rec.paid_amount + apply_amount;
    update payment_plan_installments
    set paid_amount = new_paid,
        status = case
          when new_paid >= rec.amount then 'paid'::installment_status
          when new_paid > 0 then 'partially_paid'::installment_status
          when rec.due_date < current_date then 'overdue'::installment_status
          else status
        end,
        updated_at = now()
    where id = rec.id;

    remaining := remaining - apply_amount;
  end loop;

  update payment_plans p
  set status = case
    when not exists (
      select 1 from payment_plan_installments i
      where i.payment_plan_id = p.id and i.status <> 'paid'
    ) then 'completed'::plan_status
    when exists (
      select 1 from payment_plan_installments i
      where i.payment_plan_id = p.id and i.status = 'overdue'
    ) then 'missed_payment'::plan_status
    else 'on_track'::plan_status
  end,
  updated_at = now()
  where p.family_id = new.family_id
    and p.school_id = new.school_id
    and p.status in ('active', 'on_track', 'missed_payment');

  return new;
end;
$$;

create sequence if not exists bill_number_seq start 1000;

-- Generate bills for selected classes in one transaction (skips students who already have a non-cancelled bill for the term).
create or replace function public.generate_bills_for_classes(
  p_school_id uuid,
  p_term_id uuid,
  p_class_ids uuid[],
  p_publish boolean default false
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  created_count integer := 0;
  student_rec record;
  bill_id uuid;
  bill_total numeric(12,2);
  bill_due date;
  bill_number text;
  year_text text := to_char(now(), 'YYYY');
begin
  if current_school_id() is null or p_school_id <> current_school_id() then
    raise exception 'Bill generation school does not match the signed-in profile.';
  end if;

  if public.current_role() not in ('school_admin', 'accountant') then
    raise exception 'You do not have permission to generate bills.';
  end if;

  if p_class_ids is null or array_length(p_class_ids, 1) is null then
    raise exception 'Select at least one class.';
  end if;

  if not exists (select 1 from terms where id = p_term_id and school_id = p_school_id) then
    raise exception 'Term not found for this school.';
  end if;

  for student_rec in
    select s.*
    from students s
    where s.school_id = p_school_id
      and s.class_id = any (p_class_ids)
      and s.status = 'active'
  loop
    if exists (
      select 1 from bills b
      where b.student_id = student_rec.id
        and b.term_id = p_term_id
        and b.status <> 'cancelled'
    ) then
      continue;
    end if;

    bill_total := 0;
    bill_due := current_date;

    select coalesce(sum(r.amount), 0), min(r.due_date)
    into bill_total, bill_due
    from fee_rules r
    join fee_items fi on fi.id = r.fee_item_id
    where r.school_id = p_school_id
      and r.term_id = p_term_id
      and r.class_id = student_rec.class_id
      and (
        r.is_required
        or fi.category = any (student_rec.optional_services)
      );

    if bill_total is null or bill_total <= 0 then
      continue;
    end if;

    bill_number := 'BILL-' || year_text || '-' || student_rec.student_code || '-' || lpad(nextval('bill_number_seq')::text, 5, '0');

    insert into bills (
      school_id, family_id, student_id, term_id, bill_number, status,
      total_amount, due_date, published_at
    )
    values (
      p_school_id,
      student_rec.family_id,
      student_rec.id,
      p_term_id,
      bill_number,
      case when p_publish then 'published'::bill_status else 'draft'::bill_status end,
      bill_total,
      coalesce(bill_due, current_date),
      case when p_publish then now() else null end
    )
    returning id into bill_id;

    insert into bill_items (school_id, bill_id, fee_item_id, description, amount)
    select
      p_school_id,
      bill_id,
      r.fee_item_id,
      fi.name,
      r.amount
    from fee_rules r
    join fee_items fi on fi.id = r.fee_item_id
    where r.school_id = p_school_id
      and r.term_id = p_term_id
      and r.class_id = student_rec.class_id
      and (
        r.is_required
        or fi.category = any (student_rec.optional_services)
      );

    created_count := created_count + 1;
  end loop;

  insert into audit_logs (school_id, actor_id, action, entity_type, entity_id, metadata)
  values (
    p_school_id,
    auth.uid(),
    case when p_publish then 'published_bills' else 'generated_bill_drafts' end,
    'bills',
    null,
    jsonb_build_object(
      'created', created_count,
      'term_id', p_term_id,
      'class_ids', to_jsonb(p_class_ids),
      'publish', p_publish
    )
  );

  return created_count;
end;
$$;

-- Headline collection stats for dashboards (published/partially_paid/paid/overdue bills).
create or replace function public.school_collection_snapshot(p_school_id uuid)
returns table (
  expected numeric,
  collected numeric,
  outstanding numeric,
  today_collected numeric,
  active_plans bigint
)
language sql
security definer
set search_path = public
stable
as $$
  select
    coalesce((
      select sum(b.total_amount)
      from bills b
      where b.school_id = p_school_id
        and b.status in ('published', 'partially_paid', 'paid', 'overdue')
    ), 0) as expected,
    coalesce((
      select sum(b.paid_amount)
      from bills b
      where b.school_id = p_school_id
        and b.status in ('published', 'partially_paid', 'paid', 'overdue')
    ), 0) as collected,
    coalesce((
      select sum(b.total_amount - b.paid_amount)
      from bills b
      where b.school_id = p_school_id
        and b.status in ('published', 'partially_paid', 'paid', 'overdue')
    ), 0) as outstanding,
    coalesce((
      select sum(p.amount)
      from payments p
      where p.school_id = p_school_id
        and p.payment_date = current_date
        and p.reversed_at is null
    ), 0) as today_collected,
    coalesce((
      select count(*)
      from payment_plans pl
      where pl.school_id = p_school_id
        and pl.status in ('active', 'on_track', 'missed_payment')
    ), 0) as active_plans;
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
