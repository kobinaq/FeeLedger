alter table schools enable row level security;
alter table profiles enable row level security;
alter table classes enable row level security;
alter table academic_years enable row level security;
alter table terms enable row level security;
alter table families enable row level security;
alter table students enable row level security;
alter table fee_items enable row level security;
alter table fee_rules enable row level security;
alter table bills enable row level security;
alter table bill_items enable row level security;
alter table payments enable row level security;
alter table receipts enable row level security;
alter table payment_plans enable row level security;
alter table payment_plan_installments enable row level security;
alter table reminder_templates enable row level security;
alter table reminders enable row level security;
alter table audit_logs enable row level security;
alter table subscriptions enable row level security;

create policy "platform can manage schools" on schools for all using (is_platform_admin()) with check (is_platform_admin());
create policy "staff can read own school" on schools for select using (id = current_school_id());

create policy "platform profiles" on profiles for all using (is_platform_admin()) with check (is_platform_admin());
create policy "users read own profile" on profiles for select using (id = auth.uid());
create policy "school admins manage school profiles" on profiles for all using (school_id = current_school_id() and current_role() = 'school_admin') with check (school_id = current_school_id() and current_role() = 'school_admin');

create policy "school read classes" on classes for select using (school_id = current_school_id() or is_platform_admin());
create policy "school admin manage classes" on classes for all using (school_id = current_school_id() and current_role() = 'school_admin') with check (school_id = current_school_id());
create policy "school read years" on academic_years for select using (school_id = current_school_id() or is_platform_admin());
create policy "school admin manage years" on academic_years for all using (school_id = current_school_id() and current_role() = 'school_admin') with check (school_id = current_school_id());
create policy "school read terms" on terms for select using (school_id = current_school_id() or is_platform_admin());
create policy "school admin manage terms" on terms for all using (school_id = current_school_id() and current_role() = 'school_admin') with check (school_id = current_school_id());

create policy "staff read families" on families for select using (school_id = current_school_id() or is_platform_admin());
create policy "parents read own family" on families for select using (id = (select family_id from profiles where id = auth.uid()));
create policy "staff manage families" on families for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());

create policy "staff read students" on students for select using (school_id = current_school_id() or is_platform_admin());
create policy "parents read own students" on students for select using (family_id = (select family_id from profiles where id = auth.uid()));
create policy "staff manage students" on students for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());

create policy "staff read fee items" on fee_items for select using (school_id = current_school_id());
create policy "admins manage fee items" on fee_items for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());
create policy "staff read fee rules" on fee_rules for select using (school_id = current_school_id());
create policy "admins manage fee rules" on fee_rules for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());

create policy "staff read bills" on bills for select using (school_id = current_school_id());
create policy "parents read own bills" on bills for select using (family_id = (select family_id from profiles where id = auth.uid()));
create policy "admins generate bills" on bills for insert with check (school_id = current_school_id() and current_role() in ('school_admin','accountant'));
create policy "admins update bills" on bills for update using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());

create policy "read bill items through school" on bill_items for select using (school_id = current_school_id() or exists (select 1 from bills b where b.id = bill_id and b.family_id = (select family_id from profiles where id = auth.uid())));
create policy "admins manage bill items" on bill_items for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());

create policy "staff read payments" on payments for select using (school_id = current_school_id());
create policy "parents read own payments" on payments for select using (family_id = (select family_id from profiles where id = auth.uid()));
create policy "cashiers insert payments" on payments for insert with check (school_id = current_school_id() and current_role() in ('school_admin','accountant','cashier'));
create policy "no payment deletes" on payments for delete using (false);

create policy "staff read receipts" on receipts for select using (school_id = current_school_id());
create policy "parents read own receipts" on receipts for select using (family_id = (select family_id from profiles where id = auth.uid()));
create policy "receipts insert by trigger or staff" on receipts for insert with check (school_id = current_school_id() and current_role() in ('school_admin','accountant','cashier'));
create policy "no receipt deletes" on receipts for delete using (false);

create policy "staff read plans" on payment_plans for select using (school_id = current_school_id());
create policy "parents read own plans" on payment_plans for select using (family_id = (select family_id from profiles where id = auth.uid()));
create policy "admins manage plans" on payment_plans for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());
create policy "read installments" on payment_plan_installments for select using (school_id = current_school_id() or exists (select 1 from payment_plans p where p.id = payment_plan_id and p.family_id = (select family_id from profiles where id = auth.uid())));
create policy "admins manage installments" on payment_plan_installments for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());

create policy "staff read templates" on reminder_templates for select using (school_id = current_school_id());
create policy "admins manage templates" on reminder_templates for all using (school_id = current_school_id() and current_role() in ('school_admin','accountant')) with check (school_id = current_school_id());
create policy "staff read reminders" on reminders for select using (school_id = current_school_id());
create policy "parents read own reminders" on reminders for select using (family_id = (select family_id from profiles where id = auth.uid()));
create policy "staff create reminders" on reminders for insert with check (school_id = current_school_id() and current_role() in ('school_admin','accountant','cashier'));

create policy "audit insert only" on audit_logs for insert with check (school_id = current_school_id() or is_platform_admin());
create policy "audit read staff" on audit_logs for select using (school_id = current_school_id() and current_role() in ('school_admin','headteacher','accountant'));

create policy "platform subscriptions" on subscriptions for all using (is_platform_admin()) with check (is_platform_admin());
create policy "school reads subscription" on subscriptions for select using (school_id = current_school_id());
