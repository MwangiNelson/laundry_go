-- Add parent_vendor_id to vendors table (branch-as-sub-vendor pattern)
ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS parent_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vendors_parent_vendor_id ON vendors(parent_vendor_id);

-- Add invitation tracking columns to vendor_branches
ALTER TABLE vendor_branches
  ADD COLUMN IF NOT EXISTS invitation_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS branch_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;

-- RLS: Allow branch vendors to read their parent vendor's basic info
CREATE POLICY "Branch vendors can read parent vendor"
  ON vendors FOR SELECT
  USING (
    id IN (
      SELECT parent_vendor_id FROM vendors WHERE admin_id = auth.uid()
    )
  );
