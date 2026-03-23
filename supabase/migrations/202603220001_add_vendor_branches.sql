-- Create vendor_branches table for multi-branch vendors
create table if not exists public.vendor_branches (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  branch_name text not null,
  location_id uuid references public.locations(id) on delete set null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add contact person fields to vendors table for multi-branch flow
alter table public.vendors
  add column if not exists contact_person text,
  add column if not exists contact_phone text,
  add column if not exists contact_email text;

-- Index for fast lookup by vendor
create index if not exists idx_vendor_branches_vendor_id
  on public.vendor_branches(vendor_id);

-- Enable RLS
alter table public.vendor_branches enable row level security;

-- RLS: Vendor admins can manage their own branches
create policy "vendor_branches_select"
  on public.vendor_branches for select
  using (
    vendor_id in (
      select id from public.vendors where admin_id = auth.uid()
    )
  );

create policy "vendor_branches_insert"
  on public.vendor_branches for insert
  with check (
    vendor_id in (
      select id from public.vendors where admin_id = auth.uid()
    )
  );

create policy "vendor_branches_update"
  on public.vendor_branches for update
  using (
    vendor_id in (
      select id from public.vendors where admin_id = auth.uid()
    )
  );

create policy "vendor_branches_delete"
  on public.vendor_branches for delete
  using (
    vendor_id in (
      select id from public.vendors where admin_id = auth.uid()
    )
  );
