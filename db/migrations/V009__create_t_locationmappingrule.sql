CREATE TYPE location_mapping_type AS ENUM ('HRIS', 'ATS', 'TD');

--
-- Location Mapping Rule table
--
CREATE TABLE locationmappingrule (
    location_mapping_rule_id SERIAL PRIMARY KEY, 
    location_id UUID NOT NULL REFERENCES location(location_id),
    client_id UUID NOT NULL REFERENCES client(client_id),
    type location_mapping_type NOT NULL,
    external_location_id TEXT NOT NULL
);

--
-- Location Mapping Rule audit table.
--
CREATE TABLE audit.locationmappingrule_audit (
    location_mapping_rule_id INT NOT NULL,
    client_id UUID NOT NULL,
    location_id UUID NOT NULL,
    type location_mapping_type NOT NULL,
    external_location_id TEXT NOT NULL
) inherits (audit.audit_event);

--
-- Location Mapping Rule audit trigger.
--
create trigger audit_trigger after insert or update or delete on entity_resolution.locationmappingrule
  for each row execute procedure audit.audit_log_event('locationmappingrule_audit', 'location_mapping_rule_id');
