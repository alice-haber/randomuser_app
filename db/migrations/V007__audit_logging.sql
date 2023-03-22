--
-- We use the hstore extension to support generic key/value processing of audit records
-- that can be shared across table types.
--
create extension if not exists hstore with schema public;

--
-- Base audit table - all per-table audit logs should inherit from this.
-- Prefix column names with `audit_` to differentiate from data columns being audited.
--
create table audit.audit_event (
  audit_event_id bigserial primary key,
  audit_event_type text not null check (audit_event_type in ('I', 'D', 'U')),
  audit_schema_name text not null,
  audit_table_name text not null,
  audit_db_user text not null,
  audit_app_user text not null,
  audit_timestamp timestamptz not null,
  audit_transaction_id bigint not null,
  audit_application_name text,
  audit_client_addr inet,
  audit_client_query text not null
);

--
-- Trigger function for audit event logging. Accepts two or three parameters:
--   * The name of the audit table to write to.
--   * The name of the primary-key column in the table under audit; will be used
--     to correlated audit events for a given record.
--   * (Optional) An array of column names to exclude from auditing.
--
create or replace function audit.audit_log_event() returns trigger as $body$
declare
  audit_tbl text;
  pk_col text;
  h_old hstore;
  h_new hstore;
  h_audit hstore;
  audit_evt audit.audit_event;
  user_name text;
  h_id hstore;
  excluded_cols text[] := array['created_at', 'updated_at'];
  missing_cols text[];
begin
  -- Enforce basic usage
  if TG_WHEN != 'AFTER' or TG_LEVEL != 'ROW' then
    raise TRIGGER_PROTOCOL_VIOLATED using MESSAGE = 'function "audit_log_event" must be fired AFTER ROW';
  elsif TG_OP != 'INSERT' and TG_OP != 'UPDATE' and TG_OP != 'DELETE' then
    raise TRIGGER_PROTOCOL_VIOLATED using MESSAGE = 'function "audit_log_event" must be fired for INSERT or UPDATE or DELETE';
  end if;
 
  -- Check trigger parameters
  if TG_NARGS not in (2, 3) then
    raise INVALID_PARAMETER_VALUE using MESSAGE = 'function "audit_log_event" must be called with 2 parameters';
  end if;
 
  audit_tbl := format('%I', TG_ARGV[0]);
  pk_col := TG_ARGV[1];
  if TG_ARGV[2] is not null then
    excluded_cols := TG_ARGV[2];
  end if;
  
  -- Validate user-name session variable is present and valid format.
  user_name := nullif(current_setting('app.user_name'), '');
  if user_name is null then
    raise exception 'Must provide app.user_name for auditing.';
  elsif user_name not similar to '(user|service):%' then
    raise exception 'Invalid app.user_name format';
  end if;

  -- Use hstore for old/new to enable easy merging into the audit row structure without
  -- requiring alignment of column names, to make us resilient to column deletions in the audit table.
  h_old := hstore(old);
  h_new := hstore(new);
  h_id := slice(h_old, array[pk_col]);
 
  -- Future-proofing: Raise an exception if the updated row has columns not present in the
  -- audit table. This should get caught during testing when adding new columns and force us
  -- to make corresponding additions to the audit table.
  execute 'select hstore(null::audit.' || audit_tbl || ')' into h_audit;
  missing_cols := akeys(h_new - akeys(h_audit) - excluded_cols);
  if array_length(missing_cols, 1) > 0 then
  	raise exception 'Missing audit columns for %.%: %', TG_TABLE_SCHEMA, TG_TABLE_NAME, missing_cols;
  end if;
  
  -- Populate the base audit columns using metadata about the trigger event.
  audit_evt := row(
    nextval('audit.audit_event_audit_event_id_seq'), -- audit_event_id
    substring(TG_OP, 1, 1),                          -- audit_event_type
    TG_TABLE_SCHEMA::text,                           -- audit_schema_name
    TG_TABLE_NAME::text,                             -- audit_table_name
    session_user::text,                              -- audit_db_user
    user_name,                                       -- audit_app_user
    current_timestamp,                               -- audit_timestamp
    txid_current(),                                  -- audit_transaction_id
    current_setting('application_name'),             -- audit_application_name
    inet_client_addr(),                              -- audit_client_addr
    current_query()                                  -- audit_client_query
  );

  -- Initialize audited row with old ID, to capture PKs of deleted rows
  h_audit := hstore(audit_evt) || h_id;

  -- Merge in values from the new state of the row that was updated.
  if defined(h_new, pk_col) then
    -- Early return to exclude no-op updates from audit log.
    if h_old is not distinct from h_new then
      return null;
    end if;

    -- Reject modifications to primary-key column as this will break the audit trail
    -- (and also invalidate externally-store UUIDs)
    if TG_OP = 'UPDATE' and not h_new @> h_id then
      raise exception 'Cannot reassign primary-key column (%) for table %.%', pk_col, TG_TABLE_SCHEMA, TG_TABLE_NAME;
    end if;
    h_audit := h_audit || (h_new - excluded_cols);
  end if;
 
  -- Insert the new row into the audit table
  execute 'insert into audit.' || audit_tbl || ' values ((populate_record(null::audit.' || audit_tbl ||', $1)).*)' using h_audit;

  return null;
end
$body$
language plpgsql
security definer;

--
-- Location audit table.
--
create table audit.location_audit (
  location_id uuid not null,
  client_id uuid,
  client_facing_name text,
  applicant_facing_name text,
  is_archived boolean
) inherits (audit.audit_event);

--
-- Location audit trigger.
--
create trigger audit_trigger after insert or update or delete on entity_resolution.location
  for each row execute procedure audit.audit_log_event('location_audit', 'location_id');

--
-- Client audit table.
--
create table audit.client_audit (
  client_id uuid not null,
  lookup_name text,
  display_name text
) inherits (audit.audit_event);

--
-- Client audit trigger.
--
create trigger audit_trigger after insert or update or delete on entity_resolution.client
  for each row execute procedure audit.audit_log_event('client_audit', 'client_id');
