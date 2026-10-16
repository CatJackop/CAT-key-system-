CREATE TABLE IF NOT EXISTS hub_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL DEFAULT 'cat-',
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_hours INTEGER NOT NULL CHECK (duration_hours > 0),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS hub_keys_created_at_idx ON hub_keys (created_at DESC);
CREATE INDEX IF NOT EXISTS hub_keys_expires_at_idx ON hub_keys (expires_at);
