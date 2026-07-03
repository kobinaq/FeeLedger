insert into schools (id, name, address, phone, email, currency, status)
values ('00000000-0000-0000-0000-000000000001', 'Gracefield Preparatory School', '12 Independence Avenue, Accra', '+233 30 245 7788', 'accounts@gracefield.test', 'GHS', 'active')
on conflict (id) do update set name = excluded.name, address = excluded.address, phone = excluded.phone, email = excluded.email;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
('01000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','platform@feeledger.test',crypt('demo12345', gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
('01000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','proprietor@gracefield.test',crypt('demo12345', gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
('01000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','headteacher@gracefield.test',crypt('demo12345', gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
('01000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','accountant@gracefield.test',crypt('demo12345', gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
('01000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cashier@gracefield.test',crypt('demo12345', gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
('01000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','parent@gracefield.test',crypt('demo12345', gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now())
on conflict (id) do update set
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

update auth.users
set
  aud = 'authenticated',
  role = 'authenticated',
  encrypted_password = crypt('demo12345', gen_salt('bf')),
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_app_meta_data = '{"provider":"email","providers":["email"]}',
  raw_user_meta_data = coalesce(raw_user_meta_data, '{}'),
  updated_at = now()
where email in (
  'platform@feeledger.test',
  'proprietor@gracefield.test',
  'headteacher@gracefield.test',
  'accountant@gracefield.test',
  'cashier@gracefield.test',
  'parent@gracefield.test'
);

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
(gen_random_uuid(),'01000000-0000-0000-0000-000000000001','01000000-0000-0000-0000-000000000001','{"sub":"01000000-0000-0000-0000-000000000001","email":"platform@feeledger.test"}','email',now(),now(),now()),
(gen_random_uuid(),'01000000-0000-0000-0000-000000000002','01000000-0000-0000-0000-000000000002','{"sub":"01000000-0000-0000-0000-000000000002","email":"proprietor@gracefield.test"}','email',now(),now(),now()),
(gen_random_uuid(),'01000000-0000-0000-0000-000000000003','01000000-0000-0000-0000-000000000003','{"sub":"01000000-0000-0000-0000-000000000003","email":"headteacher@gracefield.test"}','email',now(),now(),now()),
(gen_random_uuid(),'01000000-0000-0000-0000-000000000004','01000000-0000-0000-0000-000000000004','{"sub":"01000000-0000-0000-0000-000000000004","email":"accountant@gracefield.test"}','email',now(),now(),now()),
(gen_random_uuid(),'01000000-0000-0000-0000-000000000005','01000000-0000-0000-0000-000000000005','{"sub":"01000000-0000-0000-0000-000000000005","email":"cashier@gracefield.test"}','email',now(),now(),now()),
(gen_random_uuid(),'01000000-0000-0000-0000-000000000006','01000000-0000-0000-0000-000000000006','{"sub":"01000000-0000-0000-0000-000000000006","email":"parent@gracefield.test"}','email',now(),now(),now())
on conflict (provider_id, provider) do update set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = now();

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select
  gen_random_uuid(),
  u.id,
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  now(),
  now(),
  now()
from auth.users u
where u.email in (
  'platform@feeledger.test',
  'proprietor@gracefield.test',
  'headteacher@gracefield.test',
  'accountant@gracefield.test',
  'cashier@gracefield.test',
  'parent@gracefield.test'
)
on conflict (provider_id, provider) do update set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = now();

insert into profiles (id, school_id, family_id, full_name, email, role) values
('01000000-0000-0000-0000-000000000001', null, null, 'Platform Owner', 'platform@feeledger.test', 'platform_admin'),
('01000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', null, 'Mrs. Evelyn Mensah', 'proprietor@gracefield.test', 'school_admin'),
('01000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', null, 'Mr. Daniel Armah', 'headteacher@gracefield.test', 'headteacher'),
('01000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', null, 'Abena Osei', 'accountant@gracefield.test', 'accountant'),
('01000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', null, 'Kojo Appiah', 'cashier@gracefield.test', 'cashier'),
('01000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', null, 'Ama Boateng', 'parent@gracefield.test', 'parent')
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;

insert into academic_years (id, school_id, name, starts_on, ends_on)
values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026 Academic Year', '2026-01-06', '2026-12-18')
on conflict (id) do nothing;

insert into terms (id, school_id, academic_year_id, name, starts_on, ends_on, is_current)
values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2026 Term 1', '2026-01-06', '2026-04-10', true)
on conflict (id) do update set is_current = true;

insert into classes (id, school_id, name, sort_order) values
('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Nursery 1',1),
('30000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Nursery 2',2),
('30000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','KG 1',3),
('30000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','KG 2',4),
('30000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','Basic 1',5),
('30000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001','Basic 2',6),
('30000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001','Basic 3',7),
('30000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000001','Basic 4',8),
('30000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000001','Basic 5',9),
('30000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','Basic 6',10),
('30000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001','JHS 1',11),
('30000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000001','JHS 2',12),
('30000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000001','JHS 3',13)
on conflict (id) do nothing;

insert into families (id, school_id, guardian_full_name, phone, email, address, notes) values
('40000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Ama Boateng','+233 24 111 0001','parent@gracefield.test','East Legon, Accra','Prefers SMS reminders.'),
('40000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Kwame Asare','+233 24 111 0002','kwame@example.test','Adenta, Accra','On payment plan.'),
('40000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Efua Sarpong','+233 24 111 0003','efua@example.test','Dansoman, Accra','Pays by bank transfer.'),
('40000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','Yaw Prempeh','+233 24 111 0004','yaw@example.test','Madina, Accra','Needs printed receipts.'),
('40000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','Akosua Owusu','+233 24 111 0005','akosua@example.test','Tema Community 11','Transport user.'),
('40000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001','Joseph Nartey','+233 24 111 0006','joseph@example.test','Spintex, Accra','Full payment received.')
on conflict (id) do update set guardian_full_name = excluded.guardian_full_name;

update profiles set family_id = '40000000-0000-0000-0000-000000000001' where id = '01000000-0000-0000-0000-000000000006';

insert into students (id, school_id, family_id, class_id, first_name, last_name, student_code, optional_services) values
('50000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','Ama','Boateng','GPS-B1-001','{feeding}'),
('50000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','Kojo','Boateng','GPS-KG1-014','{feeding,transport}'),
('50000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000011','Nana','Asare','GPS-J1-003','{"extra classes"}'),
('50000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000008','Kofi','Asare','GPS-B4-010','{feeding}'),
('50000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000013','Esi','Sarpong','GPS-J3-002','{books}'),
('50000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000010','Yaw','Sarpong','GPS-B6-020','{transport}'),
('50000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000006','Afia','Prempeh','GPS-B2-009','{feeding}'),
('50000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000002','Kwaku','Prempeh','GPS-N2-006','{feeding,transport}'),
('50000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000007','Adwoa','Owusu','GPS-B3-022','{transport}'),
('50000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000004','Kwesi','Owusu','GPS-KG2-018','{feeding}'),
('50000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000012','Mansa','Nartey','GPS-J2-007','{"extra classes"}'),
('50000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000009','Selorm','Nartey','GPS-B5-012','{feeding}')
on conflict (school_id, student_code) do nothing;

insert into fee_items (id, school_id, name, category, is_required, default_due_date, description) values
('60000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Tuition','tuition',true,'2026-02-15','Main teaching fee for the term.'),
('60000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Feeding','feeding',false,'2026-02-15','Lunch service for selected children.'),
('60000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Transport','transport',false,'2026-02-15','School bus service.'),
('60000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','Books','books',true,'2026-02-15','Term learning materials.'),
('60000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','Examination Fee','examination',true,'2026-03-15','Assessment and printing fee.')
on conflict (id) do nothing;

insert into fee_rules (school_id, term_id, class_id, fee_item_id, amount, is_required, due_date)
select '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', c.id, f.id,
case f.category when 'tuition' then 950 + c.sort_order * 70 when 'feeding' then 480 when 'transport' then 650 when 'books' then 220 else 150 end,
f.is_required, coalesce(f.default_due_date, '2026-02-15')
from classes c cross join fee_items f
where c.school_id = '00000000-0000-0000-0000-000000000001'
on conflict (term_id, class_id, fee_item_id) do nothing;

insert into bills (id, school_id, family_id, student_id, term_id, bill_number, status, total_amount, paid_amount, due_date, published_at)
select gen_random_uuid(), s.school_id, s.family_id, s.id, '20000000-0000-0000-0000-000000000001',
'BILL-2026-' || lpad(row_number() over (order by s.student_code)::text, 4, '0'),
case when row_number() over (order by s.student_code) in (11,12) then 'paid'::bill_status when row_number() over (order by s.student_code) = 9 then 'overdue'::bill_status else 'partially_paid'::bill_status end,
1800 + row_number() over (order by s.student_code) * 90,
0,
'2026-02-15', now()
from students s
where s.school_id = '00000000-0000-0000-0000-000000000001'
on conflict (school_id, bill_number) do nothing;

insert into bill_items (school_id, bill_id, fee_item_id, description, amount)
select b.school_id, b.id, f.id, f.name,
case f.category when 'tuition' then greatest(1000, b.total_amount - 370) when 'books' then 220 else 150 end
from bills b
join fee_items f on f.school_id = b.school_id and f.category in ('tuition','books','examination')
where not exists (select 1 from bill_items bi where bi.bill_id = b.id);

insert into payments (school_id, family_id, student_id, bill_id, amount, method, reference_number, payment_date, notes, recorded_by)
select b.school_id, b.family_id, b.student_id, b.id,
case
  when right(b.bill_number, 4)::int in (11,12) then b.total_amount
  else right(b.bill_number, 4)::int * 180
end,
'mobile money', 'SEED-' || b.bill_number, '2026-01-27', 'Seed payment', '01000000-0000-0000-0000-000000000005'
from bills b
where right(b.bill_number, 4)::int <> 9
and not exists (select 1 from payments p where p.bill_id = b.id);

insert into payment_plans (id, school_id, family_id, total_balance, status, approved_by, notes)
values ('90000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002',2140,'active','01000000-0000-0000-0000-000000000004','Guardian will pay in three instalments before end of term.')
on conflict (id) do nothing;

insert into payment_plan_installments (school_id, payment_plan_id, due_date, amount, paid_amount, status) values
('00000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','2026-02-15',700,700,'paid'),
('00000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','2026-03-15',720,0,'pending'),
('00000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','2026-04-05',720,0,'pending');

insert into reminder_templates (school_id, name, type, channel, body) values
('00000000-0000-0000-0000-000000000001','Polite balance reminder','arrears reminder','both','Dear Parent, your current school fee balance is GHS {{balance}}. Kindly arrange payment by {{due_date}}. Thank you.'),
('00000000-0000-0000-0000-000000000001','Family balance reminder','family reminder','sms','Dear {{guardian_name}}, your total family balance for {{children_names}} is GHS {{balance}}. Please contact the accounts office if you need a payment plan.'),
('00000000-0000-0000-0000-000000000001','Payment plan instalment','payment plan instalment reminder','both','Dear {{guardian_name}}, your next payment plan instalment of GHS {{amount}} is due on {{due_date}}. Thank you.');

insert into school_payment_methods (school_id, name) values
('00000000-0000-0000-0000-000000000001','cash'),
('00000000-0000-0000-0000-000000000001','mobile money'),
('00000000-0000-0000-0000-000000000001','bank transfer'),
('00000000-0000-0000-0000-000000000001','cheque'),
('00000000-0000-0000-0000-000000000001','card/POS');

insert into subscriptions (school_id, plan, status)
values ('00000000-0000-0000-0000-000000000001', 'growth', 'active');
