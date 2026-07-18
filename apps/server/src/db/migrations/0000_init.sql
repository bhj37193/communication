-- Run as the trust-auth superuser (main) against the target database (charisma / charisma_test).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE entitlement_source AS ENUM ('paddle','apple','google','promo');
CREATE TYPE entitlement_status AS ENUM ('active','past_due','canceled');
CREATE TYPE session_state      AS ENUM ('open','scoring','scored','abandoned');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text NOT NULL UNIQUE,
  tz text NOT NULL DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source entitlement_source NOT NULL,
  product text NOT NULL,
  status entitlement_status NOT NULL,
  expires_at timestamptz,
  external_ref text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX entitlements_user_idx ON entitlements(user_id);

CREATE TABLE paddle_events (
  event_id text PRIMARY KEY,
  payload jsonb NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skill_packs (
  pack_id text PRIMARY KEY,
  version text NOT NULL,
  loaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skills (
  id text PRIMARY KEY,
  pack_id text NOT NULL REFERENCES skill_packs(pack_id),
  name text NOT NULL,
  objective text NOT NULL,
  prerequisites text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE units (
  id text PRIMARY KEY,
  skill_id text NOT NULL REFERENCES skills(id),
  spec jsonb NOT NULL
);

CREATE TABLE progress_events (
  seq bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('session_started','message_exchanged',
    'attempt_submitted','unit_passed','unit_failed','skill_mastered',
    'review_scheduled','review_passed','review_failed','placement_set',
    'streak_updated','entitlement_changed')),
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX progress_events_user_idx ON progress_events(user_id, seq);

CREATE TABLE user_skill_state (
  user_id uuid NOT NULL,
  skill_id text NOT NULL,
  status text NOT NULL DEFAULT 'locked',
  passes integer NOT NULL DEFAULT 0,
  last_pass_date date,
  review_box integer,
  review_due_at timestamptz,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id text NOT NULL REFERENCES units(id),
  state session_state NOT NULL DEFAULT 'open',
  warmth integer NOT NULL DEFAULT 0 CHECK (warmth BETWEEN 0 AND 3),
  warmth_trace jsonb NOT NULL DEFAULT '[]',
  character_calls integer NOT NULL DEFAULT 0,
  feedback_calls integer NOT NULL DEFAULT 0,
  incognito boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
CREATE UNIQUE INDEX sessions_one_open_per_user ON sessions(user_id) WHERE state = 'open';

CREATE TABLE transcripts (
  session_id uuid PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]',
  expires_at timestamptz NOT NULL
);
CREATE INDEX transcripts_expiry_idx ON transcripts(expires_at);

CREATE TABLE results (
  session_id uuid PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  win jsonb NOT NULL, fix jsonb NOT NULL, moment jsonb NOT NULL,
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed boolean NOT NULL,
  signals jsonb NOT NULL,
  template_fallback boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL
);
CREATE INDEX results_expiry_idx ON results(expires_at);

CREATE TABLE daily_usage (
  user_id uuid NOT NULL,
  day date NOT NULL,
  scored_count integer NOT NULL DEFAULT 0,
  incognito_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

CREATE TABLE model_usage (
  id bigserial PRIMARY KEY,
  session_id uuid,
  tag text NOT NULL,
  tokens_in integer NOT NULL,
  tokens_out integer NOT NULL,
  cached_in integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX model_usage_day_idx ON model_usage(created_at);

CREATE TABLE analytics_events (
  id bigserial PRIMARY KEY,
  user_id uuid,
  name text NOT NULL CHECK (name IN ('signup','challenge_viewed','session_started',
    'session_completed','result_viewed','share_tapped','d1_return','streak_broken',
    'paywall_viewed','subscribe_started','subscribe_completed')),
  props jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE eval_transcripts (
  id bigserial PRIMARY KEY,
  messages jsonb NOT NULL,
  warmth_trace jsonb NOT NULL,
  signals jsonb NOT NULL,
  score integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- SD-8: least-privilege app role, local trust auth (no password, matches superuser `main`).
-- Role is cluster-wide (not per-database), so this migration runs against both `charisma`
-- and `charisma_test` on the same cluster; guard creation so the second run doesn't fail.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'charisma_app') THEN
    CREATE ROLE charisma_app LOGIN;
  END IF;
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO charisma_app', current_database());
END $$;
GRANT USAGE ON SCHEMA public TO charisma_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO charisma_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO charisma_app;
REVOKE UPDATE, DELETE ON progress_events FROM charisma_app;

CREATE FUNCTION delete_user_data(p_user_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM results  WHERE session_id IN (SELECT id FROM sessions WHERE user_id = p_user_id);
  DELETE FROM transcripts WHERE session_id IN (SELECT id FROM sessions WHERE user_id = p_user_id);
  DELETE FROM sessions WHERE user_id = p_user_id;
  DELETE FROM progress_events WHERE user_id = p_user_id;
  DELETE FROM analytics_events WHERE user_id = p_user_id;
  DELETE FROM daily_usage WHERE user_id = p_user_id;
  DELETE FROM user_skill_state WHERE user_id = p_user_id;
  DELETE FROM entitlements WHERE user_id = p_user_id;
  DELETE FROM users WHERE id = p_user_id;
END $$;
GRANT EXECUTE ON FUNCTION delete_user_data(uuid) TO charisma_app;
