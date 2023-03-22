--
-- Modify tables to use text instead of varchar - same performance, but we don't have
-- to worry about errors due to long string values.
--
alter table entity_resolution.client
  alter column lookup_name type text,
  alter column display_name type text;

alter table entity_resolution.location
  alter column client_facing_name type text,
  alter column applicant_facing_name type text;
 
--
-- Add created_at and updated_at columns for these tables.
--
alter table entity_resolution.client
  add column created_at timestamptz not null default now(),
  add column updated_at timestamptz not null default now();

alter table entity_resolution.location
  add column created_at timestamptz not null default now(),
  add column updated_at timestamptz not null default now();

--
-- Generic trigger function; can be re-used across tables as long as the
-- `updated_at` field is present. Skips updating timestamp on no-op updates
-- to prevent filling our audit logs with useless upsert events.
--
create or replace function trigger_set_updated_at() returns trigger as $body$
begin
  if new is distinct from old then
    new.updated_at = now();
  end if;
  return new;
end
$body$
language plpgsql;

--
-- Set up the trigger function on the tables.
--
create trigger set_updated_at before update on entity_resolution.client
  for each row execute procedure trigger_set_updated_at();

create trigger set_updated_at before update on entity_resolution.location
  for each row execute procedure trigger_set_updated_at();
