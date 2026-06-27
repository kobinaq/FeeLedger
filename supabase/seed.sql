insert into schools (id, name, address, phone, email, currency, status)
values ('00000000-0000-0000-0000-000000000001', 'Gracefield Preparatory School', '12 Independence Avenue, Accra', '+233 30 245 7788', 'accounts@gracefield.test', 'GHS', 'active');

insert into academic_years (id, school_id, name, starts_on, ends_on)
values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026 Academic Year', '2026-01-06', '2026-12-18');

insert into terms (id, school_id, academic_year_id, name, starts_on, ends_on, is_current)
values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2026 Term 1', '2026-01-06', '2026-04-10', true);

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
('30000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000001','JHS 3',13);

insert into families (id, school_id, guardian_full_name, phone, email, address, notes) values
('40000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Ama Boateng','+233 24 111 0001','parent@gracefield.test','East Legon, Accra','Prefers SMS reminders.'),
('40000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Kwame Asare','+233 24 111 0002','kwame@example.test','Adenta, Accra','On payment plan.'),
('40000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Efua Sarpong','+233 24 111 0003','efua@example.test','Dansoman, Accra','Pays by bank transfer.'),
('40000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','Yaw Prempeh','+233 24 111 0004','yaw@example.test','Madina, Accra','Needs printed receipts.'),
('40000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','Akosua Owusu','+233 24 111 0005','akosua@example.test','Tema Community 11','Transport user.'),
('40000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000001','Joseph Nartey','+233 24 111 0006','joseph@example.test','Spintex, Accra','Full payment received.');

insert into students (id, school_id, family_id, class_id, first_name, last_name, student_code, optional_services) values
('50000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','Ama','Boateng','GPS-B1-001','{feeding}'),
('50000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','Kojo','Boateng','GPS-KG1-014','{feeding,transport}'),
('50000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000011','Nana','Asare','GPS-J1-003','{"extra classes"}'),
('50000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000008','Kofi','Asare','GPS-B4-010','{feeding}');

insert into fee_items (id, school_id, name, category, is_required, default_due_date, description) values
('60000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Tuition','tuition',true,'2026-02-15','Main teaching fee for the term.'),
('60000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Feeding','feeding',false,'2026-02-15','Lunch service for selected children.'),
('60000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Transport','transport',false,'2026-02-15','School bus service.'),
('60000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','Books','books',true,'2026-02-15','Term learning materials.'),
('60000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','Examination Fee','examination',true,'2026-03-15','Assessment and printing fee.');

insert into fee_rules (school_id, term_id, class_id, fee_item_id, amount, is_required, due_date)
select '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', c.id, f.id,
case f.category when 'tuition' then 950 + c.sort_order * 70 when 'feeding' then 480 when 'transport' then 650 when 'books' then 220 else 150 end,
f.is_required, coalesce(f.default_due_date, '2026-02-15')
from classes c cross join fee_items f
where c.school_id = '00000000-0000-0000-0000-000000000001';

insert into bills (id, school_id, family_id, student_id, term_id, bill_number, status, total_amount, paid_amount, due_date, published_at) values
('70000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','BILL-2026-0001','partially_paid',2540,1200,'2026-02-15',now()),
('70000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','BILL-2026-0002','partially_paid',3190,900,'2026-02-15',now()),
('70000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001','BILL-2026-0003','partially_paid',2090,1200,'2026-02-15',now());

insert into bill_items (school_id, bill_id, fee_item_id, description, amount)
select b.school_id, b.id, f.id, f.name, case f.category when 'tuition' then b.total_amount - 370 else 185 end
from bills b cross join fee_items f
where f.category in ('tuition','books','examination');

insert into payments (id, school_id, family_id, student_id, bill_id, amount, method, reference_number, payment_date, notes) values
('80000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000001',1200,'mobile money','MOMO-82101','2026-01-18','Initial payment'),
('80000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000002',900,'cash','CASH-112','2026-01-20','Cashier receipt'),
('80000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000003',1200,'bank transfer','BT-7781','2026-01-21','Bank transfer');

insert into payment_plans (id, school_id, family_id, total_balance, status, notes)
values ('90000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002',2140,'active','Guardian will pay in three instalments before end of term.');

insert into payment_plan_installments (school_id, payment_plan_id, due_date, amount, paid_amount, status) values
('00000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','2026-02-15',700,700,'paid'),
('00000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','2026-03-15',720,0,'pending'),
('00000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','2026-04-05',720,0,'pending');

insert into reminder_templates (school_id, name, type, channel, body) values
('00000000-0000-0000-0000-000000000001','Polite balance reminder','arrears reminder','both','Dear Parent, your current school fee balance is GHS {{balance}}. Kindly arrange payment by {{due_date}}. Thank you.'),
('00000000-0000-0000-0000-000000000001','Family balance reminder','family reminder','sms','Dear {{guardian_name}}, your total family balance for {{children_names}} is GHS {{balance}}. Please contact the accounts office if you need a payment plan.'),
('00000000-0000-0000-0000-000000000001','Payment plan instalment','payment plan instalment reminder','both','Dear {{guardian_name}}, your next payment plan instalment of GHS {{amount}} is due on {{due_date}}. Thank you.');

insert into subscriptions (school_id, plan, status)
values ('00000000-0000-0000-0000-000000000001', 'growth', 'active');
