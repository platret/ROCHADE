-- ROCHADE: Zugangscodes für die App.
-- Idempotent: kann mehrfach im Supabase SQL-Editor ausgeführt werden.

alter table public.projects add column if not exists admin_code text unique;
alter table public.households add column if not exists invite_code text unique;

update public.projects set admin_code = 'V7Q3KD' where id = 'a0000000-0000-4000-8000-000000000001';

update public.households set invite_code = '7KW4PD' where id = 'd0000000-0000-4000-8000-000000000001'; -- Familie Keller
update public.households set invite_code = '3HTX9M' where id = 'd0000000-0000-4000-8000-000000000002'; -- Frau Schmid
update public.households set invite_code = 'Q8RZ2N' where id = 'd0000000-0000-4000-8000-000000000003'; -- Familie Bianchi
update public.households set invite_code = '5MPC7E' where id = 'd0000000-0000-4000-8000-000000000004'; -- Herr Zimmermann
update public.households set invite_code = 'R2V6KX' where id = 'd0000000-0000-4000-8000-000000000005'; -- Familie Kaya
update public.households set invite_code = '9DQ3TW' where id = 'd0000000-0000-4000-8000-000000000006'; -- Frau Meier
update public.households set invite_code = 'X6N8HB' where id = 'd0000000-0000-4000-8000-000000000007'; -- Herr und Frau Aeschbacher
update public.households set invite_code = '4PWY7C' where id = 'd0000000-0000-4000-8000-000000000008'; -- Familie Oliveira
update public.households set invite_code = 'B3H7QK' where id = 'd0000000-0000-4000-8000-000000000009'; -- Herr Brunner
update public.households set invite_code = '6ZTR4M' where id = 'd0000000-0000-4000-8000-000000000010'; -- Frau Gerber
update public.households set invite_code = 'P7XK2D' where id = 'd0000000-0000-4000-8000-000000000011'; -- Familie Steiner

select name, invite_code from public.households where project_id = 'a0000000-0000-4000-8000-000000000001' order by name;
