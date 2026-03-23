alter table public.vendors
add column if not exists business_type text,
add column if not exists payout_method text,
add column if not exists bank_name text,
add column if not exists bank_account_name text,
add column if not exists bank_account_number text,
add column if not exists terms_and_conditions text;
