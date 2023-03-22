ALTER TABLE location
ADD td_enabled boolean not null default false,
ADD retention_enabled boolean not null default false;

ALTER TABLE audit.location_audit
ADD td_enabled boolean,
ADD retention_enabled boolean;
